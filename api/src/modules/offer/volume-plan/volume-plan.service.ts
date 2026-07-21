// PHP equivalent: volume_plan.php, volume_plan_2.php, wbc_active_pid_wise_volume_report.php
import { Injectable } from '@nestjs/common';

export interface VolumePlanEntry {
  pid: string;
  monthYear: string;
  plannedVolume: number;
  actualVolume: number;
}

export interface VolumePlanAggregate {
  pid: string;
  totalPlanned: number;
  totalActual: number;
  achievementPercent: number;
}

@Injectable()
export class VolumePlanService {
  // Placeholder in-memory data until the real VolumePlanEntity/table exists.
  // Once wired to TypeORM, this becomes a real query against the offer-linked table.
  private mockData: VolumePlanEntry[] = [];

  getByOffer(offerId: number): VolumePlanEntry[] {
    //replace with real query once VolumePlanEntity (BelongsTo OfferEntity) is built
    return this.mockData.filter((entry) => true); // offerId filter goes here once wired
  }

  aggregate(entries: VolumePlanEntry[]): VolumePlanAggregate[] {
    const grouped = new Map<string, { planned: number; actual: number }>();

    for (const entry of entries) {
      const existing = grouped.get(entry.pid) ?? { planned: 0, actual: 0 };
      existing.planned += entry.plannedVolume;
      existing.actual += entry.actualVolume;
      grouped.set(entry.pid, existing);
    }

    return Array.from(grouped.entries()).map(([pid, totals]) => ({
      pid,
      totalPlanned: totals.planned,
      totalActual: totals.actual,
      achievementPercent: totals.planned > 0
        ? Math.round((totals.actual / totals.planned) * 10000) / 100
        : 0,
    }));
  }
}