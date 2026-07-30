// File: src/modules/finance/financial-calc.service.spec.ts

import { FinancialCalcService } from './financial-calc.service';
import { FinancialOfferType } from './types/financial.types';

describe('FinancialCalcService — calculateGMPool', () => {
  let service: FinancialCalcService;

  beforeEach(() => {
    service = new FinancialCalcService();
  });

  it('calculates standard GM Pool correctly', () => {
    // GM = (1000 - 600 - 50 - 20 - 30) * 500 = 300 * 500 = 150000
    const result = service.calculateGMPool({
      listPrice: 1000,
      cogs: 600,
      discount: 50,
      foc: 20,
      investment: 30,
      volume: 500,
      offerType: FinancialOfferType.STANDARD,
    });

    expect(result.gmPerUnit).toBe(300);
    expect(result.gmPool).toBe(150000);
    expect(result.gmPercent).toBe(30); // 300/1000 * 100
  });

  it('calculates GM Pool for CS variant', () => {
    const result = service.calculateGMPool({
      listPrice: 800,
      cogs: 500,
      discount: 30,
      foc: 10,
      investment: 10,
      volume: 200,
      offerType: FinancialOfferType.CS,
    });

    expect(result.gmPerUnit).toBe(250);
    expect(result.gmPool).toBe(50000);
  });

  it('returns zero GM% when listPrice is zero (avoid div-by-zero)', () => {
    const result = service.calculateGMPool({
      listPrice: 0,
      cogs: 0,
      discount: 0,
      foc: 0,
      investment: 0,
      volume: 100,
      offerType: FinancialOfferType.STANDARD,
    });

    expect(result.gmPercent).toBe(0);
  });

  it('throws on negative inputs', () => {
    expect(() =>
      service.calculateGMPool({
        listPrice: -100,
        cogs: 50,
        discount: 0,
        foc: 0,
        investment: 0,
        volume: 10,
        offerType: FinancialOfferType.STANDARD,
      }),
    ).toThrow();
  });

  it('handles negative GM (loss-making offer) without throwing', () => {
    // cogs+discount+foc+investment exceed listPrice — valid business case (loss)
    const result = service.calculateGMPool({
      listPrice: 100,
      cogs: 80,
      discount: 30,
      foc: 5,
      investment: 5,
      volume: 50,
      offerType: FinancialOfferType.STANDARD,
    });

    expect(result.gmPerUnit).toBe(-20);
    expect(result.gmPool).toBe(-1000);
  });
});