import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustDetailsEntity } from '../../database/migrations/cust-details.entity';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(CustDetailsEntity) private repo: Repository<CustDetailsEntity>,
  ) {}

  findByOfferId(offerId: number): Promise<CustDetailsEntity | null> {
    return this.repo.findOne({ where: { offer_id: offerId } });
  }
}