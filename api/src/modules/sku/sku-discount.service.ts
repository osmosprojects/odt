// PHP equivalent: sku_price, sku_discount, check_sku_item_value (ajax_sku_code)
import { Injectable, BadRequestException } from '@nestjs/common';

export interface DiscountResult {
  skuCode: string;
  listPrice: number;
  discountPercent: number;
  discountedPrice: number;
  volume: number;
}

// Volume-tiered discount bands — adjust thresholds to match real PHP logic once available
const VOLUME_DISCOUNT_TIERS: { minVolume: number; discountPercent: number }[] = [
  { minVolume: 1000, discountPercent: 15 },
  { minVolume: 500, discountPercent: 10 },
  { minVolume: 100, discountPercent: 5 },
  { minVolume: 0, discountPercent: 0 },
];

@Injectable()
export class SkuDiscountService {
  calculateDiscount(skuCode: string, volume: number, listPrice: number): DiscountResult {
    if (!skuCode) throw new BadRequestException('skuCode is required');
    if (volume < 0) throw new BadRequestException('volume cannot be negative');
    if (listPrice < 0) throw new BadRequestException('listPrice cannot be negative');

    const tier = VOLUME_DISCOUNT_TIERS.find((t) => volume >= t.minVolume)!;
    const discountedPrice = Math.round(listPrice * (1 - tier.discountPercent / 100) * 100) / 100;

    return {
      skuCode,
      listPrice,
      discountPercent: tier.discountPercent,
      discountedPrice,
      volume,
    };
  }
}