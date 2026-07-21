import { Controller, Get, Post, Body } from '@nestjs/common';
import { OfferManagementService } from './offer-management.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Offer Configuration (DOFA & Dollar Update)')
@Controller('api/offer-management')
export class OfferManagementController {
  constructor(private readonly offerManagementService: OfferManagementService) {}

  @ApiOperation({ summary: 'Get DOFA Approval Flow Matrices' })
  @Get('dofa-approval-flow')
  getDofaMatrices() {
    return this.offerManagementService.getDofaMatrices();
  }

  @ApiOperation({ summary: 'Create new DOFA Approval Matrix' })
  @Post('dofa-approval-flow')
  createDofaMatrix(@Body() matrix: any) {
    return this.offerManagementService.createDofaMatrix(matrix);
  }

  @ApiOperation({ summary: 'Get Dollar Exchange Rate History' })
  @Get('dollar-update')
  getDollarRates() {
    return this.offerManagementService.getDollarRates();
  }

  @ApiOperation({ summary: 'Add/Update USD Exchange Rate' })
  @Post('dollar-update')
  createDollarRate(@Body() rateData: any) {
    return this.offerManagementService.createDollarRate(rateData);
  }
}
