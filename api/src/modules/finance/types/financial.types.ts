// File: src/modules/finance/types/financial.types.ts

// Offer variant types — drives which GM Pool formula branch applies.
// PHP equivalent: separate files financials.php / financials_cs.php / financials_ts.php / financials_vs.php
export enum FinancialOfferType {
  STANDARD = 'STANDARD',
  CS = 'CS', // Customer Segment
  TS = 'TS', // (TS variant)
  VS = 'VS', // (VS variant)
}

export interface IGMCalcInput {
  listPrice: number;
  cogs: number;
  discount: number;
  foc: number; // Free of Cost units/value
  investment: number;
  volume: number;
  offerType: FinancialOfferType;
}

export interface IGMResult {
  gmPerUnit: number;       // (listprice - cogs - discount - foc - investment)
  gmPool: number;          // gmPerUnit * volume
  gmPercent: number;       // gmPerUnit / listPrice * 100
  offerType: FinancialOfferType;
}

// Shared across IRR/NPV and inflation rate services too
export interface IFinancialCalc {
  computeInflationRates(rates: number[], startYear: number, endYear: number): number[];
  calculateIRR(cashflows: number[]): number;
  calculateNPV(rate: number, cashflows: number[]): number;
  calculateGMPool(params: IGMCalcInput): IGMResult;
}