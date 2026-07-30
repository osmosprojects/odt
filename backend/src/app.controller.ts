import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { encryptOfferId, decryptOfferId } from './common/utils/crypto.utils';
import { SettingsService } from './common/services/settings.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly settingsService:SettingsService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('test-settings')   // ← now this gives you GET /test-settings directly
  testSettings() {
    return { adminEmail: this.settingsService.getAdminEmail() };
  }

  @Get('test-memory')
  testMemory() {
    return{
      nodeOptions: process.env.NODE_OPTIONS,
      execArgv: process.execArgv,
      heapLimitMB: Math.round(require('v8').getHeapStatistics().heap_size_limit / 1024 / 1024),
    }
  }
}

@Controller('test-crypto')
export class TestCryptoController {
  @Get('encrypt/:id')
  encrypt(@Param('id') id: string) {
    return { offerId: Number(id), encrypted: encryptOfferId(Number(id)) };
  }

  @Get('decrypt')
  decrypt(@Query('value') value: string) {
    return { encrypted: value, decrypted: decryptOfferId(value) };
  }
}

