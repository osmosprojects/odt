// src/modules/offer/reminder-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { OfferStatus } from '../../enums/offer-status.enum';
import { ApprovalEmailEvent } from '../mail/events/approval-email.event';

@Injectable()
export class ReminderCronService {
  private readonly logger = new Logger(ReminderCronService.name);

  constructor(
    @InjectRepository(OfferEntity) private offerRepo: Repository<OfferEntity>,
    private eventEmitter: EventEmitter2, // ← replaces the old MailService placeholder
  ) {}

  @Cron('0 8 * * *')
  async sendPendingReminders(): Promise<void> {
    this.logger.log('Checking for offers pending 3+ days...');

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const pendingOffers = await this.offerRepo.find({
      where: { account_status: OfferStatus.P },
    });

    const stale = pendingOffers.filter(
      (offer) => new Date(offer.created_date) <= threeDaysAgo,
    );

    if (stale.length === 0) {
      this.logger.log('No stale pending offers found');
      return;
    }

    this.logger.log(`Sending reminders for ${stale.length} stale offer(s)`);

    for (const offer of stale) {
      // NOTE: recipientEmail/recipientName are placeholders — your real
      // entity has no email field yet. Once CustDetailsEntity/UserEntity
      // is wired in to resolve the actual approver's email, replace these.
      const event = new ApprovalEmailEvent(
        offer.offer_id,
        offer.offer_code ?? `OFFER-${offer.offer_id}`,
        'Customer Name Unavailable', // TODO: resolve from CustDetailsEntity
        'PUBLISHED', // closest existing action type for a "still pending" reminder
        'PENDING_REMINDER',
        'placeholder@example.com', // TODO: resolve real recipient
        'Approver',
        `This offer has been pending for 3+ days.`,
      );

      try {
        await this.eventEmitter.emitAsync('approval.email', event);
      } catch (err) {
        this.logger.error(`Failed to send reminder for offer ${offer.offer_id}: ${(err as Error).message}`);
      }
    }
  }

  async triggerManually(): Promise<{ offerIds: number[] }> {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const pendingOffers = await this.offerRepo.find({ where: { account_status: OfferStatus.P } });
    const stale = pendingOffers.filter((offer) => new Date(offer.created_date) <= threeDaysAgo);
    return { offerIds: stale.map((o) => o.offer_id) };
  }
}