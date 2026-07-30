import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SkuDiscountService } from './sku-discount.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('sku')
@UseGuards(JwtAuthGuard)
export class SkuController {
  constructor(private skuDiscount: SkuDiscountService) {}

  @Get('discount')
  getDiscount(
    @Query('skuCode') skuCode: string,
    @Query('volume') volume: string,
    @Query('listPrice') listPrice: string,
  ) {
    return this.skuDiscount.calculateDiscount(skuCode, Number(volume), Number(listPrice));
  }
}