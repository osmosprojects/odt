import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { PidService } from './pid.service';
import type {PidEntry} from './pid.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('pid-mapping')
@UseGuards(JwtAuthGuard)
export class PidController {
  constructor(private pidService: PidService) {}

  @Post('validate')
  validate(@Body() pid: PidEntry) {
    return this.pidService.validate(pid);
  }

  @Post('validate-bulk')
  validateBulk(@Body() pids: PidEntry[]) {
    return this.pidService.validateBulk(pids);
  }

  @Get()
  getMapping(@Query('offerId') offerId?: string, @Query('customerCode') customerCode?: string) {
    return this.pidService.getMapping({
      offerId: offerId ? Number(offerId) : undefined,
      customerCode,
    });
  }

  @Post()
  mapToOffer(@Body() body: { offerId: number; pids: PidEntry[] }) {
    return this.pidService.mapToOffer(body.offerId, body.pids);
  }
}