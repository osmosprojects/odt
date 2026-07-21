// src/modules/approval/approval.module.ts
import { Module } from '@nestjs/common';
import { ApprovalWorkflowService } from './approval-workflow.service';
import { ApprovalController } from './approval.controller';

@Module({
  controllers: [ApprovalController],
  providers: [ApprovalWorkflowService],
  exports: [ApprovalWorkflowService],
})
export class ApprovalModule {}