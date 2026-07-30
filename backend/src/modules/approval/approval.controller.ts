import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApprovalWorkflowService } from './approval-workflow.service';
import { Role } from '../../enums/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('approval-test')
@UseGuards(JwtAuthGuard) 
export class ApprovalController {
  constructor(private workflow: ApprovalWorkflowService) {}

  // GET /approval-test/next?level=0
  @Get('next')
  getNext(@Query('level') level: string) {
    return this.workflow.getNextApprover(Number(level));
  }

  // GET /approval-test/can-approve?level=0&role=WS
  @Get('can-approve')
  canApprove(@Query('level') level: string, @Query('role') role: string) {
    return { canApprove: this.workflow.canApprove(Number(level), role as Role) };
  }
}