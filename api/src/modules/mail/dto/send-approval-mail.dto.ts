import { IsNotEmpty, IsNumber, IsString, IsEmail, IsOptional, IsIn } from 'class-validator';
import type { ApprovalAction } from '../events/approval-email.event';

// POST /notifications/send-approval-mail — replaces wbc_approval_pipeline_automailer.php
export class SendApprovalMailDto {
  @IsNotEmpty()
  @IsNumber()
  offerId!: number;

  @IsNotEmpty()
  @IsString()
  offerCode!: string;

  @IsNotEmpty()
  @IsString()
  customerName!: string;

  @IsNotEmpty()
  @IsIn(['PUBLISHED', 'APPROVED', 'REJECTED', 'RECALLED', 'CANCELLED'])
  action!: ApprovalAction;

  @IsNotEmpty()
  @IsString()
  level!: string;

  @IsNotEmpty()
  @IsEmail()
  recipientEmail!: string;

  @IsNotEmpty()
  @IsString()
  recipientName!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}