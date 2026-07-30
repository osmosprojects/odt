import { ReportsService } from './reports.service';
import { CreditPendingFilterDto } from './dtos/credit-pending-filter.dto';
import type { Response } from 'express';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getCreditPending(filters: CreditPendingFilterDto): Promise<{
        offer_id: number;
        executive_code: number;
        money_offered: number;
        money_offered_formatted: string;
        created_date: Date;
        days_pending: number;
    }[]>;
    exportCreditPendingExcel(filters: CreditPendingFilterDto, res: Response): Promise<void>;
    exportCreditPendingPdf(filters: CreditPendingFilterDto, res: Response): Promise<void>;
}
