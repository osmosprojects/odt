"use client";

import { FieldLabel, inputClass } from "@/components/ui/form";
import { CronSchedule, cronDays, cronMonths, cronYears } from "@/lib/mailer";

/**
 * "Set Cron (if needed)" fields — time/day/month/year — shown only when
 * the mailer's trigger type is "Scheduled (Cron)".
 */
export default function CronScheduleFields({
  value,
  onChange,
}: {
  value: CronSchedule;
  onChange: (next: CronSchedule) => void;
}) {
  const update = (patch: Partial<CronSchedule>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-3">
      <p className="text-[11px] font-medium text-brand-gray">
        Set Cron (if needed)
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Time</FieldLabel>
          <input
            type="time"
            className={inputClass}
            value={value.time}
            onChange={(e) => update({ time: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>Day</FieldLabel>
          <select
            className={inputClass}
            value={value.day}
            onChange={(e) => update({ day: e.target.value })}
          >
            {cronDays.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Month</FieldLabel>
          <select
            className={inputClass}
            value={value.month}
            onChange={(e) => update({ month: e.target.value })}
          >
            {cronMonths.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Year</FieldLabel>
          <select
            className={inputClass}
            value={value.year}
            onChange={(e) => update({ year: e.target.value })}
          >
            {cronYears.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}