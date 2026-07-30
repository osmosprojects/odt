import { IsOptional, IsDateString } from 'class-validator';

export class CreditPendingFilterDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}