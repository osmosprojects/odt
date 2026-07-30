"use client";

import React from "react";
import { FormData } from "@/lib/offer-demo/types";

interface OfferBasicsSectionProps {
  data: {
    businessStream: string; // read-only — derived from selected customer
    offerCreationType: string;
    dollarValue: number;
  };
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: any) => void;
}

// Colour palette for business stream badge
const STREAM_PALETTE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  WBC:  { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200", label: "WBC – Wholesale Business Channel" },
  MCO:  { bg: "bg-violet-50",   text: "text-violet-700",  border: "border-violet-200",  label: "MCO – Motorcycle Oil" },
  HD:   { bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-200",    label: "HD – Heavy Duty" },
  IWS:  { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200",   label: "IWS – Industrial Workshop" },
  ILS:  { bg: "bg-orange-50",   text: "text-orange-700",  border: "border-orange-200",  label: "ILS – Indirect Lubricants" },
  CAS:  { bg: "bg-sky-50",      text: "text-sky-700",     border: "border-sky-200",     label: "CAS – Castrol Auto Service" },
  CASN: { bg: "bg-teal-50",     text: "text-teal-700",    border: "border-teal-200",    label: "CASN – Castrol Auto Service Network" },
};

export default function OfferBasicsSection({
  data,
  errors,
  onChange,
}: OfferBasicsSectionProps) {
  const streamKey = (data.businessStream || "").toUpperCase();
  const palette = STREAM_PALETTE[streamKey];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      {/* ── Business Stream — read-only badge (auto-filled from customer) ── */}
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1.5 block flex items-center gap-1">
          Business Stream
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded ml-1 uppercase tracking-wide">
            Auto-filled
          </span>
        </label>

        {data.businessStream ? (
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border font-bold text-sm w-full
              ${palette
                ? `${palette.bg} ${palette.text} ${palette.border}`
                : "bg-slate-100 text-slate-700 border-slate-200"}`}
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-60 shrink-0" />
            <span className="truncate">{palette?.label || data.businessStream}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm w-full">
            <span className="text-xs italic">Populated after customer selection</span>
          </div>
        )}
      </div>

      {/* ── Offer Creation Type ── */}
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1.5 block flex items-center justify-between">
          <span>Offer Creation Type <span className="text-red-500">*</span></span>
          {data.offerCreationType === "Copy/Edit" && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Template Mode
            </span>
          )}
        </label>
        <select
          value={data.offerCreationType}
          onChange={(e) => onChange("offerCreationType", e.target.value)}
          className={`w-full rounded-lg border text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-800 bg-white transition-all
            ${errors.offerCreationType ? "border-red-400 focus:ring-red-400/30" : "border-slate-200"}`}
        >
          <option value="New Offer">New Offer</option>
          <option value="Copy/Edit">Copy / Template Offer</option>
          <option value="Renewal">Renewal</option>
          <option value="Amendment">Amendment</option>
        </select>
        {errors.offerCreationType && (
          <span className="text-[11px] font-medium text-red-500 mt-1 block">
            {errors.offerCreationType}
          </span>
        )}
      </div>

      {/* ── Dollar Value ── */}
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
          Dollar Value (Rs) <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-xs font-semibold text-slate-500 pointer-events-none select-none">
            ₹
          </span>
          <input
            type="number"
            value={data.dollarValue}
            onChange={(e) => onChange("dollarValue", Number(e.target.value))}
            className={`w-full rounded-lg border text-sm pl-7 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-800 bg-white transition-all
              ${errors.dollarValue ? "border-red-400 focus:ring-red-400/30" : "border-slate-200"}`}
            placeholder="e.g. 250000"
            min="0"
          />
        </div>
        {errors.dollarValue && (
          <span className="text-[11px] font-medium text-red-500 mt-1 block">
            {errors.dollarValue}
          </span>
        )}
      </div>
    </div>
  );
}
