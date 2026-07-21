// PHP equivalent: mysqli_query + mysqli_fetch_array/assoc + mysqli_num_rows
import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial, ObjectLiteral } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  findAndCount(options: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repo.findAndCount(options);
  }

  findOneById(idField: keyof T, id: number | string): Promise<T | null> {
    return this.repo.findOne({ where: { [idField]: id } as FindOptionsWhere<T> });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async updateById(idField: keyof T, id: number | string, data: DeepPartial<T>): Promise<T | null> {
    await this.repo.update({ [idField]: id } as FindOptionsWhere<T>, data as any);
    return this.findOneById(idField, id);
  }

  async deleteById(idField: keyof T, id: number | string): Promise<boolean> {
    const result = await this.repo.delete({ [idField]: id } as FindOptionsWhere<T>);
    return !!result.affected;
  }
}