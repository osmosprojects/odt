import { IsInt, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { OfferStatus, OfferCategory } from '../../../enums/offer-status.enum';

export class CreateOfferDto {
  @IsInt()
  executive_code!: number;

  @IsDateString()
  expiration_date!: string;

  @IsNumber()
  money_offered!: number;

  @IsOptional()
  @IsEnum(OfferStatus)
  account_status?: OfferStatus;

  @IsOptional()
  @IsEnum(OfferCategory)
  offer_category?: OfferCategory;
}