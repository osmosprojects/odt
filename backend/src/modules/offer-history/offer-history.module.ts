import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferDetailsEntity } from '../../database/migrations/offer-details.entity';
import { CustDetailsEntity } from '../../database/migrations/cust-details.entity';
import { CustomerMasterEntity } from '../../database/migrations/customer-master.entity';
import { OfferHistoryController } from './offer-history.controller';
import { OfferHistoryService } from './offer-history.service';
import { OfferHistoryRepository } from './offer-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OfferDetailsEntity, CustDetailsEntity, CustomerMasterEntity])],
  controllers: [OfferHistoryController],
  providers: [OfferHistoryService, OfferHistoryRepository],
})
export class OfferHistoryModule {}
