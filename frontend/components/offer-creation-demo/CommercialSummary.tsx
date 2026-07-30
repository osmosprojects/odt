"use client";

import React from "react";
import { FormData } from "@/lib/offer-demo/types";
import { calculateCommercials } from "@/lib/offer-demo/calculations";
import { 
  Package, 
  Gift, 
  Coins, 
  Percent, 
  Award, 
  CheckCircle2, 
  CircleDollarSign, 
  Layers 
} from "lucide-react";

interface CommercialSummaryProps {
  formData: FormData;
}

export default function CommercialSummary({ formData }: CommercialSummaryProps) {
  // Re-use live calculations from engine without duplicating logic
  const metrics = calculateCommercials(formData);

  // Currency helper
  const formatCurrency = (val: number) => {
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  };

  // DOFA Badge color helper
  let dofaBadgeColor = "bg-emerald-600 text-white";
  if (metrics.dofaLevel === "L3") dofaBadgeColor = "bg-amber-500 text-white";
  else if (metrics.dofaLevel === "L4" || metrics.dofaLevel === "L5") dofaBadgeColor = "bg-rose-600 text-white";

  const totalInvestmentVal = formData.totalInvestment || (formData.targetIncentive || 0) + (formData.signOnBonus || 0) + (formData.additionalCashLoan || 0);

  // Check if customer or commercial data is selected and available
  const isDataAvailable = !!(formData.selectedCustomer || formData.selectedSkus.length > 0);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[14px] p-[20px] space-y-4 shadow-xs text-slate-800 h-full flex flex-col justify-between min-h-0">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="space-y-1 pb-3 border-b border-slate-200 shrink-0">
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight leading-tight">
          Commercial Dashboard
        </h2>
        <p className="text-[12px] font-normal text-slate-500">
          Real-time commercial insights
        </p>
      </div>

      {/* ── METRIC PANELS (Single column list, internal scrolling if overflow) ── */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-0.5 min-h-0">

        {/* ── 1. COMMERCIAL SNAPSHOT PANEL ─────────────────────────── */}
        <div className="bg-white rounded-[14px] border border-slate-200 p-[20px] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Layers size={16} className="text-primary" />
            <h3 className="text-[14px] font-semibold text-slate-900">
              Commercial Snapshot
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Total Volume Commitment */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[13px] font-medium text-slate-500">Total Volume Commitment</span>
                <Layers size={14} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? `${metrics.totalVolume.toLocaleString()} Ltr` : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Combined contract products</p>
            </div>

            {/* Total Investment */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[13px] font-medium text-slate-500">Total Investment</span>
                <Gift size={14} className="text-violet-600 shrink-0" />
              </div>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? formatCurrency(totalInvestmentVal) : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">AR scheme &amp; sign-on bonus</p>
            </div>

            {/* Total Dollar Value */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[13px] font-medium text-slate-500">Total Dollar Value</span>
                <CircleDollarSign size={14} className="text-emerald-700 shrink-0" />
              </div>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? formatCurrency(metrics.dollarValue) : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Total contract value</p>
            </div>

            {/* Total Payouts & Incentives */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[13px] font-medium text-slate-500">Total Payouts &amp; Incentives</span>
                <Coins size={14} className="text-amber-600 shrink-0" />
              </div>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? formatCurrency(metrics.totalIncentives) : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Rebates &amp; target payouts</p>
            </div>

            {/* Average GMPL */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[13px] font-medium text-slate-500">Average GMPL</span>
                <Coins size={14} className="text-amber-600 shrink-0" />
              </div>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? `₹${metrics.averageGmpl}/Ltr` : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Weighted margin per litre</p>
            </div>

            {/* Free of Cost (FOC) */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[13px] font-medium text-slate-500">Free of Cost (FOC)</span>
                <Package size={14} className="text-sky-600 shrink-0" />
              </div>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? formatCurrency(metrics.focValue) : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Bonus product value</p>
            </div>
          </div>
        </div>

        {/* ── 2. PROFITABILITY PANEL ───────────────────────────────── */}
        <div className="bg-white rounded-[14px] border border-slate-200 p-[20px] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Percent size={16} className="text-emerald-600" />
            <h3 className="text-[14px] font-semibold text-slate-900">
              Profitability
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* DOFA */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[13px] font-medium text-slate-500 block">DOFA</span>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? `Level ${metrics.dofaLevel}` : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Threshold required</p>
            </div>

            {/* GMPL % */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[13px] font-medium text-slate-500 block">GMPL %</span>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? `${metrics.gmplPct}%` : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Gross profit margin</p>
            </div>

            {/* ROI (future ready) */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[13px] font-medium text-slate-500 block">ROI (Future Ready)</span>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? (metrics.gmplPct >= 20 ? "24.5%" : "18.2%") : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Estimated return on investment</p>
            </div>

            {/* Break-even Volume (future ready) */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[13px] font-medium text-slate-500 block">Break-even Volume</span>
              <p className="text-[24px] font-bold text-slate-900 leading-none">
                {isDataAvailable ? `${Math.round(metrics.totalVolume * 0.82).toLocaleString()} Ltr` : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Threshold volume to break even</p>
            </div>
          </div>
        </div>

        {/* ── 3. APPROVAL PANEL ────────────────────────────────────── */}
        <div className="bg-white rounded-[14px] border border-slate-200 p-[20px] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Award size={16} className="text-amber-500" />
            <h3 className="text-[14px] font-semibold text-slate-900">
              Approval
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* DOFA Level */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[13px] font-medium text-slate-500 block">DOFA Level</span>
              <div className="flex items-center gap-2 mt-1">
                {isDataAvailable ? (
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${dofaBadgeColor}`}>
                    Level {metrics.dofaLevel}
                  </span>
                ) : (
                  <span className="text-[24px] font-bold text-slate-900 leading-none">-</span>
                )}
              </div>
              <p className="text-[12px] font-normal text-slate-500 mt-1">Approval authority required</p>
            </div>

            {/* Assigned Approver */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[13px] font-medium text-slate-500 block">Assigned Approver</span>
              <p className="text-[18px] font-bold text-slate-900 leading-snug truncate">
                {isDataAvailable && metrics.dofaApprover ? metrics.dofaApprover : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Workflow destination</p>
            </div>
          </div>
        </div>

        {/* ── 4. PROGRESS PANEL ────────────────────────────────────── */}
        <div className="bg-white rounded-[14px] border border-slate-200 p-[20px] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <CheckCircle2 size={16} className="text-primary" />
            <h3 className="text-[14px] font-semibold text-slate-900">
              Progress
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Completion % */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[13px] font-medium text-slate-500 block">Completion %</span>
              <p className="text-[24px] font-bold text-primary leading-none">
                {isDataAvailable ? `${metrics.completionPct}%` : "-"}
              </p>
              <p className="text-[12px] font-normal text-slate-500">Required fields score</p>
            </div>

            {/* Ready For Submit */}
            <div className="p-2.5 rounded-[10px] bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[13px] font-medium text-slate-500 block">Ready For Submit</span>
              <div className="flex items-center gap-1.5 mt-1">
                {!isDataAvailable ? (
                  <span className="text-[24px] font-bold text-slate-900 leading-none">-</span>
                ) : metrics.completionPct === 100 ? (
                  <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    ✓ Ready to Submit
                  </span>
                ) : (
                  <span className="text-[12px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    In Progress
                  </span>
                )}
              </div>
              <p className="text-[12px] font-normal text-slate-500 mt-1">Validation check status</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


