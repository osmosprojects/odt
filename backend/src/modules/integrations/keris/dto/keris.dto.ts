import { IsNotEmpty, IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

// POST /keris/submit — replaces keris_submition_form.php
export class KerisSubmitDto {
  @IsNotEmpty()
  @IsNumber()
  offerId!: number;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>; // extra fields the Keris API expects
}

// PUT /keris/update — replaces keris_updation_form.php
export class KerisUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  offerId!: number;

  @IsNotEmpty()
  @IsString()
  kerisCode!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}

// Response shape for GET /keris/:offerId/status — replaces keris_view_submit.php
export class KerisStatusResponseDto {
  offerId!: number;
  kerisCode!: string | null;
  status!: string;
  submitDate!: Date | null;
  response!: Record<string, any> | null;
}