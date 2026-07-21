import { Module } from '@nestjs/common';
import { OfferLettersService } from './offer-letters.service';
import { OfferLettersController } from './offer-letters.controller';

@Module({
  controllers: [OfferLettersController],
  providers: [OfferLettersService],
  exports: [OfferLettersService],
})
export class OfferLettersModule {}
