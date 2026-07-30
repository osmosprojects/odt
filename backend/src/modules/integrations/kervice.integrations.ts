import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KerisService {
  private readonly logger = new Logger(KerisService.name);

  async submit(_dto: unknown): Promise<void> {
    this.logger.warn('KerisService.submit() not yet implemented');
  }

  async update(_dto: unknown): Promise<void> {
    this.logger.warn('KerisService.update() not yet implemented');
  }

  async fetchStatus(_offerId: string): Promise<unknown> {
    this.logger.warn('KerisService.fetchStatus() not yet implemented');
    return null;
  }
}