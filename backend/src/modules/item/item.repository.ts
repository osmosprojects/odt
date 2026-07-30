import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemMasterEntity } from '../../database/migrations/item-master.entity';

@Injectable()
export class ItemRepository {
  constructor(
    @InjectRepository(ItemMasterEntity)
    private repo: Repository<ItemMasterEntity>,
  ) {}

  async searchItems(
    q: string,
    stream?: string,
    page = 1,
    limit = 30,
  ): Promise<{ data: ItemMasterEntity[]; total: number }> {
    const qb = this.repo.createQueryBuilder('i');

    if (stream) {
      qb.andWhere('i.stream = :stream', { stream: stream.toUpperCase() });
    }

    if (q && q.trim().length >= 2) {
      const term = `%${q.trim()}%`;
      qb.andWhere(
        '(i.sku_code LIKE :term OR i.brand_name LIKE :term OR i.product_key LIKE :term)',
        { term },
      );
    }

    qb.andWhere('i.sku_code IS NOT NULL').andWhere("i.sku_code != ''");
    qb.orderBy('i.brand_name', 'ASC').skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  findBySkuCode(skuCode: string): Promise<ItemMasterEntity | null> {
    return this.repo.findOne({ where: { sku_code: skuCode } });
  }
}
