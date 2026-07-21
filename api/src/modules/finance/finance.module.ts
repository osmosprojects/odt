// File: src/modules/finance/finance.module.ts

import { Module } from '@nestjs/common';
import { FinancialController } from './financial.controller';
import { FinancialCalcService } from './financial-calc.service';

@Module({
  controllers: [FinancialController],
  providers: [FinancialCalcService],
  exports: [FinancialCalcService], // so OfferModule / ReportsModule can reuse GM calc
})
export class FinanceModule {}