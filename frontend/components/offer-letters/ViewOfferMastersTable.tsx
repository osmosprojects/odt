"use client";

import { useState } from "react";
import { Search, Mail, Pencil, Download, Plus, ListChecks } from "lucide-react";
import { offerMasters, offerLetterTypes } from "@/lib/offerLetters";
import { inputClass } from "@/components/ui/form";

export default function ViewOfferMastersTable({
  onEdit,
  onAddNew,
}: {
  onEdit: (id: string) => void;
  onAddNew: () => void;
}) {
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [search, setSearch] = useState("");

  const filtered = offerMasters.filter((r) => {
    const matchesType = typeFilter === "All Types" || r.type === typeFilter;
    const matchesSearch =
      !search || r.documentName.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownload = (documentName: string, type: string, updatedDate: string) => {
    const blob = new Blob(
      [`This is a placeholder for the current master document on file:\n\n${documentName}\nOffer Type: ${type}\nLast updated: ${updatedDate}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = documentName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ListChecks size={17} className="text-primary" />
          <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
            View Offer Masters
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search document name..."
              className={`${inputClass} pl-8 py-1.5 w-56`}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`${inputClass} py-1.5 w-auto`}
          >
            <option>All Types</option>
            {offerLetterTypes
              .filter((t) => t !== "None")
              .map((t) => (
                <option key={t}>{t}</option>
              ))}
          </select>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white bg-primary px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-dark shrink-0"
          >
            <Plus size={15} /> <span className="hidden sm:inline">New Offer Master</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-brand-gray border-b border-gray-100">
              <th className="py-2 px-1 font-medium">Offer Type</th>
              <th className="py-2 px-1 font-medium">Master Document</th>
              <th className="py-2 px-1 font-medium">Approval Mail</th>
              <th className="py-2 px-1 font-medium">Recipients</th>
              <th className="py-2 px-1 font-medium">Last Updated</th>
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
                    {row.type}
                  </button>
                </td>
                <td className="py-2.5 px-1 text-brand-dark truncate max-w-[220px]">
                  {row.documentName}
                </td>
                <td className="py-2.5 px-1">
                  {row.approvalMailName ? (
                    <span
                      className="inline-flex items-center gap-1 text-brand-gray"
                      title={row.approvalMailName}
                    >
                      <Mail size={14} />
                    </span>
                  ) : (
                    <span className="text-brand-gray">&mdash;</span>
                  )}
                </td>
                <td className="py-2.5 px-1 text-brand-gray">
                  {row.recipients.length > 0 ? row.recipients.length : "\u2014"}
                </td>
                <td className="py-2.5 px-1 text-brand-gray whitespace-nowrap">
                  {row.updatedDate}
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
                      onClick={() =>
                        handleDownload(row.documentName, row.type, row.updatedDate)
                      }
                      aria-label="Download"
                      title="Download"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-primary hover:bg-primary/5"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-brand-gray">
                  No offer masters match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}