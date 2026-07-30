"use client";

import React from "react";
import { FormData, PreviousOffer } from "@/lib/offer-demo/types";
import { calculateCommercials } from "@/lib/offer-demo/calculations";
import { FileText, Loader2, AlertCircle } from "lucide-react";

interface PerformanceComparisonProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  errors: Record<string, string>;
  previousOfferLoading?: boolean;
}

export default function PerformanceComparison({
  formData,
  onChange,
  errors,
  previousOfferLoading = false,
}: PerformanceComparisonProps) {
  console.log("Performance previousOffer", formData.previousOffer);
  const metrics = calculateCommercials(formData);

  // ── Normalized Previous Contract State (Read-Only) ───────────────────────
  const state = formData.previousOfferState;
  const status = state?.status ?? (formData.previousOffer?.found ? 'loaded' : previousOfferLoading ? 'loading' : 'not_found');
  const prevData = state?.data ?? (formData.previousOffer?.found ? (formData.previousOffer as PreviousOffer) : null);

  const isLoading = status === 'loading' || previousOfferLoading;
  const hasPrev = status === 'loaded' && !!prevData;
  const prev = hasPrev ? (prevData as PreviousOffer) : null;

  const prevContract = {
    volume: prev?.volumeCommitment ?? 0,
    duration: prev?.contractTenure ? Number(prev.contractTenure) : 12,
    volPerMonth:
      prev && prev.volumeCommitment && prev.contractTenure
        ? Math.round(prev.volumeCommitment / Number(prev.contractTenure))
        : 0,
    arSeol: prev?.AR_SEOL_current ?? prev?.arSeol ?? prev?.totalCustLvlInput ?? 0,
    targetIncentive: 0, // not separately stored in offer_details
    totalInvestment: prev?.total_investment_current ?? prev?.totalInvestment ?? prev?.investment ?? 0,
    investmentRate: prev?.rs_l_investment_current ?? prev?.rsLtrInvestment ?? prev?.investmentRate ?? 0,
    gmpl: prev?.gmpl_current ?? prev?.gmpl ?? 0,
  };

  // Proposed (current form data — unchanged calculation)
  const proposedContract = {
    volume: formData.totalVolumeCommitment,
    duration: Number(formData.investmentTerm || 12),
    volPerMonth: Math.round(
      formData.totalVolumeCommitment / Number(formData.investmentTerm || 12)
    ),
    arSeol: formData.additionalCashLoan,
    targetIncentive: formData.targetIncentive,
    totalInvestment: formData.totalAdditionalLoan + formData.targetIncentive,
    investmentRate:
      formData.totalVolumeCommitment > 0
        ? Number(
            (
              (formData.totalAdditionalLoan + formData.targetIncentive) /
              formData.totalVolumeCommitment
            ).toFixed(2)
          )
        : 0,
    gmpl: metrics.gmplPct,
  };

  const calculateVariance = (current: number, previous: number) => {
    if (previous === 0) return null;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const renderVariance = (val: number | null) => {
    if (val === null)
      return <span className="text-gray-400 font-semibold">--</span>;
    if (val > 0)
      return <span className="text-emerald-600 font-extrabold">+{val}%</span>;
    if (val < 0)
      return <span className="text-red-500 font-extrabold">{val}%</span>;
    return <span className="text-gray-400 font-bold">0.0%</span>;
  };

  const rows = [
    {
      label: "Contract Volume (Ltrs)",
      prev: prevContract.volume,
      prop: proposedContract.volume,
      variance: calculateVariance(proposedContract.volume, prevContract.volume),
      format: (v: number) => `${v.toLocaleString()} L`,
    },
    {
      label: "Duration (Months)",
      prev: prevContract.duration,
      prop: proposedContract.duration,
      variance: calculateVariance(
        proposedContract.duration,
        prevContract.duration
      ),
      format: (v: number) => `${v} M`,
    },
    {
      label: "Volume Ltrs / Month",
      prev: prevContract.volPerMonth,
      prop: proposedContract.volPerMonth,
      variance: calculateVariance(
        proposedContract.volPerMonth,
        prevContract.volPerMonth
      ),
      format: (v: number) => `${v.toLocaleString()} L/M`,
    },
    {
      label: "AR / SEOL Investment",
      prev: prevContract.arSeol,
      prop: proposedContract.arSeol,
      variance: calculateVariance(proposedContract.arSeol, prevContract.arSeol),
      format: (v: number) => `₹${v.toLocaleString()}`,
    },
    {
      label: "Total Investment",
      prev: prevContract.totalInvestment,
      prop: proposedContract.totalInvestment,
      variance: calculateVariance(
        proposedContract.totalInvestment,
        prevContract.totalInvestment
      ),
      format: (v: number) => `₹${v.toLocaleString()}`,
    },
    {
      label: "Investment Rate (Rs./Ltr)",
      prev: prevContract.investmentRate,
      prop: proposedContract.investmentRate,
      variance: calculateVariance(
        proposedContract.investmentRate,
        prevContract.investmentRate
      ),
      format: (v: number) => `₹${v}/L`,
    },
    {
      label: "Weighted GMPL (Margin %)",
      prev: prevContract.gmpl,
      prop: proposedContract.gmpl,
      variance: calculateVariance(proposedContract.gmpl, prevContract.gmpl),
      format: (v: number) => `${v}%`,
    },
  ];

  return (
    <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 pb-2.5 border-b border-gray-150">
        <h4 className="text-xs font-black text-brand-dark uppercase tracking-wider">
          Performance &amp; Investment Comparison
        </h4>

        {isLoading ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full">
            <Loader2 size={10} className="animate-spin" />
            Loading previous offer…
          </span>
        ) : hasPrev ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold border px-3 py-1 rounded-full uppercase tracking-wide border-orange-200 bg-orange-50 text-orange-600">
            <FileText size={10} />
            Prev: {prev!.offerCode}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[10px] font-bold border px-3 py-1 rounded-full uppercase tracking-wide border-gray-200 bg-gray-50 text-brand-gray">
            <AlertCircle size={10} />
            No Previous Offer Found
          </span>
        )}
      </div>

      {/* No previous offer banner */}
      {!isLoading && !hasPrev && formData.selectedCustomer && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-semibold">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold">No Previous Offer Found</span> —
            &nbsp;{formData.selectedCustomer.name} has no prior contract in the
            offer database. Previous column shows zero values.
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200 select-none text-[10px] text-brand-gray uppercase font-bold">
            <tr>
              <th className="p-3.5 w-1/3">Metric Details</th>
              <th className="p-3.5 text-center w-2/9">
                Previous Contract
                {hasPrev && (
                  <div className="text-[8px] font-normal text-orange-500 normal-case mt-0.5">
                    {prev!.startDate} → {prev!.endDate}
                  </div>
                )}
              </th>
              <th className="p-3.5 text-center w-2/9">Proposed Offer</th>
              <th className="p-3.5 text-center w-2/9">Variance (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150 bg-white">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50/50 transition odd:bg-white even:bg-gray-50/10"
              >
                <td className="p-3.5 font-bold text-brand-dark">{row.label}</td>
                <td
                  className={`p-3.5 text-center font-semibold ${hasPrev ? "text-brand-gray" : "text-gray-300 italic"}`}
                >
                  {hasPrev ? row.format(row.prev) : "—"}
                </td>
                <td className="p-3.5 text-center font-extrabold text-brand-dark">
                  {row.format(row.prop)}
                </td>
                <td className="p-3.5 text-center font-bold">
                  {hasPrev ? renderVariance(row.variance) : <span className="text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="block md:hidden space-y-3">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs space-y-2"
          >
            <h5 className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
              {row.label}
            </h5>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <span className="text-[9px] text-brand-gray block font-medium mb-0.5">
                  PREVIOUS
                </span>
                <span className={`font-semibold ${hasPrev ? "text-brand-gray" : "text-gray-300 italic"}`}>
                  {hasPrev ? row.format(row.prev) : "—"}
                </span>
              </div>
              <div className="bg-emerald-50/30 p-2 rounded border border-emerald-100/50">
                <span className="text-[9px] text-primary block font-bold mb-0.5">
                  PROPOSED
                </span>
                <span className="font-extrabold text-brand-dark">
                  {row.format(row.prop)}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-[9px] text-brand-gray block font-medium mb-0.5">
                  VARIANCE
                </span>
                <span className="font-bold">
                  {hasPrev ? renderVariance(row.variance) : <span className="text-gray-300">—</span>}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Previous SKU Details & Historical Package Info ─────────────────────────── */}
      {hasPrev && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={12} className="text-orange-600" />
              Previous SKU Details &amp; Historical Package
            </h5>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {((prev as any)?.previousSkuDetails || (prev as any)?.skus || (prev as any)?.previousSkus || (prev as any)?.data?.skus || (prev as any)?.data?.previousSkus || []).length} SKUs Transferred to Working Grid
            </span>
          </div>
          <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Previous contract SKUs deserialized from <code className="font-bold bg-emerald-100 px-1 rounded">sku_text</code> are loaded into the single <strong>SKU Rebates &amp; Target Incentives</strong> table below.</span>
          </div>
        </div>
      )}

      {/* Investment Remarks */}
      <div className="space-y-2 pt-2">
        <h5 className="text-[11px] font-black text-brand-dark uppercase tracking-wider">
          Investment Remarks
        </h5>
        <textarea
          rows={3}
          value={formData.remark}
          onChange={(e) => onChange("remark", e.target.value)}
          placeholder="Comment on variance, investment reasons, and historical performance"
          className="w-full rounded-xl border border-gray-200 text-xs px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-primary text-brand-dark bg-white font-medium placeholder:text-gray-400 shadow-xs"
        />
      </div>
    </div>
  );
}
