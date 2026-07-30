
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FinancialCalcService } from './financial-calc.service';
import { GMCalcDto } from './dto/gm-calc.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decrator';

@Controller('financials')
@UseGuards(JwtAuthGuard)
export class FinancialController {
  constructor(private readonly financialCalcService: FinancialCalcService) {}

  @Public()
  @Post('gm-pool')
  calculateGMPool(@Body() dto: GMCalcDto) {
    const result = this.financialCalcService.calculateGMPool(dto);
    return { success: true, data: result };
  }

  @Public()
  @Post('irr')
  calculateIrr(@Body() body: { cashFlows: number[] }) {
    const result = this.financialCalcService.computeIRR(body.cashFlows || []);
    return { success: true, data: { irr: result } };
  }

  @Public()
  @Post('npv')
  calculateNpv(@Body() body: { ratePercent: number; cashFlows: number[] }) {
    const result = this.financialCalcService.computeNPV(body.ratePercent, body.cashFlows || []);
    return { success: true, data: { npv: result } };
  }

  @Public()
  @Post('inflation')
  calculateInflation(@Body() body: { baseAmount: number; ratePercent: number; contractYears: number }) {
    const result = this.financialCalcService.computeInflation(
      body.baseAmount,
      body.ratePercent,
      body.contractYears,
    );
    return { success: true, data: { yearlyAmounts: result } };
  }

  @Public()
  @Post('tax-type')
  getTaxType(@Body() body: { date: string }) {
    const label = this.financialCalcService.getTaxType(body.date);
    return { success: true, data: { taxLabel: label } };
  }

  @Public()
  @Post('pca-analysis')
  calculatePcaAnalysis(
    @Body()
    body: {
      volume: number;
      listPrice: number;
      discountPerLtr: number;
      cogsPerLtr: number;
      totalInvestment: number;
      focValue: number;
      contractYears?: number;
      discountRatePercent?: number;
    },
  ) {
    const result = this.financialCalcService.calculatePcaAnalysis(body);
    return { success: true, data: result };
  }
}