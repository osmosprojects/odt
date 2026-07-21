"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Pencil,
  Pause,
  Play,
  Ban,
  Plus,
  ListChecks,
} from "lucide-react";
import { dofaMatrices, DofaMatrix, offerToolTypes } from "@/lib/offerManagement";
import { inputClass } from "@/components/ui/form";
import { api } from "@/lib/api";

const statusStyles: Record<DofaMatrix["status"], string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-orange-50 text-orange-600",
};

export default function ViewDofaApprovalListTable({
  onEdit,
  onAddNew,
}: {
  onEdit: (id: string) => void;
  onAddNew: () => void;
}) {
  const [toolFilter, setToolFilter] = useState("All Tool Types");
  const [rows, setRows] = useState<DofaMatrix[]>(dofaMatrices);

  useEffect(() => {
    api
      .getDofaMatrices()
      .then((data) => {
        if (data && data.length > 0) {
          setRows(data);
        }
      })
      .catch(() => {
        // Fallback to static mock data if server offline
      });
  }, []);

  const filtered = rows.filter(
    (r) => toolFilter === "All Tool Types" || r.offerToolType === toolFilter
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
            View DOFA Approval List
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
              placeholder="Search DOFA ID / Matrix Name..."
              className={`${inputClass} pl-8 py-1.5 w-56`}
            />
          </div>
          <select
            value={toolFilter}
            onChange={(e) => setToolFilter(e.target.value)}
            className={`${inputClass} py-1.5 w-auto`}
          >
            <option>All Tool Types</option>
            {offerToolTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white bg-primary px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-dark shrink-0"
          >
            <Plus size={15} /> <span className="hidden sm:inline">Add DOFA Flow</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left text-xs text-brand-gray border-b border-gray-100">
              <th className="py-2 px-1 font-medium">DOFA ID / Matrix Name</th>
              <th className="py-2 px-1 font-medium">Offer Tool Type</th>
              <th className="py-2 px-1 font-medium">Total Level</th>
              <th className="py-2 px-1 font-medium">Final DOFA</th>
              <th className="py-2 px-1 font-medium">Approval Mail</th>
              <th className="py-2 px-1 font-medium">Last Modified</th>
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
                    className="font-medium text-primary hover:underline"
                  >
                    {row.id}
                    <span className="block text-[11px] text-brand-gray font-normal">
                      {row.matrixName}
                    </span>
                  </button>
                </td>
                <td className="py-2.5 px-1 text-brand-dark">{row.offerToolType}</td>
                <td className="py-2.5 px-1 text-brand-dark">{row.levels.length}</td>
                <td className="py-2.5 px-1 text-brand-dark whitespace-nowrap">
                  &#8377; {row.finalDofa}
                </td>
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
                <td className="py-2.5 px-1 text-brand-gray whitespace-nowrap">
                  {row.lastModified}
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
                      aria-label="Mark inactive"
                      title="Mark Inactive"
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
                <td colSpan={8} className="py-8 text-center text-sm text-brand-gray">
                  No DOFA matrices match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}