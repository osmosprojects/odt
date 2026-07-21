import { Module } from '@nestjs/common';
import { InputManagementService } from './input-management.service';
import { InputManagementController } from './input-management.controller';

@Module({
  controllers: [InputManagementController],
  providers: [InputManagementService],
  exports: [InputManagementService],
})
export class InputManagementModule {}
