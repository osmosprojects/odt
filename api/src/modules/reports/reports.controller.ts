// src/modules/reports/reports.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreditPendingFilterDto } from './dtos/credit-pending-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('credit-pending')
  @Roles(Role.CM, Role.ADMIN, Role.WSK)
  getCreditPending(@Query() filters: CreditPendingFilterDto) {
    return this.reportsService.getCreditPending(filters);
  }
}