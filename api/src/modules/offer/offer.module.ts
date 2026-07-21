import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { OfferRepository } from './offer.repository';
import { OfferService } from './offer.service';
import { OfferValidationService } from './offer-validation.service';
import { OfferController } from './offer.controller';
import { WbcNumberService } from './wbc-number.service';
import { VolumePlanController } from './volume-plan/volume-plan.controller';
import { VolumePlanService } from './volume-plan/volume-plan.service';
import { ReminderCronService } from './reminder-cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfferEntity])],
  controllers: [OfferController,VolumePlanController],
  providers: [OfferRepository, OfferService, OfferValidationService,WbcNumberService,VolumePlanService,ReminderCronService],
})
export class OfferModule {}