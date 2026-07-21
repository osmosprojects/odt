// File: src/modules/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';
import { ApprovalEmailEvent } from './events/approval-email.event';

/**
 * Replaces: PHPMailer calls scattered across publish_offer.php, recall.php,
 * cancel_approval.php, wbc_approval_pipeline_automailer.php.
 *
 * Event-driven per the migration plan: ApprovalService/OfferService emit
 * an ApprovalEmailEvent; this service listens and sends the actual email.
 * Decouples business logic (approval state changes) from email delivery.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  // Listens for events emitted by ApprovalService.approve()/reject(),
  // OfferService.publish()/recall()/cancel(), etc.
  @OnEvent('approval.email')
  async handleApprovalEmailEvent(event: ApprovalEmailEvent): Promise<void> {
    await this.sendApprovalEmail(event);
  }

  // Core method — also callable directly (e.g. from NotificationController
  // for manual/internal triggers via POST /notifications/send-approval-mail)
  async sendApprovalEmail(event: ApprovalEmailEvent): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: event.recipientEmail,
        subject: this.buildSubject(event),
        template: 'approval', // resolves to templates/approval.hbs
        context: {
          offerCode: event.offerCode,
          customerName: event.customerName,
          action: event.action,
          level: event.level,
          recipientName: event.recipientName,
          remarks: event.remarks ?? null,
        },
      });

      this.logger.log(
        `Approval email sent: offer=${event.offerCode} action=${event.action} to=${event.recipientEmail}`,
      );
    } catch (err) {
      // PHP equivalent: silently failed or no error handling at all.
      // Here we log and rethrow so callers/queues can retry.
      this.logger.error(
        `Failed to send approval email for offer ${event.offerCode}: ${err}`,
      );
      throw err;
    }
  }

  private buildSubject(event: ApprovalEmailEvent): string {
    const subjects: Record<string, string> = {
      PUBLISHED: `Approval Required: Offer ${event.offerCode}`,
      APPROVED: `Offer Approved: ${event.offerCode}`,
      REJECTED: `Offer Rejected: ${event.offerCode}`,
      RECALLED: `Offer Recalled: ${event.offerCode}`,
      CANCELLED: `Offer Cancelled: ${event.offerCode}`,
    };
    return subjects[event.action] ?? `Offer Update: ${event.offerCode}`;
  }
}