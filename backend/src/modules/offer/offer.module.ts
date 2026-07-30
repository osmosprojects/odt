import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { OfferDetailsEntity } from '../../database/migrations/offer-details.entity';
import { CustDetailsEntity } from '../../database/migrations/cust-details.entity';
import { ActivityLogEntity } from '../../database/migrations/activity-log.entity';
import { OfferRepository } from './offer.repository';
import { OfferService } from './offer.service';
import { OfferValidationService } from './offer-validation.service';
import { OfferController } from './offer.controller';
import { WbcNumberService } from './wbc-number.service';
import { VolumePlanController } from './volume-plan/volume-plan.controller';
import { VolumePlanService } from './volume-plan/volume-plan.service';
import { ReminderCronService } from './reminder-cron.service';
import { OfferLetterService } from './offer-letter.service';
import { ActivityLogService } from './activity-log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OfferEntity,
      OfferDetailsEntity,
      CustDetailsEntity,
      ActivityLogEntity,
    ]),
  ],
  controllers: [OfferController, VolumePlanController],
  providers: [
    OfferRepository,
    OfferService,
    OfferValidationService,
    WbcNumberService,
    VolumePlanService,
    ReminderCronService,
    OfferLetterService,
    ActivityLogService,
  ],
  exports: [OfferService, ActivityLogService],
})
export class OfferModule {}