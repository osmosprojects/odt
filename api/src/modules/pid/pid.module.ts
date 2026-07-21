import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PidMappingEntity } from '../../database/migrations/pid-mapping.entity';
import { PidController } from './pid.controller';
import { PidService } from './pid.service';
import { PidRepository } from './pid.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PidMappingEntity])],
  controllers: [PidController],
  providers: [PidService, PidRepository],
})
export class PidModule {}