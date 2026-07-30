import { Repository } from 'typeorm';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { CreditPendingFilterDto } from './dtos/credit-pending-filter.dto';
export declare class ReportsService {
    private offerRepo;
    constructor(offerRepo: Repository<OfferEntity>);
    getCreditPending(filters: CreditPendingFilterDto): Promise<{
        offer_id: number;
        executive_code: number;
        money_offered: number;
        money_offered_formatted: string;
        created_date: Date;
        days_pending: number;
    }[]>;
    exportCreditPendingExcel(filters: CreditPendingFilterDto): Promise<Buffer>;
    exportCreditPendingPdf(filters: CreditPendingFilterDto): Promise<Buffer>;
}
