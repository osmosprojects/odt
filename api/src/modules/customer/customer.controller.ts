import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get(':id/offer-data')
  getForOffer(@Param('id', ParseIntPipe) offerId: number) {
    return this.customerService.getForOffer(offerId);
  }
}