import { IsOptional, IsString } from 'class-validator';

export class GetPreviousWbcQueryDto {
  @IsOptional()
  @IsString()
  executiveCode?: string;
}
