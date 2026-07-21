"use client";

import { useState } from "react";
import { MailPlus, Zap } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import RecipientsInput from "@/components/offer-letters/RecipientsInput";
import CronScheduleFields from "./CronScheduleFields";
import {
  CronSchedule,
  TriggerType,
  defaultCronSchedule,
  mailerConditions,
  triggerTypes,
} from "@/lib/mailer";

export default function AddMailerForm() {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [condition, setCondition] = useState(mailerConditions[0]);
  const [triggerType, setTriggerType] = useState<TriggerType>(triggerTypes[0]);
  const [cron, setCron] = useState<CronSchedule>(defaultCronSchedule);
  const [saved, setSaved] = useState(false);

  const isValid = subject.trim().length > 0 && body.trim().length > 0;

  const handleSaveAndActivate = () => {
    if (!isValid) return;
    // In a real implementation this would POST the new mailer, then
    // navigate to / refresh the mailer list. Here we just show a
    // lightweight confirmation and reset the form.
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setRecipients([]);
      setSubject("");
      setBody("");
      setCondition(mailerConditions[0]);
      setTriggerType(triggerTypes[0]);
      setCron(defaultCronSchedule);
    }, 1600);
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <MailPlus size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Add New Mailer
        </h2>
      </div>
      <p className="text-xs text-brand-gray mb-5">
        Define who gets notified, what the mail says, and when it should
        fire.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column */}
        <div className="space-y-4">
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
              placeholder="Enter mail subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Write Body</FieldLabel>
            <textarea
              className={`${inputClass} min-h-[220px] resize-y`}
              placeholder="Enter mail body..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray">
          Subject and Body are required. Recipients are optional for
          event-based mailers with no direct audience.
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
          Mailer saved and activated successfully.
        </div>
      )}
    </div>
  );
}