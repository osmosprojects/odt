import { Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KerisSubmissionEntity } from '../../../database/migrations/keris.entity';
import { KerisSubmitDto, KerisUpdateDto, KerisStatusResponseDto } from '../keris/dto/keris.dto';

/**
 * Replaces: keris_submition_form.php, keris_updation_form.php, keris_view_submit.php
 *
 * Isolated external API integration. All 3 PHP files just built a payload and
 * called the same external Keris endpoint with different actions — consolidated here.
 *
 * Includes basic retry (3 attempts, exponential backoff) and a simple
 * circuit-breaker (skips calls for COOLDOWN_MS after CIRCUIT_THRESHOLD consecutive failures).
 */
@Injectable()
export class KerisService {
  private readonly logger = new Logger(KerisService.name);
  private readonly kerisBaseUrl: string;
  private readonly kerisApiKey: string;

  // --- simple in-memory circuit breaker state ---
  private consecutiveFailures = 0;
  private circuitOpenedAt: number | null = null;
  private readonly CIRCUIT_THRESHOLD = 5;
  private readonly COOLDOWN_MS = 30_000;

  constructor(
    @InjectRepository(KerisSubmissionEntity)
    private readonly kerisRepo: Repository<KerisSubmissionEntity>,
    private readonly configService: ConfigService,
  ) {
    this.kerisBaseUrl = this.configService.get<string>('KERIS_API_BASE_URL', 'https://keris.example.com/api');
    this.kerisApiKey = this.configService.get<string>('KERIS_API_KEY', '');
  }

  // POST /keris/submit
  async submit(dto: KerisSubmitDto): Promise<KerisSubmissionEntity> {
    const result = await this.callKerisApi('POST', '/submit', {
      offerId: dto.offerId,
      ...dto.payload,
    });

    const record = this.kerisRepo.create({
      offerId: dto.offerId,
      kerisCode: result.kerisCode ?? null,
      submitDate: new Date(),
      status: 'SUBMITTED',
      response: JSON.stringify(result),
    });

    return this.kerisRepo.save(record);
  }

  // PUT /keris/update
  async update(dto: KerisUpdateDto): Promise<KerisSubmissionEntity> {
    const existing = await this.kerisRepo.findOne({ where: { offerId: dto.offerId } });
    if (!existing) {
      throw new NotFoundException(`No Keris submission found for offer ${dto.offerId}`);
    }

    const result = await this.callKerisApi('PUT', '/update', {
      kerisCode: dto.kerisCode,
      offerId: dto.offerId,
      ...dto.payload,
    });

    existing.status = 'UPDATED';
    existing.response = JSON.stringify(result);
    existing.kerisCode = dto.kerisCode;

    return this.kerisRepo.save(existing);
  }

  // GET /keris/:offerId/status
  async getStatus(offerId: number): Promise<KerisStatusResponseDto> {
    const record = await this.kerisRepo.findOne({ where: { offerId } });

    if (!record) {
      throw new NotFoundException(`No Keris submission found for offer ${offerId}`);
    }

    return {
      offerId: record.offerId,
      kerisCode: record.kerisCode,
      status: record.status,
      submitDate: record.submitDate,
      response: record.response ? JSON.parse(record.response) : null,
    };
  }

  // --- private helpers -----------------------------------------------------

  private async callKerisApi(
    method: 'POST' | 'PUT' | 'GET',
    path: string,
    body?: Record<string, any>,
  ): Promise<any> {
    this.assertCircuitClosed();

    const maxAttempts = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(`${this.kerisBaseUrl}${path}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.kerisApiKey}`,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`Keris API responded ${response.status}: ${await response.text()}`);
        }

        this.recordSuccess();
        return await response.json();
      } catch (err) {
        lastError = err;
        this.logger.warn(`Keris API attempt ${attempt}/${maxAttempts} failed: ${err}`);

        if (attempt < maxAttempts) {
          await this.sleep(2 ** attempt * 200); // 400ms, 800ms backoff
        }
      }
    }

    this.recordFailure();
    throw new ServiceUnavailableException(`Keris API unreachable after ${maxAttempts} attempts: ${lastError?.message}`);
  }

  private assertCircuitClosed(): void {
    if (this.circuitOpenedAt && Date.now() - this.circuitOpenedAt < this.COOLDOWN_MS) {
      throw new ServiceUnavailableException('Keris API circuit breaker open — too many recent failures');
    }
    if (this.circuitOpenedAt && Date.now() - this.circuitOpenedAt >= this.COOLDOWN_MS) {
      // cooldown expired, allow a retry attempt
      this.circuitOpenedAt = null;
      this.consecutiveFailures = 0;
    }
  }

  private recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.circuitOpenedAt = null;
  }

  private recordFailure(): void {
    this.consecutiveFailures += 1;
    if (this.consecutiveFailures >= this.CIRCUIT_THRESHOLD) {
      this.circuitOpenedAt = Date.now();
      this.logger.error('Keris API circuit breaker OPENED due to repeated failures');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}