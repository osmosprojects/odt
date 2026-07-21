import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VolumePlanService, VolumePlanEntry } from './volume-plan.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('volume-plan')
@UseGuards(JwtAuthGuard)
export class VolumePlanController {
  constructor(private volumePlan: VolumePlanService) {}

  // Test route — pass in raw entries to aggregate, since no real table exists yet
  @Post('aggregate-test')
  aggregateTest(@Body() entries: VolumePlanEntry[]) {
    return this.volumePlan.aggregate(entries);
  }
}