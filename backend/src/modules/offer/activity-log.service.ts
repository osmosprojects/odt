import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogEntity } from '../../database/migrations/activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private repo: Repository<ActivityLogEntity>,
  ) {}

  async logAction(
    action: string,
    offerId?: number,
    offerCode?: string,
    userName = 'System User',
    userRole = 'Sales Executive',
    details?: any,
  ) {
    const entry = this.repo.create({
      action,
      offer_id: offerId,
      offer_code: offerCode,
      user_name: userName,
      user_role: userRole,
      details: typeof details === 'string' ? details : JSON.stringify(details || {}),
    });
    return this.repo.save(entry);
  }

  async getLogsForOffer(offerId: number) {
    return this.repo.find({
      where: { offer_id: offerId },
      order: { created_at: 'DESC' },
    });
  }
}
