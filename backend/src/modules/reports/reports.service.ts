// PHP equivalent: bp_credit_level_pending_report.php, credit_level_pending_days, ppm_level_pending_days
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { OfferStatus } from '../../enums/offer-status.enum';
import { CreditPendingFilterDto } from './dtos/credit-pending-filter.dto';
import { generateExcelReport } from '../../common/utils/excel-report.utils';
import { generatePdfReport } from '../../common/utils/pdf-report.utils';
import { moneyFormatIndia } from '../../common/utils/money-format.utils';

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
      money_offered_formatted: moneyFormatIndia(Number(offer.money_offered || 0)),
      created_date: offer.created_date,
      days_pending: Math.floor(
        (now.getTime() - new Date(offer.created_date).getTime()) / (1000 * 60 * 60 * 24),
      ),
    }));
  }

  async exportCreditPendingExcel(filters: CreditPendingFilterDto): Promise<Buffer> {
    const rows = await this.getCreditPending(filters);
    const columns = [
      { header: 'Offer ID', key: 'offer_id', width: 15 },
      { header: 'Executive Code', key: 'executive_code', width: 20 },
      { header: 'Amount', key: 'money_offered_formatted', width: 20 },
      { header: 'Created Date', key: 'created_date', width: 25 },
      { header: 'Days Pending', key: 'days_pending', width: 15 },
    ];
    return generateExcelReport('Credit Pending Report', columns, rows);
  }

  async exportCreditPendingPdf(filters: CreditPendingFilterDto): Promise<Buffer> {
    const rows = await this.getCreditPending(filters);
    const columns = [
      { header: 'ID', key: 'offer_id', width: 60 },
      { header: 'Exec Code', key: 'executive_code', width: 100 },
      { header: 'Amount', key: 'money_offered_formatted', width: 120 },
      { header: 'Days Pending', key: 'days_pending', width: 100 },
    ];
    return generatePdfReport('Credit Level Pending Report', columns, rows);
  }
}