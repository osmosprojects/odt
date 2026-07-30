import { Controller, Post, Put, Get, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { KerisService } from './keris.service';
import { KerisSubmitDto, KerisUpdateDto } from './dto/keris.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/role.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../enums/roles.enum';

@Controller('keris')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KerisController {
  constructor(private readonly kerisService: KerisService) {}

  // ─────────────────────────────────────────────────────────────────────────
  // POST /keris/submit — replaces keris_submition_form.php
  //
  // Postman:
  //   POST http://localhost:3000/keris/submit
  //   Headers: Authorization: Bearer <token>, Content-Type: application/json
  //   Body: { "offerId": 101, "payload": { "customerCode": "C123" } }
  // ─────────────────────────────────────────────────────────────────────────
  @Post('submit')
  @Roles(Role.WS, Role.ASM)
  async submit(@Body() dto: KerisSubmitDto) {
    const result = await this.kerisService.submit(dto);
    return { success: true, data: result, message: 'Submitted to Keris successfully' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUT /keris/update — replaces keris_updation_form.php
  //
  // Postman:
  //   PUT http://localhost:3000/keris/update
  //   Headers: Authorization: Bearer <token>, Content-Type: application/json
  //   Body: { "offerId": 101, "kerisCode": "KRS-9981", "payload": { "status": "ACTIVE" } }
  // ─────────────────────────────────────────────────────────────────────────
  @Put('update')
  @Roles(Role.WS, Role.ASM)
  async update(@Body() dto: KerisUpdateDto) {
    const result = await this.kerisService.update(dto);
    return { success: true, data: result, message: 'Keris submission updated successfully' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET /keris/:offerId/status — replaces keris_view_submit.php
  //
  // Postman:
  //   GET http://localhost:3000/keris/101/status
  //   Headers: Authorization: Bearer <token>
  // ─────────────────────────────────────────────────────────────────────────
  @Get(':offerId/status')
  async getStatus(@Param('offerId', ParseIntPipe) offerId: number) {
    const data = await this.kerisService.getStatus(offerId);
    return { success: true, data };
  }
}