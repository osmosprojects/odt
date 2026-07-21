
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FinancialCalcService } from './financial-calc.service';
import { GMCalcDto } from './dto/gm-calc.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('financials')
@UseGuards(JwtAuthGuard)
export class FinancialController {
  constructor(private readonly financialCalcService: FinancialCalcService) {}

  // ─────────────────────────────────────────────────────────────────────────
  // POST /financials/gm-pool
  // Replaces: inline GM calc blocks in financials.php, output_lc.php,
  // calculation.php, offer_list.php (and CS/TS/VS variant files)
  //
  // Postman:
  //   POST http://localhost:3000/financials/gm-pool
  //   Headers: Authorization: Bearer <token>, Content-Type: application/json
  //   Body:
  //   {
  //     "listPrice": 1000,
  //     "cogs": 600,
  //     "discount": 50,
  //     "foc": 20,
  //     "investment": 30,
  //     "volume": 500,
  //     "offerType": "STANDARD"
  //   }
  // ─────────────────────────────────────────────────────────────────────────
  @Post('gm-pool')
  calculateGMPool(@Body() dto: GMCalcDto) {
    const result = this.financialCalcService.calculateGMPool(dto);
    return { success: true, data: result };
  }
}