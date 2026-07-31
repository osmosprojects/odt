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
  customerOfferHistory?: any;
}

const getYearRange = (start?: string | null, end?: string | null) => {
  if (!start && !end) return "";
  const sDate = start ? new Date(start) : null;
  const eDate = end ? new Date(end) : null;
  const sYear = sDate && !isNaN(sDate.getTime()) ? sDate.getFullYear() : null;
  const eYear = eDate && !isNaN(eDate.getTime()) ? eDate.getFullYear() : null;
  if (sYear && eYear) return `${sYear}–${eYear}`;
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
};

const findActiveOffer = (customerOfferHistory?: any, prevData?: any) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const checkIsActive = (o: any) => {
    if (!o) return false;
    const startStr = o.startDate || o.start_date;
    const endStr = o.endDate || o.end_date || o.effectiveEndDate || o.effective_end_date;

    if (startStr && endStr) {
      const s = new Date(startStr);
      const e = new Date(endStr);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const sDay = new Date(s.getFullYear(), s.getMonth(), s.getDate());
        const eDay = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59);
        return sDay <= todayStart && eDay >= todayStart;
      }
    }

    const status = String(o.status || o.offerStatus || o.offer_status || '').toUpperCase();
    if (['ACTIVE', 'APP', 'APPROVED'].includes(status)) {
      if (!startStr || !endStr) return true;
    }
    return false;
  };

  // 1. Check customerOfferHistory.activeOffers
  if (customerOfferHistory?.activeOffers && Array.isArray(customerOfferHistory.activeOffers) && customerOfferHistory.activeOffers.length > 0) {
    const match = customerOfferHistory.activeOffers.find(checkIsActive);
    if (match) return match;
    return customerOfferHistory.activeOffers[0];
  }

  // 2. Check prevData history / offerHistory
  const history = prevData?.history || (prevData as any)?.offerHistory || prevData?.previousOffers || [];
  if (Array.isArray(history) && history.length > 0) {
    const match = history.find(checkIsActive);
    if (match) return match;
  }

  // 3. Check prevData itself
  if (prevData && checkIsActive(prevData)) {
    return prevData;
  }

  return null;
};

