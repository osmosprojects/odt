import { Injectable, BadRequestException } from '@nestjs/common';
import { PidRepository, PidFilters } from './pid.repository';

export interface PidEntry {
  parentId: string;
  customerCode: string;
}

export interface PidValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable()
export class PidService {
  constructor(private pidRepo: PidRepository) {}

  validate(pid: PidEntry): PidValidationResult {
    const errors: string[] = [];
    if (!pid.parentId || pid.parentId.trim().length === 0) errors.push('parentId is required');
    if (!pid.customerCode || pid.customerCode.trim().length === 0) errors.push('customerCode is required');
    if (pid.parentId && pid.parentId.length > 50) errors.push('parentId exceeds maximum length of 50');
    return { isValid: errors.length === 0, errors };
  }

  validateBulk(pids: PidEntry[]) {
    const valid: PidEntry[] = [];
    const invalid: { entry: PidEntry; errors: string[] }[] = [];
    for (const pid of pids) {
      const result = this.validate(pid);
      if (result.isValid) valid.push(pid);
      else invalid.push({ entry: pid, errors: result.errors });
    }
    return { valid, invalid };
  }

  // PHP equivalent: pid_mapping.php — fetch existing mappings
  getMapping(filters: PidFilters) {
    return this.pidRepo.findByFilters(filters);
  }

  // PHP equivalent: pidAdd.php / pidAddDirect.php — persist after validation
  async mapToOffer(offerId: number, pids: PidEntry[]) {
    const { valid, invalid } = this.validateBulk(pids);
    if (invalid.length > 0) {
      throw new BadRequestException({ message: 'Some PID entries failed validation', invalid });
    }
    return this.pidRepo.createMany(offerId, valid);
  }
}