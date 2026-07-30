import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustDetailsEntity } from '../../database/migrations/cust-details.entity';
import { CustomerMasterEntity } from '../../database/migrations/customer-master.entity';
import { OfferDetailsEntity } from '../../database/migrations/offer-details.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustDetailsEntity, CustomerMasterEntity, OfferDetailsEntity])],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
})
export class CustomerModule {}