import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reports & Analytics')
@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Get Dashboard Overview Stats' })
  @Get('dashboard-stats')
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @ApiOperation({ summary: 'Get Commercial Summary Report' })
  @Get('commercial-summary')
  getCommercialReportSummary() {
    return this.reportsService.getCommercialReportSummary();
  }
}
