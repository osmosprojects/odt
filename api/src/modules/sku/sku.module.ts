import { Module } from '@nestjs/common';
import { SkuDiscountService } from './sku-discount.service';
import { SkuController } from './sku.controller';

@Module({
  controllers: [SkuController],
  providers: [SkuDiscountService,SkuDiscountService],
})
export class SkuModule {}