export default function PerformanceComparison({
  formData,
  onChange,
  errors,
  previousOfferLoading = false,
  customerOfferHistory,
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

  // ── Active Current Offer (if customer has an active offer) ────────────────
  const activeOffer = findActiveOffer(customerOfferHistory, prevData);
  const hasCurrentOffer = !!activeOffer;

  const currentContract = hasCurrentOffer ? (() => {
    const matchId = String(activeOffer.offerId || activeOffer.offer_id || '');
    const matchCode = String(activeOffer.offerCode || activeOffer.offer_code || '');
    const historyList = (prevData?.history || (prevData as any)?.offerHistory || []) as any[];
    const detailed = historyList.find(
      (item: any) =>
        (matchId && String(item.offerId || item.offer_id) === matchId) ||
        (matchCode && String(item.offerCode || item.offer_code) === matchCode)
    ) || activeOffer;

    const volume = Number(
      detailed.volume_kl_current ??
      detailed.volumeCommitment ??
      detailed.tot_volume_commitment ??
      detailed.contractVolume ??
      detailed.volume ??
      activeOffer.volume_kl_current ??
      activeOffer.volumeCommitment ??
      activeOffer.volume ??
      0
    );

    const duration = Number(
      detailed.months_current ??
      detailed.contractTenure ??
      detailed.contract_tenure ??
      detailed.tenure ??
      detailed.months ??
      activeOffer.months_current ??
      activeOffer.tenure ??
      12
    );

    const klPmCurrent = Number(detailed.kl_pm_current ?? activeOffer.kl_pm_current ?? 0);
    const volPerMonth = klPmCurrent > 0 ? Math.round(klPmCurrent) : (duration > 0 ? Math.round(volume / duration) : 0);

    const arSeol = Number(
      detailed.AR_SEOL_current ??
      detailed.ar_seol_current ??
      detailed.arSeol ??
      detailed.ar_seol ??
      detailed.totalCustLvlInput ??
      activeOffer.AR_SEOL_current ??
      activeOffer.arSeol ??
      0
    );

    const totalInvestment = Number(
      detailed.total_investment_current ??
      detailed.totalInvestment ??
      detailed.investment ??
      detailed.previousInvestment ??
      detailed.totalCustLvlInput ??
      activeOffer.total_investment_current ??
      activeOffer.investment ??
      activeOffer.grossMargin ??
      0
    );

    const investmentRate =
      detailed.rs_l_investment_current ??
      detailed.rsLtrInvestment ??
      detailed.investmentRate ??
      activeOffer.rs_l_investment_current ??
      (volume > 0 ? Number((totalInvestment / volume).toFixed(2)) : 0);

    const gmpl = Number(
      detailed.gmpl_current ??
      detailed.gmpl ??
      detailed.gmplDofa ??
      detailed.gmpl_dofa ??
      detailed.grossMargin ??
      activeOffer.gmpl_current ??
      activeOffer.grossMargin ??
      0
    );

    const startDate = detailed.startDate || detailed.start_date || activeOffer.startDate || activeOffer.start_date;
    const endDate = detailed.endDate || detailed.end_date || activeOffer.endDate || activeOffer.end_date;
    const periodText = startDate && endDate ? `${startDate} → ${endDate}` : getYearRange(startDate, endDate);

    return {
      offerCode: detailed.offerCode || detailed.offer_code || activeOffer.offerCode || activeOffer.offer_code,
      startDate,
      endDate,
      periodText,
      volume,
      duration,
      volPerMonth,
      arSeol,
      totalInvestment,
      investmentRate,
      gmpl,
    };
  })() : null;

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
      current: currentContract?.volume ?? 0,
      prop: proposedContract.volume,
      variance: calculateVariance(proposedContract.volume, prevContract.volume),
      format: (v: number) => `${v.toLocaleString()} L`,
    },
    {
      label: "Duration (Months)",
      prev: prevContract.duration,
      current: currentContract?.duration ?? 0,
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
      current: currentContract?.volPerMonth ?? 0,
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
      current: currentContract?.arSeol ?? 0,
      prop: proposedContract.arSeol,
      variance: calculateVariance(proposedContract.arSeol, prevContract.arSeol),
      format: (v: number) => `₹${v.toLocaleString()}`,
    },
    {
      label: "Total Investment",
      prev: prevContract.totalInvestment,
      current: currentContract?.totalInvestment ?? 0,
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
      current: currentContract?.investmentRate ?? 0,
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
      current: currentContract?.gmpl ?? 0,
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

        <div className="flex items-center gap-2">
          {hasCurrentOffer && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold border px-3 py-1 rounded-full uppercase tracking-wide border-emerald-300 bg-emerald-50 text-emerald-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Offer: {currentContract?.offerCode}
            </span>
          )}

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

      {/* Desktop & Tablet Table (with responsive scroll container) */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-xs overflow-x-auto">
        <table className={`w-full text-left border-collapse text-xs ${hasCurrentOffer ? "min-w-[650px]" : "table-fixed"}`}>
          <thead className="bg-gray-50 border-b border-gray-200 select-none text-[10px] text-brand-gray uppercase font-bold">
            <tr>
              <th className={`p-3.5 ${hasCurrentOffer ? "w-1/4" : "w-1/3"}`}>Metric Details</th>
              <th className={`p-3.5 text-center ${hasCurrentOffer ? "w-1/5" : "w-2/9"}`}>
                Previous Contract
                {hasPrev && (
                  <div className="text-[8px] font-normal text-orange-500 normal-case mt-0.5">
                    {prev!.startDate} → {prev!.endDate}
                  </div>
                )}
              </th>

              {/* Current Offer Column (Renders only when active offer exists) */}
              {hasCurrentOffer && (
                <th className="p-3.5 text-center bg-emerald-50/60 border-x border-emerald-200/80 w-1/5">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-emerald-900 font-extrabold">Current Offer</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                    {currentContract?.periodText && (
                      <div className="text-[9px] font-bold text-emerald-700 normal-case mt-0.5">
                        {currentContract.periodText}
                      </div>
                    )}
                  </div>
                </th>
              )}

              <th className={`p-3.5 text-center ${hasCurrentOffer ? "w-1/5" : "w-2/9"}`}>Proposed Offer</th>
              <th className={`p-3.5 text-center ${hasCurrentOffer ? "w-1/5" : "w-2/9"}`}>Variance (%)</th>
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

                {/* Current Offer Value Cell */}
                {hasCurrentOffer && (
                  <td className="p-3.5 text-center font-extrabold text-emerald-900 bg-emerald-50/20 border-x border-emerald-100/70">
                    {row.format(row.current)}
                  </td>
                )}

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
            <div className={`grid ${hasCurrentOffer ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"} gap-2 text-center text-xs`}>
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <span className="text-[9px] text-brand-gray block font-medium mb-0.5">
                  PREVIOUS
                </span>
                <span className={`font-semibold ${hasPrev ? "text-brand-gray" : "text-gray-300 italic"}`}>
                  {hasPrev ? row.format(row.prev) : "—"}
                </span>
              </div>

              {hasCurrentOffer && (
                <div className="bg-emerald-50/60 p-2 rounded border border-emerald-200">
                  <span className="text-[9px] text-emerald-800 block font-bold mb-0.5 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    CURRENT
                  </span>
                  <span className="font-bold text-emerald-900">
                    {row.format(row.current)}
                  </span>
                </div>
              )}

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
