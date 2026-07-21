import { Module } from '@nestjs/common';
import { OfferManagementService } from './offer-management.service';
import { OfferManagementController } from './offer-management.controller';

@Module({
  controllers: [OfferManagementController],
  providers: [OfferManagementService],
  exports: [OfferManagementService],
})
export class OfferManagementModule {}
