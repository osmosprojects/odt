"use client";

import React, { useState } from "react";
import { PipelineOffer } from "./types";
import ActionButtons from "./ActionButtons";
import { ArrowUpDown } from "lucide-react";

interface OfferTableProps {
  offers: PipelineOffer[];
  loading: boolean;
  onView: (offer: PipelineOffer) => void;
  onEdit: (offer: PipelineOffer) => void;
  onReject: (offer: PipelineOffer) => void;
  onDelete: (offer: PipelineOffer) => void;
}

type SortField = "offerCode" | "customerName" | "committedVol" | "totalInvestment" | "avgGmpl";

export default function OfferTable({
  offers,
  loading,
  onView,
  onEdit,
  onReject,
  onDelete,
}: OfferTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedOffers = [...offers].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === "string") {
      return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
    }
    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block overflow-x-auto w-full max-w-full">
        <table className="w-full text-left border-collapse text-xs table-auto">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 select-none text-[10px] text-brand-gray uppercase font-bold">
            <tr>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("offerCode")}>
                <span className="flex items-center gap-1">Offer Code <ArrowUpDown size={12} /></span>
              </th>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("customerName")}>
                <span className="flex items-center gap-1">Customer Name <ArrowUpDown size={12} /></span>
              </th>
              <th className="p-4">Segment</th>
              <th className="p-4">WBC Period</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("committedVol")}>
                <span className="flex items-center gap-1">Committed Vol <ArrowUpDown size={12} /></span>
              </th>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("totalInvestment")}>
                <span className="flex items-center gap-1">Total Investment <ArrowUpDown size={12} /></span>
              </th>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("avgGmpl")}>
                <span className="flex items-center gap-1">Avg GMPL <ArrowUpDown size={12} /></span>
              </th>
              <th className="p-4 text-center">DOFA Approval</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150 bg-white">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {Array.from({ length: 9 }).map((__, tdIdx) => (
                    <td key={tdIdx} className="p-4"><div className="h-4 bg-gray-100 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : sortedOffers.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-brand-gray font-semibold">
                  No records to display.
                </td>
              </tr>
            ) : (
              sortedOffers.map((o) => (
                <tr key={o.offerCode} className="hover:bg-gray-50/50 transition odd:bg-white even:bg-gray-50/20">
                  <td className="p-4 font-extrabold text-brand-dark">{o.offerCode}</td>
                  <td className="p-4">
                    <p className="font-extrabold text-brand-dark text-xs">{o.customerName}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {o.customerBadges.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase
                            ${
                              badge === "DIRECT" 
                                ? "bg-emerald-50 text-primary border border-emerald-150" 
                                : badge === "DISTRIBUTOR"
                                ? "bg-sky-50 text-sky-700 border border-sky-100"
                                : badge === "New Customer"
                                ? "bg-violet-50 text-violet-700 border border-violet-100"
                                : "bg-gray-100 text-brand-gray border border-gray-200"
                            }
                          `}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-brand-gray font-semibold">{o.segment}</td>
                  <td className="p-4 font-semibold text-brand-dark">
                    <p>{o.wbcPeriod.startMonth}</p>
                    <p className="text-[10px] text-brand-gray font-semibold mt-0.5">
                      {o.wbcPeriod.durationMonths} Months ({o.wbcPeriod.endMonth})
                    </p>
                  </td>
                  <td className="p-4 font-extrabold text-brand-dark">
                    {o.committedVol.toLocaleString()} L
                  </td>
                  <td className="p-4 font-bold text-brand-dark">
                    ₹{o.totalInvestment.toLocaleString()}
                  </td>
                  <td className="p-4 font-black text-primary text-xs">
                    ₹{o.avgGmpl.toFixed(1)}/L
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block text-[9.5px] font-extrabold bg-emerald-50 text-primary border border-emerald-150 px-2 py-1 rounded-full uppercase tracking-wider">
                      {o.dofaApproval}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <ActionButtons
                      onView={() => onView(o)}
                      onEdit={() => onEdit(o)}
                      onReject={() => onReject(o)}
                      onDelete={() => onDelete(o)}
                      status={o.status}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden divide-y divide-gray-150 bg-white">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="p-4 space-y-2 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : sortedOffers.length === 0 ? (
          <div className="p-6 text-center text-brand-gray font-semibold">
            No records to display.
          </div>
        ) : (
          sortedOffers.map((o) => (
            <div key={o.offerCode} className="p-4 space-y-3 hover:bg-gray-50/50 transition">
              <div className="flex items-center justify-between gap-4">
                <span className="font-extrabold text-brand-dark text-xs">{o.offerCode}</span>
                <span className="text-[9.5px] font-extrabold bg-emerald-50 text-primary border border-emerald-150 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {o.dofaApproval}
                </span>
              </div>

              <div>
                <p className="font-extrabold text-brand-dark text-xs">{o.customerName}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {o.customerBadges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase bg-gray-100 text-brand-gray border border-gray-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-gray-50 p-2.5 rounded-lg border border-gray-150">
                <div>
                  <span className="text-brand-gray font-semibold block">WBC Period</span>
                  <span className="font-bold text-brand-dark">{o.wbcPeriod.startMonth} ({o.wbcPeriod.durationMonths}M)</span>
                </div>
                <div>
                  <span className="text-brand-gray font-semibold block">Volume</span>
                  <span className="font-extrabold text-brand-dark">{o.committedVol.toLocaleString()} L</span>
                </div>
                <div>
                  <span className="text-brand-gray font-semibold block">Investment</span>
                  <span className="font-bold text-brand-dark">₹{o.totalInvestment.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-brand-gray font-semibold block">Avg GMPL</span>
                  <span className="font-black text-primary">₹{o.avgGmpl.toFixed(1)}/L</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-brand-gray font-semibold">Segment: {o.segment}</span>
                <ActionButtons
                  onView={() => onView(o)}
                  onEdit={() => onEdit(o)}
                  onReject={() => onReject(o)}
                  onDelete={() => onDelete(o)}
                  status={o.status}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="bg-gray-50 border-t border-gray-200 py-3.5 px-4 flex items-center justify-between text-xs select-none">
        <span className="text-brand-gray font-semibold">
          Showing 1 to {sortedOffers.length} of {sortedOffers.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button type="button" disabled className="px-3 py-1.5 rounded border border-gray-200 bg-white text-brand-gray font-bold hover:bg-gray-50 disabled:opacity-40 cursor-not-allowed">
            Prev
          </button>
          <button type="button" className="px-3 py-1.5 rounded border border-primary bg-primary text-white font-extrabold shadow-sm">
            1
          </button>
          <button type="button" disabled className="px-3 py-1.5 rounded border border-gray-200 bg-white text-brand-gray font-bold hover:bg-gray-50 disabled:opacity-40 cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
