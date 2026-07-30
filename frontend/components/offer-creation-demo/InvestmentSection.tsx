"use client";

import React, { useEffect } from "react";
import { FormData, YearlyPlan } from "@/lib/offer-demo/types";

interface InvestmentSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: any) => void;
}

export default function InvestmentSection({
  formData,
  errors,
  onChange,
}: InvestmentSectionProps) {
  // Execute calculations when dependent fields change
  useEffect(() => {
    // 1. Calculate End Date = Start Date + Term (months)
    if (formData.startDate && formData.investmentTerm) {
      const start = new Date(formData.startDate);
      if (!isNaN(start.getTime())) {
        start.setMonth(start.getMonth() + Number(formData.investmentTerm));
        const endStr = start.toISOString().split("T")[0];
        if (endStr !== formData.endDate) {
          onChange("endDate", endStr);
        }
      }
    }

    // 2. Calculate Total Additional Loan = Cash Loan + Equipment Loan
    const totalAdditional = Number(formData.additionalCashLoan || 0) + Number(formData.additionalEquipmentLoan || 0);
    if (totalAdditional !== formData.totalAdditionalLoan) {
      onChange("totalAdditionalLoan", totalAdditional);
    }

    // 3. Calculate Amortization Rate Per Litre = Total Additional Loan / Total Volume Commitment
    const totalVol = Number(formData.totalVolumeCommitment || 1) || 1;
    const amortRate = Number((totalAdditional / totalVol).toFixed(2));
    if (amortRate !== formData.amortizationRatePerLitre) {
      onChange("amortizationRatePerLitre", amortRate);
    }

    // 4. Manage Yearly Plans length based on term (term in months / 12)
    const targetYears = Math.max(1, Math.floor(Number(formData.investmentTerm || 12) / 12));
    if (formData.yearlyPlans.length !== targetYears) {
      const updatedPlans: YearlyPlan[] = [];
      const equalVolShare = Math.round(totalVol / targetYears);
      const equalArShare = Math.round(Number(formData.additionalCashLoan || 0) / targetYears);

      for (let i = 1; i <= targetYears; i++) {
        const existing = formData.yearlyPlans[i - 1];
        updatedPlans.push({
          year: i,
          volume: existing ? existing.volume : equalVolShare,
          monthlyVolume: existing ? existing.monthlyVolume : Number((equalVolShare / 12).toFixed(2)),
          volumePct: existing ? existing.volumePct : Math.round((1 / targetYears) * 100),
          advanceRebate: existing ? existing.advanceRebate : equalArShare,
          advanceRebatePct: existing ? existing.advanceRebatePct : Math.round((1 / targetYears) * 100),
        });
      }
      onChange("yearlyPlans", updatedPlans);
    }

    // 5. Calculate BG amount percentage of AR (Additional Cash Loan)
    const arAmt = Number(formData.additionalCashLoan || 1) || 1;
    const bgAmt = Number(formData.bgAmount || 0);
    const bgPct = Math.round((bgAmt / arAmt) * 100);
    if (bgPct !== formData.bgAmountPctOfAr) {
      onChange("bgAmountPctOfAr", bgPct);
    }

    // 6. Calculate Credit Exposure = Trading Limit + Total Additional Loan (or other calculations from PHP)
    const creditExposure = Number(formData.tradingCreditLimit || 0) + totalAdditional;
    if (creditExposure !== formData.totalCreditExposure) {
      onChange("totalCreditExposure", creditExposure);
    }
  }, [
    formData.startDate,
    formData.investmentTerm,
    formData.additionalCashLoan,
    formData.additionalEquipmentLoan,
    formData.totalVolumeCommitment,
    formData.bgAmount,
    formData.tradingCreditLimit,
  ]);

  const handleYearlyPlanChange = (index: number, field: keyof YearlyPlan, val: number) => {
    const updated = [...formData.yearlyPlans];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    if (field === "volume") {
      updated[index].monthlyVolume = Number((val / 12).toFixed(2));
      const totalCommit = Number(formData.totalVolumeCommitment || 1);
      updated[index].volumePct = Math.round((val / totalCommit) * 100);
    } else if (field === "advanceRebate") {
      const totalCashLoan = Number(formData.additionalCashLoan || 1);
      updated[index].advanceRebatePct = Math.round((val / totalCashLoan) * 100);
    }
    onChange("yearlyPlans", updated);
  };

  // Customer level inputs target incentives calculations
  const targetIncentivePerLtr = formData.totalVolumeCommitment > 0 
    ? (Number(formData.targetIncentive || 0) / formData.totalVolumeCommitment).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      {/* 1. Classification */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-gray-150">
          Investment Classification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Investment Type</label>
            <select
              value={formData.investmentType}
              onChange={(e) => onChange("investmentType", e.target.value)}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            >
              <option value="None">None</option>
              <option value="Cash Loan">Cash Loan</option>
              <option value="Equipment Loan">Equipment Loan</option>
              <option value="Trade Rebate Promotion">Trade Rebate Promotion</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Investment Rationale</label>
            <select
              value={formData.investmentRationale}
              onChange={(e) => onChange("investmentRationale", e.target.value)}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            >
              <option value="">Please Select</option>
              <option value="Asset Purchase">Asset Purchase</option>
              <option value="Volume Growth">Volume Growth</option>
              <option value="Competitor Defense">Competitor Defense</option>
              <option value="Branding & Signage">Branding & Signage</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">BP / Bank Funded</label>
            <select
              value={formData.bpBankFunded}
              onChange={(e) => onChange("bpBankFunded", e.target.value)}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            >
              <option value="BP Funded">BP Funded</option>
              <option value="Bank Funded">Bank Funded</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Planning Status</label>
            <select
              value={formData.planningStatus}
              onChange={(e) => onChange("planningStatus", e.target.value)}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            >
              <option value="">Please Select</option>
              <option value="Planned">Planned</option>
              <option value="Unplanned">Unplanned</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Investment Data */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-gray-150">
          Investment Data
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Investment Term (months)</label>
            <select
              value={formData.investmentTerm}
              onChange={(e) => onChange("investmentTerm", e.target.value)}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white font-semibold"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="36">36</option>
              <option value="48">48</option>
              <option value="60">60</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">End Date (Auto)</label>
            <input
              type="text"
              readOnly
              disabled
              value={formData.endDate}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 text-brand-gray bg-gray-50 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Existing Loan Balance (Rs)</label>
            <input
              type="number"
              value={formData.existingLoanBalance}
              onChange={(e) => onChange("existingLoanBalance", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Existing Loan Contract End Date</label>
            <input
              type="date"
              value={formData.existingLoanEndDate}
              onChange={(e) => onChange("existingLoanEndDate", e.target.value)}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Existing Loan Vol Remaining (Litres)</label>
            <input
              type="number"
              value={formData.existingLoanVolumeRemaining}
              onChange={(e) => onChange("existingLoanVolumeRemaining", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Additional Cash Loan (Rs)</label>
            <input
              type="number"
              value={formData.additionalCashLoan}
              onChange={(e) => onChange("additionalCashLoan", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Additional Equipment Loan (Rs)</label>
            <input
              type="number"
              value={formData.additionalEquipmentLoan}
              onChange={(e) => onChange("additionalEquipmentLoan", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Total Additional Loan (Auto)</label>
            <input
              type="text"
              readOnly
              disabled
              value={`₹${formData.totalAdditionalLoan.toLocaleString()}`}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 text-brand-gray bg-gray-50 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Total Trade Loan (Rs)</label>
            <input
              type="number"
              value={formData.totalTradeLoan}
              onChange={(e) => onChange("totalTradeLoan", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Total Volume Commitment (Ltr)</label>
            <input
              type="number"
              value={formData.totalVolumeCommitment}
              onChange={(e) => onChange("totalVolumeCommitment", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark bg-white font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Amortization Rate Per Litre (Auto)</label>
            <input
              type="text"
              readOnly
              disabled
              value={`₹${formData.amortizationRatePerLitre}/Ltr`}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 text-brand-gray bg-gray-50 font-bold"
            />
          </div>
        </div>
      </div>

      {/* 3. Volume Disbursement Plan Table (Matches screenshot layout exactly) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-gray-150">
          Volume Disbursement Plan
        </h4>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 text-brand-gray font-bold uppercase border-b border-gray-250">
              <tr>
                <th className="p-3 w-1/4">Year</th>
                <th className="p-3 w-1/2">Volume (Ltr)</th>
                <th className="p-3 w-1/4">% of commitment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 bg-white">
              {formData.yearlyPlans.map((plan, index) => {
                const volPct = formData.totalVolumeCommitment > 0 
                  ? Math.round((plan.volume / formData.totalVolumeCommitment) * 100)
                  : 0;
                return (
                  <tr key={plan.year} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-brand-dark">Year {plan.year}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={plan.volume}
                        onChange={(e) => handleYearlyPlanChange(index, "volume", Number(e.target.value))}
                        className="w-full max-w-[200px] rounded border border-gray-200 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-brand-dark"
                      />
                    </td>
                    <td className="p-3 text-brand-gray font-bold">{volPct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Credit Input (Matching screenshot fields exactly) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-gray-150">
          Credit Input
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Credit Term (Days)</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={formData.creditTerm}
                onChange={(e) => onChange("creditTerm", Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark"
              />
            </div>
            <span className="text-[10px] text-brand-gray font-semibold mt-1 block">Refers to Primary Customer Credit Term</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Additional Loan (Rs)</label>
            <input
              type="number"
              value={formData.additionalCashLoan + formData.additionalEquipmentLoan}
              readOnly
              disabled
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 text-brand-gray bg-gray-50 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Trading Credit Limit (Rs)</label>
            <input
              type="number"
              value={formData.tradingCreditLimit}
              onChange={(e) => onChange("tradingCreditLimit", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Existing Security (+ve) (Rs)</label>
            <input
              type="number"
              value={formData.existingSecurity}
              onChange={(e) => onChange("existingSecurity", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Additional Security Required (+ve) (Rs)</label>
            <input
              type="number"
              value={formData.additionalSecurityRequired}
              onChange={(e) => onChange("additionalSecurityRequired", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Total Credit Exposure (Auto)</label>
            <input
              type="text"
              readOnly
              disabled
              value={`₹${formData.totalCreditExposure.toLocaleString()}`}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 text-brand-gray bg-gray-50 font-bold"
            />
          </div>
        </div>
      </div>

      {/* 5. Customer Level Inputs (Matches PHP template: Target Incentive, disbursement plan sentence) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-gray-150">
          Customer Level Inputs
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Target Incentive (Rs)</label>
            <input
              type="number"
              value={formData.targetIncentive}
              onChange={(e) => onChange("targetIncentive", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">$/Ltr (Auto)</label>
            <input
              type="text"
              readOnly
              disabled
              value={`₹${targetIncentivePerLtr}/Ltr`}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 text-brand-gray bg-gray-50 font-bold"
            />
          </div>
        </div>

        {/* Disbursement plan — redesigned to green card per spec */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
          {/* Heading */}
          <p className="text-[11px] font-extrabold text-primary uppercase tracking-widest">
            Target Incentive Disbursement Schedule
          </p>

          {/* Sentence with inline editable chips */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-semibold text-brand-dark">
            <span>Upon completion of</span>

            {/* Volume chip */}
            <input
              type="number"
              value={formData.targetIncentiveDisbVol}
              onChange={(e) => onChange("targetIncentiveDisbVol", Number(e.target.value))}
              className="w-24 rounded-lg border-2 border-primary/40 bg-white px-2 py-1 text-center text-sm font-bold text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition"
            />

            <span>Ltr volume, in</span>

            {/* Months chip */}
            <input
              type="number"
              value={formData.targetIncentiveDisbMonths}
              onChange={(e) => onChange("targetIncentiveDisbMonths", Number(e.target.value))}
              className="w-16 rounded-lg border-2 border-primary/40 bg-white px-2 py-1 text-center text-sm font-bold text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition"
            />

            <span>months,</span>
            <span className="font-extrabold text-primary">₹</span>

            {/* Incentive Amount chip */}
            <input
              type="number"
              value={formData.targetIncentiveDisbAmt}
              onChange={(e) => onChange("targetIncentiveDisbAmt", Number(e.target.value))}
              className="w-28 rounded-lg border-2 border-primary/40 bg-white px-2 py-1 text-center text-sm font-bold text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition"
            />

            <span>will be disbursed.</span>
          </div>
        </div>

        {/* Total Customer Rebate & Secondary Transport Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Total Customer Rebate (Rs - Auto)</label>
            <input
              type="text"
              readOnly
              disabled
              value={`₹${(formData.targetIncentive).toLocaleString()}`}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 text-brand-gray bg-gray-50 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">Base Secondary Transport Costs / Litre (Rs)</label>
            <input
              type="number"
              step="0.01"
              value={formData.secondaryTransportCost}
              onChange={(e) => onChange("secondaryTransportCost", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-brand-dark font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
