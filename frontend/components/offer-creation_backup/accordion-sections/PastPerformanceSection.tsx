"use client";

import React, { useEffect } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import CurrencyInput from "../ui/CurrencyInput";

interface PastPerformanceSectionProps {
  data: {
    // Volume Details (Auto-populated)
    prevOfferCommitment: number;
    prevOfferActual: number;
    months: number;
    periodFrom: string;
    periodTo: string;
    volumePM: number;
    actualPM: number;
    synthShare: number;
    synthShareActual: number;
    commitment: number;
    actual: number;

    // Investment Details
    arSeol: string;
    targetIncentive: number;
    additionalInput: number;
    signOnBonus: number;
    others: number;
    totalInvestment: number;
    rsLtrInvestment: number;
    skuLevelRebate: number;
    totalFocValue: number;
    prevGmpl: number;
    remark: string;
  };
  targetVolume: number;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

const AutoBadge = () => (
  <span className="text-[9px] font-semibold text-brand-gray bg-gray-100 border border-gray-200 px-1 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
    Auto-populated
  </span>
);

export default function PastPerformanceSection({
  data,
  targetVolume,
  errors,
  onChange,
}: PastPerformanceSectionProps) {

  // Auto calculate Total Investment & Rs/L Investment
  useEffect(() => {
    const total =
      Number(data.targetIncentive || 0) +
      Number(data.additionalInput || 0) +
      Number(data.signOnBonus || 0) +
      Number(data.others || 0);

    if (total !== data.totalInvestment) {
      onChange("totalInvestment", total);
    }

    const calculatedVolume = targetVolume || data.commitment || 1;
    const rsLtr = Number((total / calculatedVolume).toFixed(2));
    if (rsLtr !== data.rsLtrInvestment) {
      onChange("rsLtrInvestment", rsLtr);
    }
  }, [
    data.targetIncentive,
    data.additionalInput,
    data.signOnBonus,
    data.others,
    data.totalInvestment,
    data.rsLtrInvestment,
    data.commitment,
    targetVolume,
    onChange,
  ]);

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      {/* ----------------- SUBSECTION 1: VOLUME DETAILS ----------------- */}
      <div>
        <h4 className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-primary rounded-full"></span>
          Volume Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Previous Offer Commitment</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.prevOfferCommitment} suffixText="Ltr" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Previous Offer Actual</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.prevOfferActual} suffixText="Ltr" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Months</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.months} suffixText="Mo" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Period From</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.periodFrom} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Period To</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.periodTo} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Volume PM Commitment</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.volumePM} suffixText="Ltr" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Volume PM Actual</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.actualPM} suffixText="Ltr" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Synth Share Commitment</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.synthShare} suffixText="%" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Synth Share Actual</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.synthShareActual} suffixText="%" />
          </div>
        </div>
      </div>

      {/* ----------------- SUBSECTION 2: INVESTMENT DETAILS ----------------- */}
      <div>
        <h4 className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-primary rounded-full"></span>
          Investment Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Select
            label="AR / SEOL"
            options={["AR Scheme", "SEOL Fund", "Not Applicable"]}
            value={data.arSeol}
            onChange={(e) => onChange("arSeol", e.target.value)}
          />
          <CurrencyInput
            label="Target Incentive"
            placeholder="e.g. 50000"
            value={data.targetIncentive || ""}
            onChange={(e) => onChange("targetIncentive", Number(e.target.value))}
          />
          <CurrencyInput
            label="Additional Input"
            placeholder="e.g. 20000"
            value={data.additionalInput || ""}
            onChange={(e) => onChange("additionalInput", Number(e.target.value))}
          />
          <CurrencyInput
            label="Sign-On Bonus"
            placeholder="e.g. 30000"
            value={data.signOnBonus || ""}
            onChange={(e) => onChange("signOnBonus", Number(e.target.value))}
          />
          <CurrencyInput
            label="Others"
            placeholder="e.g. 10000"
            value={data.others || ""}
            onChange={(e) => onChange("others", Number(e.target.value))}
          />

          <CurrencyInput
            label="Total Investment"
            disabled
            value={data.totalInvestment}
          />
          <Input
            label="Rs/L Investment"
            type="number"
            disabled
            value={data.rsLtrInvestment}
            suffixText="₹/L"
          />

          <Input
            label="SKU Level Rebate"
            type="number"
            placeholder="e.g. 25"
            value={data.skuLevelRebate || ""}
            onChange={(e) => onChange("skuLevelRebate", Number(e.target.value))}
          />
          <CurrencyInput
            label="Total FOC Value"
            placeholder="e.g. 15000"
            value={data.totalFocValue || ""}
            onChange={(e) => onChange("totalFocValue", Number(e.target.value))}
          />
          <Input
            label="Previous GMPL"
            type="number"
            placeholder="e.g. 18.5"
            value={data.prevGmpl || ""}
            onChange={(e) => onChange("prevGmpl", Number(e.target.value))}
            suffixText="%"
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Remark"
            rows={2.5}
            placeholder="Remarks..."
            value={data.remark}
            onChange={(e) => onChange("remark", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
