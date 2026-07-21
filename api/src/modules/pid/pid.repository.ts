import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { PidMappingEntity } from '../../database/migrations/pid-mapping.entity';

export interface PidFilters {
  offerId?: number;
  customerCode?: string;
}

@Injectable()
export class PidRepository {
  constructor(
    @InjectRepository(PidMappingEntity) private repo: Repository<PidMappingEntity>,
  ) {}

  findByFilters(filters: PidFilters): Promise<PidMappingEntity[]> {
    const where: FindOptionsWhere<PidMappingEntity> = {};
    if (filters.offerId) where.offer_id = filters.offerId;
    if (filters.customerCode) where.customer_code = filters.customerCode;
    return this.repo.find({ where });
  }

  async createMany(offerId: number, pids: { parentId: string; customerCode: string }[]): Promise<PidMappingEntity[]> {
    const entities = pids.map((p) =>
      this.repo.create({ offer_id: offerId, parent_id: p.parentId, customer_code: p.customerCode }),
    );
    return this.repo.save(entities);
  }
}