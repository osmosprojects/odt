import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  getDashboardStats() {
    return {
      statCards: [
        { label: 'My To Do', value: 12, sub: 'Pending Tasks', color: 'bg-emerald-600' },
        { label: 'Approvals', value: 8, sub: 'Pending Approvals', color: 'bg-orange-500' },
        { label: 'Alerts', value: 5, sub: 'Important Alerts', color: 'bg-sky-500' },
        { label: 'My Team', value: 24, sub: 'Active Members', color: 'bg-violet-500' },
      ],
      teamPerformance: [
        { region: 'North', achievement: 78, target: 100 },
        { region: 'West', achievement: 65, target: 100 },
        { region: 'East', achievement: 82, target: 100 },
        { region: 'South', achievement: 55, target: 100 },
        { region: 'Central', achievement: 70, target: 100 },
      ],
      offersOverview: [
        { name: 'Active', value: 68 },
        { name: 'Pending', value: 25 },
        { name: 'Expired', value: 16 },
        { name: 'Draft', value: 12 },
      ],
    };
  }

  getCommercialReportSummary() {
    return {
      totalVolumeLitres: 450000,
      totalTradeLoanVal: 18500000,
      approvedOffersCount: 68,
      pendingApprovalCount: 25,
    };
  }
}
