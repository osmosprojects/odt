import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decrator';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  /**
   * Live customer master search for the Offer Creation Demo.
   * GET /customers/search?q=<term>&page=<n>&limit=<n>
   * Public endpoint (no JWT required)
   */
  @Public()
  @Get('search')
  search(
    @Query('q') q: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.customerService.searchCustomers(
      q || '',
      parseInt(page || '1', 10),
      parseInt(limit || '25', 10),
    );
  }

  /**
   * Existing: Offer-specific customer snapshot
   * JWT Required
   */
  @Get(':id/offer-data')
  getForOffer(@Param('id', ParseIntPipe) offerId: number) {
    return this.customerService.getForOffer(offerId);
  }

  /**
   * Fetch customer past offer history (Active, Expired, Extended, Pending)
   * GET /customers/:code/offers?name=<optional>
   */
  @Public()
  @Get(':code/offers')
  getCustomerOffers(
    @Param('code') customerCode: string,
    @Query('name') customerName?: string,
  ) {
    return this.customerService.getCustomerOffers(customerCode, customerName);
  }

}