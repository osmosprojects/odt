"use client";

import React from "react";
import {
  Building2,
  MapPin,
  Hash,
  User2,
  Tag,
  Layers,
  CreditCard,
  FileText,
  Cpu,
  Calendar,
  Star,
} from "lucide-react";
import { FormData, Customer } from "@/lib/offer-demo/types";
import SearchCustomer from "./SearchCustomer";
import PerformanceComparison from "./PerformanceComparison";
import CustomerOfferHistory from "./CustomerOfferHistory";

interface CustomerSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: any) => void;
  previousOfferLoading?: boolean;
  customerOfferHistory?: any;
  customerOfferHistoryLoading?: boolean;
  customerOfferHistoryError?: string | null;
  onRefreshHistory?: () => void;
}

const STREAM_COLORS: Record<string, string> = {
  WBC:  "bg-emerald-100 text-emerald-800 border-emerald-200 ring-emerald-100",
  MCO:  "bg-violet-100 text-violet-800 border-violet-200 ring-violet-100",
  HD:   "bg-blue-100 text-blue-800 border-blue-200 ring-blue-100",
  IWS:  "bg-amber-100 text-amber-800 border-amber-200 ring-amber-100",
  ILS:  "bg-orange-100 text-orange-800 border-orange-200 ring-orange-100",
  CAS:  "bg-sky-100 text-sky-800 border-sky-200 ring-sky-100",
  CASN: "bg-teal-100 text-teal-800 border-teal-200 ring-teal-100",
};

function streamClass(s: string) {
  return STREAM_COLORS[(s ?? "").toUpperCase()] ?? "bg-slate-100 text-slate-700 border-slate-200 ring-slate-100";
}

function ReadOnlyField({
  label,
  value,
  icon: Icon,
  wide = false,
  highlight = true,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
  wide?: boolean;
  highlight?: boolean;
}) {
  const isEmpty = !value || value === "N/A";
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <div className="flex items-center gap-1 mb-1">
        {Icon && <Icon size={10} className="text-slate-400 shrink-0" />}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {highlight && (
          <span className="text-[8px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1 py-px rounded uppercase tracking-widest ml-auto">
            System
          </span>
        )}
      </div>
      <div
        className={`text-xs font-semibold px-2.5 py-2 rounded-lg border transition-all
          ${isEmpty
            ? "text-slate-400 italic bg-slate-50 border-slate-150 border-dashed"
            : highlight
              ? "text-slate-800 bg-blue-50/60 border-blue-100"
              : "text-slate-800 bg-slate-50 border-slate-200"
          }`}
      >
        {isEmpty ? "Not available" : value}
      </div>
    </div>
  );
}

