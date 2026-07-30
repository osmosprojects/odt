// File: src/modules/finance/financial-calc.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { FinancialOfferType, IGMCalcInput, IGMResult } from './types/financial.types';
import { calculateIRR, calculateNPV, computeInflationRates } from '../../common/utils/finance.utils';
import { getTaxLabel } from '../../common/utils/tax.utils';
import { computeContractYears } from '../../common/utils/date.utils';
import { moneyFormatIndia } from '../../common/utils/money-format.utils';

/**
 * Replaces: GM Pool / GM P/L calculation blocks repeated across
 * financials.php, output_lc.php, calculation.php, offer_list.php,
 * and their CS/TS/VS variant files.
 */
@Injectable()
export class FinancialCalcService {
  calculateGMPool(params: IGMCalcInput): IGMResult {
    this.validateInputs(params);

    let gmPerUnit: number;

    switch (params.offerType) {
      case FinancialOfferType.STANDARD:
        gmPerUnit = this.calculateStandardGM(params);
        break;
      case FinancialOfferType.CS:
        gmPerUnit = this.calculateCSGM(params);
        break;
      case FinancialOfferType.TS:
        gmPerUnit = this.calculateTSGM(params);
        break;
      case FinancialOfferType.VS:
        gmPerUnit = this.calculateVSGM(params);
        break;
      default:
        throw new BadRequestException(`Unknown offer type: ${params.offerType}`);
    }

    const gmPool = gmPerUnit * params.volume;
    const gmPercent = params.listPrice !== 0 ? (gmPerUnit / params.listPrice) * 100 : 0;

    return {
      gmPerUnit: this.round2(gmPerUnit),
      gmPool: this.round2(gmPool),
      gmPercent: this.round2(gmPercent),
      offerType: params.offerType,
    };
  }

  // ── Financial Utility Methods (Incorporating Common PHP Logic) ──────────

  computeIRR(cashFlows: number[]): number {
    return calculateIRR(cashFlows);
  }

  computeNPV(ratePercent: number, cashFlows: number[]): number {
    return calculateNPV(ratePercent, cashFlows);
  }

  computeInflation(baseAmount: number, ratePercent: number, years: number): number[] {
    return computeInflationRates(baseAmount, ratePercent, years);
  }

  getTaxType(date: Date | string): string {
    return getTaxLabel(date);
  }

  getContractYears(start: Date | string, end: Date | string): number {
    return computeContractYears(start, end);
  }

  formatCurrency(amount: number): string {
    return moneyFormatIndia(amount);
  }

  // ── PCA (Profitability & Commercial Analysis) Core Engine ──────────────

  calculatePcaAnalysis(input: {
    volume: number;
    listPrice: number;
    discountPerLtr: number;
    cogsPerLtr: number;
    totalInvestment: number;
    focValue: number;
    contractYears?: number;
    discountRatePercent?: number;
  }) {
    const volume = input.volume || 1000;
    const listPrice = input.listPrice || 100;
    const discount = input.discountPerLtr || 10;
    const cogs = input.cogsPerLtr || 50;
    const investment = input.totalInvestment || 50000;
    const foc = input.focValue || 10000;
    const years = input.contractYears || 3;
    const discountRate = input.discountRatePercent || 10;

    const grossRevenue = listPrice * volume;
    const netPrice = listPrice - discount;
    const netRevenue = netPrice * volume;
    const totalCogs = cogs * volume;
    const investmentPerLtr = volume > 0 ? investment / volume : 0;
    const focPerLtr = volume > 0 ? foc / volume : 0;
    const gmPerLtr = netPrice - cogs - investmentPerLtr - focPerLtr;
    const gmPool = gmPerLtr * volume;
    const gmPercent = netRevenue > 0 ? (gmPool / netRevenue) * 100 : 0;

    // Projected yearly cash flows for IRR/NPV
    const annualCashFlow = gmPool / years;
    const cashFlows = [-investment, ...Array(years).fill(annualCashFlow)];
    const irrVal = calculateIRR(cashFlows);
    const npvVal = calculateNPV(discountRate, cashFlows);

    // 6-Year projected inflation series
    const yearlyVolumeSeries = computeInflationRates(volume, 5, 6);
    const yearlyGmSeries = computeInflationRates(gmPool, 4, 6);

    // Evaluate DOFA Approval Level based on investment and GM %
    let dofaAuthority = 'Regional Sales Manager (RWM)';
    if (investment > 1000000 || gmPercent < 15) {
      dofaAuthority = 'Vice President B2B (VPB2B)';
    } else if (investment > 500000 || gmPercent < 20) {
      dofaAuthority = 'Commercial Manager (CM)';
    }

    return {
      grossRevenue: this.round2(grossRevenue),
      netRevenue: this.round2(netRevenue),
      totalCogs: this.round2(totalCogs),
      gmPool: this.round2(gmPool),
      gmPercent: this.round2(gmPercent),
      investmentPerLtr: this.round2(investmentPerLtr),
      focPerLtr: this.round2(focPerLtr),
      irrPercent: irrVal,
      npvAmount: npvVal,
      yearlyVolumeSeries,
      yearlyGmSeries,
      dofaAuthority,
      formattedGrossRevenue: moneyFormatIndia(grossRevenue),
      formattedNetRevenue: moneyFormatIndia(netRevenue),
      formattedGmPool: moneyFormatIndia(gmPool),
    };
  }

  // ── Variant formulas ──────────────────────────────────────────────────
  private calculateStandardGM(p: IGMCalcInput): number {
    return p.listPrice - p.cogs - p.discount - p.foc - p.investment;
  }

  private calculateCSGM(p: IGMCalcInput): number {
    return p.listPrice - p.cogs - p.discount - p.foc - p.investment;
  }

  private calculateTSGM(p: IGMCalcInput): number {
    return p.listPrice - p.cogs - p.discount - p.foc - p.investment;
  }

  private calculateVSGM(p: IGMCalcInput): number {
    return p.listPrice - p.cogs - p.discount - p.foc - p.investment;
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  private validateInputs(p: IGMCalcInput): void {
    if (p.listPrice < 0 || p.cogs < 0 || p.discount < 0 || p.foc < 0 || p.investment < 0 || p.volume < 0) {
      throw new BadRequestException('GM Pool inputs must be non-negative');
    }
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }
}