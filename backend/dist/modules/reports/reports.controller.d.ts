import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboardStats(): {
        statCards: {
            label: string;
            value: number;
            sub: string;
            color: string;
        }[];
        teamPerformance: {
            region: string;
            achievement: number;
            target: number;
        }[];
        offersOverview: {
            name: string;
            value: number;
        }[];
    };
    getCommercialReportSummary(): {
        totalVolumeLitres: number;
        totalTradeLoanVal: number;
        approvedOffersCount: number;
        pendingApprovalCount: number;
    };
}
