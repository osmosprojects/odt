import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataService } from './master-data.service';
import { MasterDataController } from './master-data.controller';
import { Stream, Channel, Zone, Region, Territory, SkuMaster, CustomerMaster } from '../../entities/master-data.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Stream, Channel, Zone, Region, Territory, SkuMaster, CustomerMaster],
      'masterDbConnection',
    ),
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
  exports: [MasterDataService],
})
export class MasterDataModule {}
