// PHP equivalent: adminmail() function — fetched admin email from DB or hardcoded
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingsService {
  constructor(private config: ConfigService) {}

  getAdminEmail(): string {
    const email = this.config.get<string>('WEB_ADMIN_EMAIL');
    if (!email) {
      throw new Error('WEB_ADMIN_EMAIL is not set in environment config');
    }
    return email;
  }
}