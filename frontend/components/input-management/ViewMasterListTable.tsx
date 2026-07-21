"use client";

import { useState } from "react";
import { Search, Mail, Download, Pencil, Trash2, Ban, Play, ListChecks } from "lucide-react";
import { inputClass } from "@/components/ui/form";
import {
  masterRecords,
  masterTypeOptions,
  MasterStatus,
} from "@/lib/inputManagement";

const statusStyles: Record<MasterStatus, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  "Pending Approval": "bg-orange-50 text-orange-600",
  Inactive: "bg-gray-100 text-gray-500",
};

export default function ViewMasterListTable({
  onEdit,
}: {
  onEdit?: (id: string) => void;
}) {
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [rows, setRows] = useState(masterRecords);

  const filtered = rows.filter(
    (r) => typeFilter === "All Types" || r.masterType === typeFilter
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

  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDownload = (fileName: string) => {
    const blob = new Blob([`Placeholder for master file: ${fileName}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ListChecks size={17} className="text-primary" />
          <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
            View Master List
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
              placeholder="Search Master Type..."
              className={`${inputClass} pl-8 py-1.5 w-56`}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`${inputClass} py-1.5 w-auto`}
          >
            <option>All Types</option>
            {masterTypeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="text-left text-xs text-brand-gray border-b border-gray-100">
              <th className="py-2 px-1 font-medium">Master Type</th>
              <th className="py-2 px-1 font-medium">Last Updated On</th>
              <th className="py-2 px-1 font-medium">Uploaded By</th>
              <th className="py-2 px-1 font-medium">Approval Mail</th>
              <th className="py-2 px-1 font-medium">Download Current Master</th>
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
                <td className="py-2.5 px-1 font-medium text-brand-dark">
                  {row.masterType}
                </td>
                <td className="py-2.5 px-1 text-brand-gray whitespace-nowrap">
                  {row.lastUpdatedOn}
                </td>
                <td className="py-2.5 px-1 text-brand-dark">{row.uploadedBy}</td>
                <td className="py-2.5 px-1">
                  {row.approvalMailName ? (
                    <button
                      className="inline-flex items-center gap-1 text-brand-gray hover:text-primary"
                      aria-label="View approval mail"
                      title={row.approvalMailName}
                    >
                      <Mail size={14} />
                    </button>
                  ) : (
                    <span className="text-brand-gray">&mdash;</span>
                  )}
                </td>
                <td className="py-2.5 px-1">
                  <button
                    onClick={() => handleDownload(row.masterFileName)}
                    className="inline-flex items-center gap-1 text-brand-gray hover:text-primary"
                    aria-label="Download current master"
                    title="Download current master"
                  >
                    <Download size={14} />
                  </button>
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
                      onClick={() => onEdit?.(row.id)}
                      aria-label="Edit"
                      title="Edit"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-primary hover:bg-primary/5"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => toggleStatus(row.id)}
                      aria-label={row.status === "Active" ? "Deactivate" : "Activate"}
                      title={row.status === "Active" ? "Deactivate" : "Activate"}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-orange-500 hover:bg-orange-50"
                    >
                      {row.status === "Active" ? (
                        <Ban size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      aria-label="Delete"
                      title="Delete"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-brand-gray">
                  No masters match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}