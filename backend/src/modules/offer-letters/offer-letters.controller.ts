import { Controller, Get, Post, Param } from '@nestjs/common';
import { OfferLettersService } from './offer-letters.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Offer Letters (PDF Generation & Management)')
@Controller('api/offer-letters')
export class OfferLettersController {
  constructor(private readonly offerLettersService: OfferLettersService) {}

  @ApiOperation({ summary: 'List all generated offer letters' })
  @Get()
  findAll() {
    return this.offerLettersService.findAll();
  }

  @ApiOperation({ summary: 'Generate commercial offer letter PDF' })
  @Post('generate/:offerId')
  generateLetter(@Param('offerId') offerId: string) {
    return this.offerLettersService.generateLetter(Number(offerId));
  }
}
