"use client";

import { useEffect, useState } from "react";
import { FilePenLine, Zap } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import RecipientsInput from "@/components/offer-letters/RecipientsInput";
import CronScheduleFields from "./CronScheduleFields";
import {
  CronSchedule,
  TriggerType,
  defaultCronSchedule,
  getMailerById,
  mailerConditions,
  triggerTypes,
} from "@/lib/mailer";

export default function EditMailerForm({ mailerId }: { mailerId: string }) {
  const mailer = getMailerById(mailerId);

  const [recipients, setRecipients] = useState<string[]>(mailer?.recipients ?? []);
  const [subject, setSubject] = useState(mailer?.subject ?? "");
  const [body, setBody] = useState(mailer?.body ?? "");
  const [condition, setCondition] = useState(mailer?.condition ?? mailerConditions[0]);
  const [triggerType, setTriggerType] = useState<TriggerType>(
    mailer?.triggerType ?? triggerTypes[0]
  );
  const [cron, setCron] = useState<CronSchedule>(mailer?.cron ?? defaultCronSchedule);
  const [saved, setSaved] = useState(false);

  // Re-sync local state whenever a different mailer is opened for editing.
  useEffect(() => {
    setRecipients(mailer?.recipients ?? []);
    setSubject(mailer?.subject ?? "");
    setBody(mailer?.body ?? "");
    setCondition(mailer?.condition ?? mailerConditions[0]);
    setTriggerType(mailer?.triggerType ?? triggerTypes[0]);
    setCron(mailer?.cron ?? defaultCronSchedule);
  }, [mailerId, mailer]);

  const isValid = subject.trim().length > 0 && body.trim().length > 0;

  const handleSaveAndActivate = () => {
    if (!isValid) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  if (!mailer) {
    return (
      <div className="bg-white rounded-card shadow-card border border-gray-100 p-6 text-sm text-brand-gray">
        Mailer not found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <FilePenLine size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Edit Mailer
        </h2>
      </div>
      <p className="text-xs text-brand-gray mb-5">
        Update recipients, content, conditions, and schedule for this mailer.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <FieldLabel>Mailer ID / Name</FieldLabel>
            <input
              type="text"
              readOnly
              value={`${mailer.id} — ${mailer.name}`}
              className={`${inputClass} bg-gray-50 text-brand-gray cursor-not-allowed`}
            />
          </div>

          <div>
            <FieldLabel>Define Recipients</FieldLabel>
            <RecipientsInput value={recipients} onChange={setRecipients} />
          </div>

          <div>
            <FieldLabel>Set Conditions</FieldLabel>
            <select
              className={inputClass}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {mailerConditions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Choose Trigger Type</FieldLabel>
            <select
              className={inputClass}
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as TriggerType)}
            >
              {triggerTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {triggerType === "Scheduled (Cron)" && (
            <CronScheduleFields value={cron} onChange={setCron} />
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div>
            <FieldLabel>Write Subject</FieldLabel>
            <input
              type="text"
              className={inputClass}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Write Body</FieldLabel>
            <textarea
              className={`${inputClass} min-h-[220px] resize-y`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray">
          Mailer ID / Name cannot be changed once created.
        </p>
        <button
          type="button"
          onClick={handleSaveAndActivate}
          disabled={!isValid}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary px-5 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-4"
        >
          <Zap size={15} /> Save & Activate
        </button>
      </div>

      {saved && (
        <div className="mt-4 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium px-3 py-2.5 text-center">
          Mailer updated and activated successfully.
        </div>
      )}
    </div>
  );
}