"use client";

import React from "react";
import { FormData, PreviousOffer } from "@/lib/offer-demo/types";
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert, Award, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { calculateCommercials } from "@/lib/offer-demo/calculations";

interface ReviewSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onSubmit: () => void;
}

export default function ReviewSection({
  formData,
  errors,
  onSubmit,
}: ReviewSectionProps) {
  const metrics = calculateCommercials(formData);

  // Compute validation warnings
  const warnings: string[] = [];
  
  // 1. GST warning for CAS/CASN streams
  const isGstRequired = formData.offerStream === "CAS" || formData.offerStream === "CASN";
  if (isGstRequired && formData.selectedCustomer && !formData.selectedCustomer.gstNumber) {
    warnings.push("Customer GST number is missing, which is highly recommended for CAS/CASN streams.");
  }

  // 2. Bank Guarantee warning (if bgAmount is less than 80% of Additional Cash Loan)
  if (formData.additionalCashLoan > 0) {
    const minBg = formData.additionalCashLoan * 0.8;
    if (formData.bgAmount < minBg) {
      warnings.push(`Bank Guarantee (₹${formData.bgAmount.toLocaleString()}) covers less than 80% of the Additional Cash Loan (₹${formData.additionalCashLoan.toLocaleString()}). Recommended BG is ₹${minBg.toLocaleString()}.`);
    }
  }

  // 3. Low GMPL warning (if GMPL % is below 16%)
  if (metrics.gmplPct < 16) {
    warnings.push(`GMPL is critically low (${metrics.gmplPct}%). This offer will be routed directly to Director/Managing Director for approval.`);
  }

  // Check critical fields for ready state
  const missingFields: string[] = [];
  if (!formData.selectedCustomer) {
    missingFields.push("Customer selection is required.");
  }
  if (formData.selectedSkus.length === 0) {
    missingFields.push("At least one SKU must be added to the offer package.");
  }
  if (!formData.whyInvest.trim()) {
    missingFields.push("Investment justification ('Why Invest') is required.");
  }
  if (!formData.risksToVolume.trim()) {
    missingFields.push("Volume risk assessment is required.");
  }
  if (!formData.mitigationToRisk.trim()) {
    missingFields.push("Mitigation action is required.");
  }

  const isReady = missingFields.length === 0 && Object.keys(errors).length === 0;

  // ── Previous vs Current comparison ────────────────────────────────────────
  const prevData = formData.previousOfferState?.data ?? (formData.previousOffer?.found ? (formData.previousOffer as PreviousOffer) : null);
  const hasPrev = !!prevData;
  const prev = prevData;

  const comparisonRows = [
    {
      label: "Contract Volume",
      prev: prev ? `${(Number(prev.volumeCommitment) || 0).toLocaleString()} L` : "—",
      current: `${(Number(formData.totalVolumeCommitment) || 0).toLocaleString()} L`,
      prevNum: prev?.volumeCommitment ?? 0,
      currNum: formData.totalVolumeCommitment,
    },
    {
      label: "Total Investment",
      prev: prev ? `₹${(Number(prev.totalGrossMargin) || 0).toLocaleString()}` : "—",
      current: `₹${(Number(formData.totalAdditionalLoan + formData.targetIncentive) || 0).toLocaleString()}`,
      prevNum: prev?.totalGrossMargin ?? 0,
      currNum: formData.totalAdditionalLoan + formData.targetIncentive,
    },
    {
      label: "Cust. Level Input",
      prev: prev ? `₹${(Number(prev.totalCustLvlInput) || 0).toLocaleString()}` : "—",
      current: `₹${(Number(formData.additionalCashLoan) || 0).toLocaleString()}`,
      prevNum: prev?.totalCustLvlInput ?? 0,
      currNum: formData.additionalCashLoan,
    },
    {
      label: "GMPL %",
      prev: prev?.gmplDofa ? prev.gmplDofa : "—",
      current: `${metrics.gmplPct}%`,
      prevNum: 0,
      currNum: metrics.gmplPct,
    },
    {
      label: "Offer Code",
      prev: prev?.offerCode ?? "—",
      current: "(New Offer)",
      prevNum: 0,
      currNum: 0,
    },
    {
      label: "Status",
      prev: prev?.offerStatus ?? "—",
      current: "DRAFT",
      prevNum: 0,
      currNum: 0,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* DOFA Level info */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3 shadow-sm">
          <Award className="text-primary shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wide">Approval Authority Level</p>
            <p className="text-base font-black text-brand-dark mt-1">
              DOFA Level {metrics.dofaLevel}
            </p>
            <p className="text-[11px] text-brand-gray font-medium mt-0.5">
              Assigned Approver: <strong className="text-brand-dark">{metrics.dofaApprover}</strong>
            </p>
          </div>
        </div>

        {/* Completion status */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4 flex gap-3 shadow-sm">
          {isReady ? (
            <CheckCircle className="text-sky-600 shrink-0 mt-0.5" size={20} />
          ) : (
            <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
          )}
          <div>
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wide">Validation Progress</p>
            <p className="text-base font-black text-brand-dark mt-1">
              {metrics.completionPct}% Complete
            </p>
            <p className="text-[11px] text-brand-gray font-medium mt-0.5">
              {isReady ? "All required fields completed" : `${missingFields.length} critical requirements remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Previous vs Current Offer Comparison ─────────────────────────── */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-700 px-4 py-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-white" />
          <h5 className="text-[11px] font-extrabold text-white uppercase tracking-wider">
            Previous vs Current Offer Comparison
          </h5>
          {hasPrev && (
            <span className="ml-auto text-[9px] font-bold text-white/60 bg-white/10 border border-white/20 px-2 py-0.5 rounded-full">
              Source: odt_offer_details
            </span>
          )}
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Metric</th>
              <th className="p-3 text-center text-[10px] font-bold text-orange-600 uppercase tracking-wider">Previous Offer</th>
              <th className="p-3 text-center text-[10px] font-bold text-primary uppercase tracking-wider">Current (Draft)</th>
              <th className="p-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {comparisonRows.map((row, idx) => {
              const diff =
                row.prevNum > 0
                  ? Number((((row.currNum - row.prevNum) / row.prevNum) * 100).toFixed(1))
                  : null;
              return (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-700">{row.label}</td>
                  <td className={`p-3 text-center font-semibold ${hasPrev ? "text-orange-700" : "text-slate-300 italic"}`}>
                    {row.prev}
                  </td>
                  <td className="p-3 text-center font-extrabold text-slate-800">{row.current}</td>
                  <td className="p-3 text-center">
                    {diff === null ? (
                      <span className="text-slate-300">—</span>
                    ) : diff > 0 ? (
                      <span className="flex items-center justify-center gap-0.5 text-emerald-600 font-extrabold">
                        <TrendingUp size={10} /> +{diff}%
                      </span>
                    ) : diff < 0 ? (
                      <span className="flex items-center justify-center gap-0.5 text-red-500 font-extrabold">
                        <TrendingDown size={10} /> {diff}%
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-0.5 text-slate-400 font-bold">
                        <Minus size={10} /> 0%
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Missing information box */}
      {missingFields.length > 0 && (
        <div className="border border-red-200 bg-red-50/40 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert size={16} />
            <h5 className="text-xs font-bold uppercase tracking-wider">Required Information Missing</h5>
          </div>
          <ul className="list-disc pl-5 text-[11px] font-semibold text-red-600/90 space-y-1">
            {missingFields.map((field, idx) => (
              <li key={idx}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings box */}
      {warnings.length > 0 && (
        <div className="border border-orange-200 bg-orange-50/45 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-orange-600">
            <AlertTriangle size={16} />
            <h5 className="text-xs font-bold uppercase tracking-wider">Compliance Warnings &amp; Guidance</h5>
          </div>
          <ul className="list-disc pl-5 text-[11px] font-semibold text-orange-600/90 space-y-1">
            {warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success notification */}
      {isReady && warnings.length === 0 && (
        <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 flex items-start gap-2.5 text-primary">
          <CheckCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider">Ready for Submission</h5>
            <p className="text-[11px] mt-0.5 text-primary/90 font-medium">
              All commercial thresholds, credit limits, and qualitative parameters comply fully with Castrol B2B operations policy.
            </p>
          </div>
        </div>
      )}

      {/* Submission Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isReady}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-bold py-3 px-4 rounded-xl transition shadow-md"
        >
          Submit Offer for Review
        </button>
      </div>
    </div>
  );
}
