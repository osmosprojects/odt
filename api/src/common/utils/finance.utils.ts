import { irr, npv } from 'financial';

// RATES CALCULATION ACCORDING TO THE SAME METHOD PROVIDED IN THE SHEET
function computeInflationRates(
  baseAmount: number,
  annualRatePercent: number,
  contractYears: number,
): number[] {
  if (contractYears <= 0) {
    throw new Error('contractYears must be positive');
  }

  const rate = annualRatePercent / 100;
  const wholeYears = Math.ceil(contractYears);
  const yearlyAmounts: number[] = [];

  for (let year = 1; year <= wholeYears; year++) {
    const amount = baseAmount * Math.pow(1 + rate, year);
    yearlyAmounts.push(Math.round(amount * 100) / 100);
  }

  return yearlyAmounts;
}

// PHP equivalent: IRR/NPV calculation loops (investmentArray, cashflowArray)
export function calculateIRR(cashFlows: number[]): number {
  const irr1 = irr(cashFlows);
  return Math.round(irr1 * 10000) / 100; 
}

export function calculateNPV(ratePercent: number, cashFlows: number[]): number {
  const rate = ratePercent / 100;
  return Math.round(npv(rate, cashFlows) * 100) / 100;
}
