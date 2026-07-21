import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { KerisController } from './keris.controller';
import { KerisService } from './keris.service';
import { KerisSubmissionEntity } from '../../../database/migrations/keris.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KerisSubmissionEntity]), ConfigModule],
  controllers: [KerisController],
  providers: [KerisService],
  exports: [KerisService],
})
export class KerisModule {}