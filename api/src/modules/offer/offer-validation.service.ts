// #19 — PHP equivalent: nested for-loop duplicate check in save_offer.php 
// #33 — PHP equivalent: effective_end_date / start_date overlap checks in save_offer, publish_offer, extend_offer
import { Injectable, BadRequestException } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { CreateOfferDto } from './dtos/create-offer.dto';

@Injectable()
export class OfferValidationService {
  constructor(private offerRepo: OfferRepository) {}

  async checkDuplicate(dto: CreateOfferDto): Promise<void> {
    const existing = await this.offerRepo.findPotentialDuplicate(
      dto.executive_code,
      dto.expiration_date,
    );
    if (existing) {
      throw new BadRequestException(
        `Duplicate offer detected: executive_code ${dto.executive_code} already has an offer expiring ${dto.expiration_date}`,
      );
    }
  }

  validateDates(expirationDate: string): void {
    const expiry = new Date(expirationDate);
    const now = new Date();

    if (isNaN(expiry.getTime())) {
      throw new BadRequestException('Invalid expiration_date format');
    }
    if (expiry <= now) {
      throw new BadRequestException('expiration_date must be in the future');
    }
  }
}