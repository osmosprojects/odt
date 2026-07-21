// File: src/modules/mail/events/approval-email.event.ts
//
// Replaces: direct PHPMailer calls inside publish_offer.php, recall.php,
// cancel_approval.php, wbc_approval_pipeline_automailer.php
//
// ApprovalService / OfferService emit this event; MailService listens
// and sends the actual email — decouples business logic from email sending.

export type ApprovalAction = 'PUBLISHED' | 'APPROVED' | 'REJECTED' | 'RECALLED' | 'CANCELLED';

export class ApprovalEmailEvent {
  constructor(
    public readonly offerId: number,
    public readonly offerCode: string,
    public readonly customerName: string,
    public readonly action: ApprovalAction,
    public readonly level: string,         // e.g. 'WS', 'RWM', 'CM' — current approval level
    public readonly recipientEmail: string,
    public readonly recipientName: string,
    public readonly remarks?: string,
  ) {}
}