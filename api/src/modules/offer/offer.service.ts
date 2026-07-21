import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { OfferValidationService } from './offer-validation.service';
import { OfferPageOptionsDto } from './dtos/offer-page-options.dto';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { PageDto } from '../../common/dto/page.dto';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { WbcNumberService } from './wbc-number.service';

@Injectable()
export class OfferService {
  constructor(
    private offerRepo: OfferRepository,
    private validation: OfferValidationService,
    private wbcNumberService: WbcNumberService
  ) {}

  async findAll(pageOptions: OfferPageOptionsDto): Promise<PageDto<OfferEntity>> {
    const [data, total] = await this.offerRepo.findFiltered(pageOptions);
    return new PageDto(data, total, pageOptions);
  }

  async findOne(id: number): Promise<OfferEntity> {
    const offer = await this.offerRepo.findOneById('offer_id', id);
    if (!offer) throw new NotFoundException(`Offer ${id} not found`);
    return offer;
  }

  async create(dto: CreateOfferDto): Promise<OfferEntity> {
    if (!dto) {
      throw new BadRequestException('Request body is required');
    }

    if (!dto.expiration_date) {
      throw new BadRequestException('expiration_date is required');
    }

    this.validation.validateDates(dto.expiration_date);
    await this.validation.checkDuplicate(dto);

    const offer = await this.offerRepo.create(dto as any);
    offer.offer_code = this.wbcNumberService.formatWbcNumber(offer.offer_id);
    return this.offerRepo.save(offer);
  }
  async findAllForExport(): Promise<OfferEntity[]> {
    return this.offerRepo.findAllForExport();
  }
}