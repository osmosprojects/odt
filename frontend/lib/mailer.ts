export type TriggerType = "Event-based" | "Scheduled (Cron)" | "Manual";
export type MailerStatus = "Active" | "Inactive";

export interface CronSchedule {
  time: string; // "HH:mm"
  day: string; // e.g. "Every Day" | "Monday" | "15th"
  month: string; // e.g. "Every Month" | "January"
  year: string; // e.g. "Every Year" | "2026"
}

export interface Mailer {
  id: string;
  /** Short display name; falls back to a truncated subject line if not set. */
  name: string;
  recipients: string[];
  subject: string;
  body: string;
  condition: string;
  triggerType: TriggerType;
  cron?: CronSchedule;
  status: MailerStatus;
  createdDate: string;
}

export const mailerConditions = [
  "None",
  "Offer Expiring in 3 Days",
  "Offer Approved",
  "Offer Rejected",
  "New Lead Assigned",
  "Payment Overdue",
  "Document Master Updated",
];

export const triggerTypes: TriggerType[] = [
  "Event-based",
  "Scheduled (Cron)",
  "Manual",
];

export const cronDays = [
  "Every Day",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const cronMonths = [
  "Every Month",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const cronYears = ["Every Year", "2026", "2027", "2028"];

export const defaultCronSchedule: CronSchedule = {
  time: "09:00",
  day: "Every Day",
  month: "Every Month",
  year: "Every Year",
};

/** Human-readable summary shown in the mailer list table, e.g. "09:00 · Every Monday". */
export function formatCronSummary(
  triggerType: TriggerType,
  cron?: CronSchedule
): string {
  if (triggerType !== "Scheduled (Cron)" || !cron) {
    return triggerType === "Event-based" ? "Runs on event" : "Runs manually";
  }
  const dayLabel = cron.day === "Every Day" ? "Every day" : `Every ${cron.day}`;
  return `${cron.time} · ${dayLabel} · ${cron.month} · ${cron.year}`;
}

export const mailers: Mailer[] = [
  {
    id: "MLR-2026-0031",
    name: "Offer Expiry Reminder",
    recipients: ["credit.ops@castrol.com", "loans.desk@castrol.com"],
    subject: "Your Castrol B2B offer is expiring soon",
    body: "This is a reminder that your offer letter will expire in 3 days. Please take action before the deadline to avoid delays.",
    condition: "Offer Expiring in 3 Days",
    triggerType: "Event-based",
    status: "Active",
    createdDate: "12/06/2026",
  },
  {
    id: "MLR-2026-0028",
    name: "Weekly Approval Digest",
    recipients: ["approvals@castrol.com"],
    subject: "Weekly digest: pending approvals summary",
    body: "Here is a summary of all offer letters and mailer conditions pending your approval this week.",
    condition: "None",
    triggerType: "Scheduled (Cron)",
    cron: { time: "08:30", day: "Monday", month: "Every Month", year: "Every Year" },
    status: "Active",
    createdDate: "05/06/2026",
  },
  {
    id: "MLR-2026-0022",
    name: "New Lead Welcome Mail",
    recipients: ["sales.team@castrol.com"],
    subject: "A new lead has been assigned to you",
    body: "A new lead has just been assigned to your queue. Please review and reach out within 24 hours.",
    condition: "New Lead Assigned",
    triggerType: "Event-based",
    status: "Active",
    createdDate: "28/05/2026",
  },
  {
    id: "MLR-2026-0017",
    name: "Overdue Payment Alert",
    recipients: ["finance.ops@castrol.com"],
    subject: "Payment overdue — action required",
    body: "One or more accounts have an overdue payment. Please review the linked accounts and follow up with the customer.",
    condition: "Payment Overdue",
    triggerType: "Scheduled (Cron)",
    cron: { time: "07:00", day: "Every Day", month: "Every Month", year: "Every Year" },
    status: "Inactive",
    createdDate: "19/05/2026",
  },
  {
    id: "MLR-2026-0011",
    name: "Master Update Notice",
    recipients: [],
    subject: "A mailer condition master was just updated",
    body: "This is to notify the content team that the mailer condition master file has been updated. Please review the changes.",
    condition: "Document Master Updated",
    triggerType: "Manual",
    status: "Inactive",
    createdDate: "02/05/2026",
  },
];

/** Returns the mailer with the given id, if any. */
export function getMailerById(id: string): Mailer | undefined {
  return mailers.find((m) => m.id === id);
}

/* ------------------------------------------------------------------ */
/* Mailer condition master (uploaded reference file for conditions)    */
/* ------------------------------------------------------------------ */

export interface MailerConditionMaster {
  documentName: string;
  approvalMailName?: string;
  updatedDate: string;
  updatedBy: string;
}

export const mailerConditionMaster: MailerConditionMaster = {
  documentName: "Mailer_Condition_Master_v4.xlsx",
  approvalMailName: "Approval_Mail_MailerMaster.msg",
  updatedDate: "10/06/2026",
  updatedBy: "Castrol B2B Admin",
};