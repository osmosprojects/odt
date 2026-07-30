import { Controller, Get, Post, Body, Query, Logger, Param, UseGuards } from '@nestjs/common';
import { OfferHistoryService } from './offer-history.service';
import { PreviousOfferLookupDto } from './dtos/previous-offer-lookup.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decrator';

@Controller(['offer-history', 'offers/history'])
@UseGuards(JwtAuthGuard)
export class OfferHistoryController {
  private readonly logger = new Logger(OfferHistoryController.name);

  constructor(private offerHistoryService: OfferHistoryService) {}

  /**
   * Enterprise Structured Previous Offer Lookup (GET)
   * /offers/history/lookup?customerCode=...&custId=...&executiveCode=...&customerName=...
   */
  @Public()
  @Get('lookup')
  lookupPreviousOfferGet(@Query() dto: PreviousOfferLookupDto) {
    this.logger.log(`[Backend Controller] GET /offers/history/lookup query: ${JSON.stringify(dto)}`);
    return this.offerHistoryService.lookupPreviousOffer(dto);
  }

  /**
   * Enterprise Structured Previous Offer Lookup (POST)
   * /offers/history/lookup
   */
  @Public()
  @Post('lookup')
  lookupPreviousOfferPost(@Body() dto: PreviousOfferLookupDto) {
    this.logger.log(`[Backend Controller] POST /offers/history/lookup body: ${JSON.stringify(dto)}`);
    return this.offerHistoryService.lookupPreviousOffer(dto);
  }

  /**
   * Legacy Compatibility Route
   * GET /offers/history/:param
   */
  @Public()
  @Get(':param')
  getPreviousOfferLegacy(
    @Param('param') param: string,
    @Query() query: PreviousOfferLookupDto,
  ) {
    this.logger.log(`[Backend Controller] GET /offers/history/${param}`);
    const dto: PreviousOfferLookupDto = {
      customerCode: query.customerCode || param,
      custId: query.custId,
      executiveCode: query.executiveCode,
      customerName: query.customerName,
    };
    return this.offerHistoryService.lookupPreviousOffer(dto);
  }
}
