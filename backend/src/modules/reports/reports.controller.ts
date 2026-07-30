// src/modules/reports/reports.controller.ts
import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreditPendingFilterDto } from './dtos/credit-pending-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';
import type { Response } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('credit-pending')
  @Roles(Role.CM, Role.ADMIN, Role.WSK)
  getCreditPending(@Query() filters: CreditPendingFilterDto) {
    return this.reportsService.getCreditPending(filters);
  }

  @Get('credit-pending/export/excel')
  @Roles(Role.CM, Role.ADMIN, Role.WSK)
  async exportCreditPendingExcel(@Query() filters: CreditPendingFilterDto, @Res() res: Response) {
    const buffer = await this.reportsService.exportCreditPendingExcel(filters);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=credit-pending-report.xlsx',
    });
    res.send(buffer);
  }

  @Get('credit-pending/export/pdf')
  @Roles(Role.CM, Role.ADMIN, Role.WSK)
  async exportCreditPendingPdf(@Query() filters: CreditPendingFilterDto, @Res() res: Response) {
    const buffer = await this.reportsService.exportCreditPendingPdf(filters);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=credit-pending-report.pdf',
    });
    res.send(buffer);
  }
}