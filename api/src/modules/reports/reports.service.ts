// PHP equivalent: bp_credit_level_pending_report.php, credit_level_pending_days, ppm_level_pending_days
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { OfferStatus } from '../../enums/offer-status.enum';
import { CreditPendingFilterDto } from './dtos/credit-pending-filter.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(OfferEntity) private offerRepo: Repository<OfferEntity>,
  ) {}

  async getCreditPending(filters: CreditPendingFilterDto) {
    const where: FindOptionsWhere<OfferEntity> = {
      account_status: OfferStatus.P, // Pending — credit's queue
    };

    if (filters.from && filters.to) {
      where.created_date = Between(new Date(filters.from), new Date(filters.to));
    }

    const offers = await this.offerRepo.find({
      where,
      order: { created_date: 'ASC' },
    });

    const now = new Date();
    return offers.map((offer) => ({
      offer_id: offer.offer_id,
      executive_code: offer.executive_code,
      money_offered: offer.money_offered,
      created_date: offer.created_date,
      days_pending: Math.floor(
        (now.getTime() - new Date(offer.created_date).getTime()) / (1000 * 60 * 60 * 24),
      ),
    }));
  }
}