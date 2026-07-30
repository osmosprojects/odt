import { IsOptional, IsString } from 'class-validator';

export class PreviousOfferLookupDto {
  @IsOptional()
  @IsString()
  customerCode?: string;

  @IsOptional()
  @IsString()
  custId?: string;

  @IsOptional()
  @IsString()
  executiveCode?: string;

  @IsOptional()
  @IsString()
  customerName?: string;
}
