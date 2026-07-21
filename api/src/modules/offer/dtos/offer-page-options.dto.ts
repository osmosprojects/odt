import { IsInt, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OfferStatus, OfferCategory } from '../../../enums/offer-status.enum';

export class OfferPageOptionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsEnum(OfferStatus)
  status?: OfferStatus;

  @IsOptional()
  @IsEnum(OfferCategory)
  category?: OfferCategory;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}