import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private customerRepo: CustomerRepository) {}

  async getForOffer(offerId: number) {
    const customer = await this.customerRepo.findByOfferId(offerId);
    if (!customer) throw new NotFoundException(`No customer data found for offer ${offerId}`);
    return customer;
  }
}