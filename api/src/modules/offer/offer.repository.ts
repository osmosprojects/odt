import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from '../../common/utils/base.utils';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { OfferPageOptionsDto } from './dtos/offer-page-options.dto';

@Injectable()
export class OfferRepository extends BaseRepository<OfferEntity> {
  constructor(@InjectRepository(OfferEntity) repo: Repository<OfferEntity>) {
    super(repo);
  }

  findFiltered(opts: OfferPageOptionsDto): Promise<[OfferEntity[], number]> {
    const where: FindOptionsWhere<OfferEntity> = {};
    if (opts.status) where.account_status = opts.status;
    if (opts.category) where.offer_category = opts.category;

    return this.repo.findAndCount({
      where,
      skip: opts.skip,
      take: opts.limit,
      order: { created_date: 'DESC' },
    });
  }

  // #19 — duplicate validation: same executive_code + same expiration_date = likely duplicate
  async findPotentialDuplicate(executiveCode: number, expirationDate: string): Promise<OfferEntity | null> {
    return this.repo.findOne({
      where: { executive_code: executiveCode, expiration_date: new Date(expirationDate) as any },
    });
  }

  findAllForExport(): Promise<OfferEntity[]> {
    return this.repo.find();
  }

  save(offer: OfferEntity): Promise<OfferEntity> {
    return this.repo.save(offer);
  }

}