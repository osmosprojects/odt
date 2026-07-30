// File: src/modules/mail/notification.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendApprovalMailDto } from './dto/send-approval-mail.dto';
import { ApprovalEmailEvent } from './events/approval-email.event';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * Replaces: wbc_approval_pipeline_automailer.php (manual/internal trigger path)
 * Normally MailService is triggered by events from ApprovalService — this
 * endpoint exists for internal/system callers that need to trigger directly.
 */
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly mailService: MailService) {}

  // ─────────────────────────────────────────────────────────────────────────
  // POST /notifications/send-approval-mail
  //
  // Postman:
  //   POST http://localhost:3000/notifications/send-approval-mail
  //   Headers: Authorization: Bearer <token>, Content-Type: application/json
  //   Body:
  //   {
  //     "offerId": 101,
  //     "offerCode": "WBC-2026-101",
  //     "customerName": "Tata Motors Ltd",
  //     "action": "PUBLISHED",
  //     "level": "RWM",
  //     "recipientEmail": "rwm.user@example.com",
  //     "recipientName": "Anita Sharma",
  //     "remarks": "Please review urgently"
  //   }
  // ─────────────────────────────────────────────────────────────────────────
  @Post('send-approval-mail')
  @HttpCode(HttpStatus.OK)
  async sendApprovalMail(@Body() dto: SendApprovalMailDto) {
    const event = new ApprovalEmailEvent(
      dto.offerId,
      dto.offerCode,
      dto.customerName,
      dto.action,
      dto.level,
      dto.recipientEmail,
      dto.recipientName,
      dto.remarks,
    );

    await this.mailService.sendApprovalEmail(event);

    return {
      success: true,
      message: `Approval email (${dto.action}) sent to ${dto.recipientEmail}`,
    };
  }
}