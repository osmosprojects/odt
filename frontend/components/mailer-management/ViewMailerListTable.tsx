"use client";

import { useState } from "react";
import { Search, Pencil, Pause, Play, Ban, Plus, ListChecks } from "lucide-react";
import {
  mailers,
  mailerConditions,
  triggerTypes,
  MailerStatus,
  formatCronSummary,
} from "@/lib/mailer";
import { inputClass } from "@/components/ui/form";

const statusStyles: Record<MailerStatus, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-orange-50 text-orange-600",
};

const statusLabel: Record<MailerStatus, string> = {
  Active: "Active (Running)",
  Inactive: "Inactive (Paused)",
};

function truncate(text: string, max = 42) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default function ViewMailerListTable({
  onEdit,
  onAddNew,
}: {
  onEdit: (id: string) => void;
  onAddNew: () => void;
}) {
  const [conditionFilter, setConditionFilter] = useState("All Conditions");
  const [triggerFilter, setTriggerFilter] = useState("All Triggers");
  const [rows, setRows] = useState(mailers);

  const filtered = rows.filter(
    (r) =>
      (conditionFilter === "All Conditions" || r.condition === conditionFilter) &&
      (triggerFilter === "All Triggers" || r.triggerType === triggerFilter)
  );

  const toggleStatus = (id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" }
          : r
      )
    );
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ListChecks size={17} className="text-primary" />
          <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
            View Mailer List
          </h2>
        </div>

        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
          <div className="relative hidden sm:block shrink-0">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Mailer ID / Name..."
              className={`${inputClass} pl-8 py-1.5 w-56`}
            />
          </div>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="shrink-0 rounded-lg border border-gray-200 text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-brand-dark bg-white w-40"
          >
            <option>All Conditions</option>
            {mailerConditions
              .filter((c) => c !== "None")
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
          <select
            value={triggerFilter}
            onChange={(e) => setTriggerFilter(e.target.value)}
            className="shrink-0 rounded-lg border border-gray-200 text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-brand-dark bg-white w-40"
          >
            <option>All Triggers</option>
            {triggerTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white bg-primary px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-dark shrink-0"
          >
            <Plus size={15} /> <span className="hidden sm:inline">New Mailer</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="text-left text-xs text-brand-gray border-b border-gray-100">
              <th className="py-2 px-1 font-medium">Mailer ID / Name</th>
              <th className="py-2 px-1 font-medium">Subject Line</th>
              <th className="py-2 px-1 font-medium">Condition</th>
              <th className="py-2 px-1 font-medium">Trigger Type / Run Time</th>
              <th className="py-2 px-1 font-medium">Status</th>
              <th className="py-2 px-1 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
              >
                <td className="py-2.5 px-1">
                  <button
                    onClick={() => onEdit(row.id)}
                    className="font-medium text-primary hover:underline text-left"
                  >
                    {row.id}
                    <span className="block text-[11px] text-brand-gray font-normal">
                      {row.name}
                    </span>
                  </button>
                </td>
                <td className="py-2.5 px-1 text-brand-dark" title={row.subject}>
                  {truncate(row.subject)}
                </td>
                <td className="py-2.5 px-1 text-brand-gray">{row.condition}</td>
                <td className="py-2.5 px-1 text-brand-gray whitespace-nowrap">
                  <span className="block text-brand-dark">{row.triggerType}</span>
                  <span className="block text-[11px]">
                    {formatCronSummary(row.triggerType, row.cron)}
                  </span>
                </td>
                <td className="py-2.5 px-1">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusStyles[row.status]}`}
                  >
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td className="py-2.5 px-1">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(row.id)}
                      aria-label="Edit"
                      title="Edit"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-primary hover:bg-primary/5"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => toggleStatus(row.id)}
                      aria-label={row.status === "Active" ? "Pause" : "Resume"}
                      title={row.status === "Active" ? "Pause" : "Resume"}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-orange-500 hover:bg-orange-50"
                    >
                      {row.status === "Active" ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                    </button>
                    <button
                      aria-label="Deactivate"
                      title="Deactivate"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-red-500 hover:bg-red-50"
                    >
                      <Ban size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-brand-gray">
                  No mailers match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}