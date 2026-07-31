import { Injectable } from '@nestjs/common';
import { ItemRepository } from './item.repository';

export interface SkuSearchResult {
  itemId: number;
  stream: string;
  skuCode: string;
  description: string;
  brandName: string;
  packSize: string;
  uom: string;
  baseTO: number;
  mrp: number;
  cogs: number;
  nhf: number;
  gmLevel: string;
  // Derived incentive fields for frontend calculations
  recMixIncentive: number;
  mixIncentive: number;
  skuRebate: number;
  productTargetIncentive: number;
  lbm?: string;
  pv?: string;
}

@Injectable()
export class ItemService {
  constructor(private itemRepo: ItemRepository) {}

  async searchItems(
    q: string,
    stream?: string,
    page = 1,
    limit = 30,
  ): Promise<{ data: SkuSearchResult[]; total: number; page: number; limit: number }> {
    const { data, total } = await this.itemRepo.searchItems(q, stream, page, limit);

    const lbmPvMap = await this.itemRepo.findLbmPvMapBySkuCodes(
      data.map((item) => item.sku_code),
      stream,
    );

    const mapped = data.map((item) => {
      const baseTO = parseFloat(item.new_price) || 0;
      const cogs = parseFloat(item.cogs) || 0;
      const nhf = parseFloat(item.net_hard_floor) || 0;
      const mrp = parseFloat(item.new_mrp) || 0;

      // Derive recommended mix incentive = margin % as Rs/Ltr
      const margin = baseTO > 0 ? ((baseTO - cogs) / baseTO) * baseTO : 0;
      const recMixIncentive = parseFloat((margin * 0.05).toFixed(4));

      const lbmPv = lbmPvMap.get((item.sku_code || '').trim()) || {
        lbm: item.lbm || '',
        pv: item.pv || '',
      };

      return {
        itemId: item.item_id,
        stream: item.stream,
        skuCode: item.sku_code,
        description: item.product_key || item.brand_name,
        brandName: item.brand_name,
        packSize: item.packsize,
        uom: item.uom || 'Ltr',
        baseTO,
        mrp,
        cogs,
        nhf,
        gmLevel: item.gm_level || 'N',
        recMixIncentive: parseFloat(recMixIncentive.toFixed(4)),
        mixIncentive: parseFloat(recMixIncentive.toFixed(4)),
        skuRebate: 0,
        productTargetIncentive: 0,
        lbm: lbmPv.lbm || '',
        pv: lbmPv.pv || '',
      } satisfies SkuSearchResult;
    });

    return { data: mapped, total, page, limit };
  }
}
