// src/modules/sku/sku-discount-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SkuDiscountService } from './sku-discount.service';
import { SFTPService } from '../integrations/sftp.service'; // ← matches your real class name

@Injectable()
export class SkuDiscountCronService {
  private readonly logger = new Logger(SkuDiscountCronService.name);

  constructor(
    private skuDiscount: SkuDiscountService,
    private sftp: SFTPService, // ← matches your real type
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateAndUpload(): Promise<void> {
    this.logger.log('Starting daily SKU discount generation...');

    try {
      const skus = [
        { skuCode: 'SKU001', volume: 1200, listPrice: 1000 },
        { skuCode: 'SKU002', volume: 300, listPrice: 500 },
      ];

      const results = skus.map((s) =>
        this.skuDiscount.calculateDiscount(s.skuCode, s.volume, s.listPrice),
      );

      const csvContent = this.toCsv(results);
      const remotePath = `/remote/sku-discounts/sku-discount-${Date.now()}.csv`;

      // No local temp file needed — your upload() takes content directly
      await this.sftp.upload(csvContent, remotePath);
      this.logger.log('SKU discount file uploaded successfully');
    } catch (err) {
      this.logger.error(`SKU discount cron failed: ${(err as Error).message}`);
    }
  }

  private toCsv(rows: any[]): string {
    if (rows.length === 0) return '';
    const headers = Object.keys(rows[0]).join(',');
    const lines = rows.map((row) => Object.values(row).join(','));
    return [headers, ...lines].join('\n');
  }

  async triggerManually(): Promise<void> {
    return this.generateAndUpload();
  }
}