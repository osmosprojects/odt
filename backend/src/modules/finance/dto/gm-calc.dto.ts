// File: src/modules/finance/dto/gm-calc.dto.ts

import { IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { FinancialOfferType } from '../types/financial.types';

// POST /financials/:offerId/gm-pool body — replaces inline GM calc blocks
// scattered across financials.php, output_lc.php, calculation.php, offer_list.php
export class GMCalcDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  listPrice!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cogs!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  foc!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  investment!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  volume!: number;

  @IsNotEmpty()
  @IsEnum(FinancialOfferType)
  offerType!: FinancialOfferType;
}