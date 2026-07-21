import { Injectable } from '@nestjs/common';

@Injectable()
export class WbcNumberService {
  formatWbcNumber(offerId: number): string {
    const year = new Date().getFullYear();
    const paddedId = String(offerId).padStart(6, '0');
    return `WBC-${year}-${paddedId}`;
  }
}