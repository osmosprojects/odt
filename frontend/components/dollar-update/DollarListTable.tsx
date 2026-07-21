"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Download, Plus, ListChecks } from "lucide-react";
import { dollarRates, DollarRate, DollarStatus } from "@/lib/offerManagement";
import { inputClass } from "@/components/ui/form";
import { api } from "@/lib/api";

const statusStyles: Record<DollarStatus, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Expired: "bg-red-50 text-red-500",
  Upcoming: "bg-blue-50 text-brand-blue",
};

export default function DollarListTable({ onAddNew }: { onAddNew: () => void }) {
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [rows, setRows] = useState<DollarRate[]>(dollarRates);

  useEffect(() => {
    api
      .getDollarRates()
      .then((data) => {
        if (data && data.length > 0) {
          setRows(data);
        }
      })
      .catch(() => {
        // Fallback to static mock data if server offline
      });
  }, []);

  const statuses: DollarStatus[] = ["Active", "Upcoming", "Expired"];

  const filtered = rows.filter(
    (r) => statusFilter === "All Statuses" || r.status === statusFilter
  );

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ListChecks size={17} className="text-primary" />
          <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
            Dollar List
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search ID / Code..."
              className={`${inputClass} pl-8 py-1.5 w-56`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputClass} py-1.5 w-auto`}
          >
            <option>All Statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white bg-primary px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-dark shrink-0"
          >
            <Plus size={15} /> <span className="hidden sm:inline">New Dollar</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-xs text-brand-gray border-b border-gray-100">
              <th className="py-2 px-1 font-medium">ID / Code</th>
              <th className="py-2 px-1 font-medium">1 Dollar ($) = Rupees (INR)</th>
              <th className="py-2 px-1 font-medium">Dollar Valid From</th>
              <th className="py-2 px-1 font-medium">Dollar Valid Till</th>
              <th className="py-2 px-1 font-medium">Dollar Added Date</th>
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
                <td className="py-2.5 px-1 font-medium text-brand-dark">{row.id}</td>
                <td className="py-2.5 px-1 text-brand-dark whitespace-nowrap">
                  &#8377; {row.value.toFixed(2)}
                </td>
                <td className="py-2.5 px-1 text-brand-gray whitespace-nowrap">
                  {row.validFrom}
                </td>
                <td className="py-2.5 px-1 text-brand-gray whitespace-nowrap">
                  {row.validTill ?? "—"}
                </td>
                <td className="py-2.5 px-1 text-brand-gray whitespace-nowrap">
                  {row.addedDate}
                </td>
                <td className="py-2.5 px-1">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-2.5 px-1">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      aria-label="Preview approval mail"
                      title={row.approvalMailName ?? "No attachment"}
                      disabled={!row.approvalMailName}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      aria-label="Download approval mail"
                      title={row.approvalMailName ?? "No attachment"}
                      disabled={!row.approvalMailName}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-brand-gray">
                  No dollar rates match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}