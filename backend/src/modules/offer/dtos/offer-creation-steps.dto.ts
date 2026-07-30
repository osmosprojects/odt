import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerItemDto {
  @IsOptional()
  @IsString()
  newExistingCustomer?: string;

  @IsOptional()
  @IsString()
  currentCustomerType?: string;

  @IsOptional()
  @IsString()
  proposedCustomerType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customerNames?: string[];

  @IsOptional()
  @IsString()
  distributorName?: string;

  @IsOptional()
  @IsString()
  customerNumber?: string;

  @IsOptional()
  @IsString()
  keyAccount?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  segment?: string;

  @IsOptional()
  @IsString()
  subSegment?: string;

  @IsOptional()
  @IsString()
  jdeCode?: string;

  @IsOptional()
  @IsString()
  salesRep?: string;

  @IsOptional()
  @IsString()
  salesArea?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  previousWbc?: string;

  @IsOptional()
  @IsString()
  previousWbcOffer?: string;

  @IsOptional()
  @IsString()
  gstNumber?: string;
}

export class CreateOfferStep1Dto {
  @IsOptional()
  @IsNumber()
  offerId?: number;

  @IsString()
  offerStream!: string;

  @IsString()
  offerCreationType!: string;

  @IsString()
  dollarValue!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerItemDto)
  customers!: CustomerItemDto[];

  @IsOptional()
  @IsString()
  periodFrom?: string;

  @IsOptional()
  @IsString()
  periodTo?: string;

  @IsOptional()
  @IsNumber()
  volumePM?: number;

  @IsOptional()
  @IsNumber()
  actualPM?: number;

  @IsOptional()
  @IsNumber()
  synthShare?: number;

  @IsOptional()
  @IsNumber()
  synthShareActual?: number;
}

export class CreateOfferStep2Dto {
  @IsNumber()
  offerId!: number;

  @IsOptional()
  @IsString()
  arSeol?: string;

  @IsOptional()
  @IsNumber()
  targetIncentive?: number;

  @IsOptional()
  @IsNumber()
  additionalInput?: number;

  @IsOptional()
  @IsNumber()
  signOnBonus?: number;

  @IsOptional()
  @IsNumber()
  others?: number;

  @IsOptional()
  @IsNumber()
  totalInvestment?: number;

  @IsOptional()
  @IsNumber()
  rsLtrInvestment?: number;

  @IsOptional()
  @IsNumber()
  skuLevelRebate?: number;

  @IsOptional()
  @IsNumber()
  totalFocValue?: number;

  @IsOptional()
  @IsNumber()
  prevGmpl?: number;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsString()
  whyInvest!: string;

  @IsOptional()
  @IsString()
  associatedWithCastrol?: string;

  @IsOptional()
  @IsString()
  significanceWithCastrol?: string;

  @IsOptional()
  @IsString()
  upTradingOpportunities?: string;

  @IsString()
  risksToVolume!: string;

  @IsString()
  mitigationToRisk!: string;

  @IsOptional()
  @IsString()
  groupBelongsTo?: string;

  @IsOptional()
  @IsString()
  otherQualitativeInfo?: string;
}

export class SkuItemDto {
  @IsString()
  id!: string;

  @IsString()
  skuCode!: string;

  @IsString()
  skuName!: string;

  @IsNumber()
  packSize!: number;

  @IsNumber()
  volumePMCommitment!: number;

  @IsNumber()
  volumePMActual!: number;

  @IsNumber()
  listPrice!: number;

  @IsNumber()
  netPrice!: number;

  @IsNumber()
  discount!: number;

  @IsNumber()
  recommendedMixIncentive!: number;

  @IsNumber()
  actualMixIncentive!: number;

  @IsNumber()
  productTargetIncentive!: number;
}

export class CreateOfferStep3Dto {
  @IsNumber()
  offerId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkuItemDto)
  skus!: SkuItemDto[];

  @IsOptional()
  @IsNumber()
  disbursementVolume?: number;

  @IsOptional()
  @IsNumber()
  disbursementMonths?: number;

  @IsOptional()
  @IsNumber()
  disbursementAmount?: number;

  @IsOptional()
  @IsNumber()
  skuVolume?: number;

  @IsOptional()
  @IsNumber()
  incentivePool?: number;

  @IsOptional()
  @IsNumber()
  totalRecMixIncentive?: number;

  @IsOptional()
  @IsNumber()
  totalActualMixIncentive?: number;

  @IsOptional()
  @IsNumber()
  totalVolume?: number;

  @IsOptional()
  @IsNumber()
  skuLevelRebateLtr?: number;

  @IsOptional()
  @IsNumber()
  totalFocValue?: number;

  @IsOptional()
  @IsNumber()
  totalFocValueLtr?: number;

  @IsOptional()
  @IsString()
  finalDofa?: string;
}

export class SaveOfferDraftDto {
  @IsOptional()
  @IsNumber()
  offerId?: number;

  @IsNumber()
  step!: number;

  @IsOptional()
  payload?: any;
}

export class SubmitOfferDto {
  @IsNumber()
  offerId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