export default function CustomerSection({
  formData,
  errors,
  onChange,
  previousOfferLoading = false,
  customerOfferHistory = null,
  customerOfferHistoryLoading = false,
  customerOfferHistoryError = null,
  onRefreshHistory,
}: CustomerSectionProps) {
  const handleSelectCustomer = (customer: Customer | null) => {
    onChange("selectedCustomer", customer);
    if (customer) {
      onChange("gstNumberBg", customer.gstNumber || "");
      onChange("gstNameBg", customer.name || "");
    }
  };

  const c = formData.selectedCustomer;

  return (
    <div className="space-y-5">
      {/* ── 1. Customer Search & Selection ──────────────────────────────── */}
      <div className="border border-slate-150 rounded-xl p-4 sm:p-5 space-y-4 bg-white shadow-xs">
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Search Customer Code or Name <span className="text-red-500">*</span>
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Search by customer JDE code, name, or account ID to auto-fill verified business master details.
          </p>
          <SearchCustomer
            selectedCustomer={c}
            onSelect={handleSelectCustomer}
            error={errors.selectedCustomer}
          />
        </div>
      </div>

      {/* ── 2. Verified Customer Master Profile ──────────────────────────── */}
      {c && (
        <div className="border border-slate-150 rounded-xl p-4 sm:p-5 space-y-4 bg-white shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-primary shrink-0" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {c.name}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ring-1 ${streamClass(
                  c.businessStream || ""
                )}`}
              >
                {c.businessStream || "Stream N/A"}
              </span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ReadOnlyField
              label="Customer Code"
              value={c.customerCode || c.jdeCode || "N/A"}
              icon={Hash}
            />
            <ReadOnlyField
              label="JDE Account No."
              value={c.jdeCode || c.customerCode || "N/A"}
              icon={Building2}
            />
            <ReadOnlyField
              label="Account ID"
              value={c.id || "N/A"}
              icon={Hash}
            />
            <ReadOnlyField
              label="Executive Name"
              value={c.executive || c.salesRep || "N/A"}
              icon={User2}
            />
            <ReadOnlyField
              label="Executive Code"
              value={c.executiveCode || "N/A"}
              icon={Hash}
            />
            <ReadOnlyField
              label="State"
              value={c.state || "N/A"}
              icon={MapPin}
            />
            <ReadOnlyField
              label="Distributor"
              value={c.distributorName || "N/A"}
              icon={Building2}
            />
            <ReadOnlyField
              label="Segment"
              value={c.segment || "N/A"}
              icon={Layers}
            />
            <ReadOnlyField
              label="Sub Segment"
              value={c.subSegment || "N/A"}
              icon={Layers}
            />
            <ReadOnlyField
              label="GST No."
              value={c.gstNumber || "N/A"}
              icon={FileText}
            />
            <ReadOnlyField
              label="Address"
              value={c.address || "N/A"}
              icon={MapPin}
              wide={true}
            />
          </div>
        </div>
      )}

      {/* ── 3. Customer Past Offers & History ────────────────────────────────────── */}
      {c && (
        <CustomerOfferHistory
          customerCode={c.jdeCode || c.customerCode || ""}
          customerName={c.name}
          offers={customerOfferHistory}
          loading={customerOfferHistoryLoading}
          error={customerOfferHistoryError}
          onChange={onChange}
          onRefreshOffers={onRefreshHistory}
        />
      )}

      {/* ── 4. Performance & Investment Comparison ─────────────────────── */}
      <div className="border border-slate-150 rounded-xl p-4 sm:p-5 space-y-4 bg-white shadow-xs">
        <PerformanceComparison
          formData={formData}
          onChange={onChange}
          errors={errors}
          previousOfferLoading={previousOfferLoading}
        />
      </div>

      {/* ── 5. Qualitative Justifications ─────────────────────────────── */}
      <div className="border border-slate-150 rounded-xl p-4 sm:p-5 space-y-4 bg-white">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
          Qualitative Investment Justifications
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              Why Invest? <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.whyInvest}
              onChange={(e) => onChange("whyInvest", e.target.value)}
              className={`w-full rounded-lg border text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary text-slate-800 bg-white resize-y
                ${errors.whyInvest ? "border-red-400" : "border-slate-200"}`}
              placeholder="Strategic importance, customer value..."
            />
            {errors.whyInvest && (
              <span className="text-[11px] font-medium text-red-500 mt-1 block">
                {errors.whyInvest}
              </span>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              Risks to Volume &amp; Profitability <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.risksToVolume}
              onChange={(e) => onChange("risksToVolume", e.target.value)}
              className={`w-full rounded-lg border text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary text-slate-800 bg-white resize-y
                ${errors.risksToVolume ? "border-red-400" : "border-slate-200"}`}
              placeholder="Competitor actions, price drops..."
            />
            {errors.risksToVolume && (
              <span className="text-[11px] font-medium text-red-500 mt-1 block">
                {errors.risksToVolume}
              </span>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              Mitigation Actions <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.mitigationToRisk}
              onChange={(e) => onChange("mitigationToRisk", e.target.value)}
              className={`w-full rounded-lg border text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary text-slate-800 bg-white resize-y
                ${errors.mitigationToRisk ? "border-red-400" : "border-slate-200"}`}
              placeholder="Incentive locks, volume rebates..."
            />
            {errors.mitigationToRisk && (
              <span className="text-[11px] font-medium text-red-500 mt-1 block">
                {errors.mitigationToRisk}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
