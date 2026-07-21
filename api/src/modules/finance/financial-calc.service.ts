// File: src/modules/finance/financial-calc.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { FinancialOfferType, IGMCalcInput, IGMResult } from './types/financial.types';

/**
 * Replaces: GM Pool / GM P/L calculation blocks repeated across
 * financials.php, output_lc.php, calculation.php, offer_list.php,
 * and their CS/TS/VS variant files.
 *
 * PHP base formula (every variant file had its own copy of this):
 *   GM = (listprice - cogs - discount - foc - investment) * volume
 *
 * Business-critical — outputs must match PHP exactly. Variant differences
 * below are placeholders based on how CS/TS/VS typically diverge in this
 * codebase (extra deduction terms); confirm exact formula differences
 * against financials_cs.php / financials_ts.php / financials_vs.php
 * before going live, and add unit tests comparing against real PHP output.
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

  // ── Variant formulas ──────────────────────────────────────────────────
  // PHP equivalent: financials.php base GM block
  private calculateStandardGM(p: IGMCalcInput): number {
    return p.listPrice - p.cogs - p.discount - p.foc - p.investment;
  }

  // PHP equivalent: financials_cs.php — same base formula in this codebase,
  // CS-specific adjustments (if any) happen upstream before calling this.
  // Kept as a separate branch so CS-only deduction rules can be added here
  // without touching the standard/TS/VS paths.
  private calculateCSGM(p: IGMCalcInput): number {
    return p.listPrice - p.cogs - p.discount - p.foc - p.investment;
  }

  // PHP equivalent: financials_ts.php
  private calculateTSGM(p: IGMCalcInput): number {
    return p.listPrice - p.cogs - p.discount - p.foc - p.investment;
  }

  // PHP equivalent: financials_vs.php
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