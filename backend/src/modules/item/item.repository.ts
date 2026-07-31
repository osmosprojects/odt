import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemMasterEntity } from '../../database/migrations/item-master.entity';

@Injectable()
export class ItemRepository {
  constructor(
    @InjectRepository(ItemMasterEntity)
    private repo: Repository<ItemMasterEntity>,
  ) {}

  async searchItems(
    q: string,
    stream?: string,
    page = 1,
    limit = 30,
  ): Promise<{ data: ItemMasterEntity[]; total: number }> {
    const qb = this.repo.createQueryBuilder('i');

    if (stream) {
      qb.andWhere('i.stream = :stream', { stream: stream.toUpperCase() });
    }

    if (q && q.trim().length >= 2) {
      const term = `%${q.trim()}%`;
      qb.andWhere(
        '(i.sku_code LIKE :term OR i.brand_name LIKE :term OR i.product_key LIKE :term)',
        { term },
      );
    }

    qb.andWhere('i.sku_code IS NOT NULL').andWhere("i.sku_code != ''");
    qb.orderBy('i.brand_name', 'ASC').skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  findBySkuCode(skuCode: string): Promise<ItemMasterEntity | null> {
    return this.repo.findOne({ where: { sku_code: skuCode } });
  }

  async findLbmPvMapBySkuCodes(
    skuCodes: string[],
    stream?: string,
  ): Promise<Map<string, { lbm: string; pv: string }>> {
    const map = new Map<string, { lbm: string; pv: string }>();
    if (!skuCodes || skuCodes.length === 0) return map;

    const cleanCodes = Array.from(
      new Set(skuCodes.map((c) => (c || '').trim()).filter(Boolean)),
    );
    if (cleanCodes.length === 0) return map;

    const cleanStream = (stream || '').trim().toUpperCase();

    try {
      const qb = this.repo
        .createQueryBuilder('i')
        .select(['i.sku_code', 'i.stream', 'i.lbm', 'i.pv'])
        .where('i.sku_code IN (:...cleanCodes)', { cleanCodes });

      if (cleanStream) {
        qb.andWhere('UPPER(i.stream) = :cleanStream', { cleanStream });
      }

      const rawResults = await qb.getRawMany();

      for (const r of rawResults) {
        const code = (r.i_sku_code || r.sku_code || '').trim();
        if (code) {
          map.set(code, {
            lbm: r.i_lbm ?? r.lbm ?? '',
            pv: r.i_pv ?? r.pv ?? '',
          });
        }
      }
    } catch (err) {
      console.error('[ItemRepository] Error fetching batch LBM/PV:', err);
    }
    return map;
  }
}
