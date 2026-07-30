"use client";

import React, { useEffect } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import CurrencyInput from "../ui/CurrencyInput";
import { api } from "@/lib/api";
import { useState } from "react";

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
  customerCode?: string;
  custId?: string;
  executiveCode?: string;
  customerName?: string;
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
  customerCode,
  custId,
  executiveCode,
  customerName,
}: PastPerformanceSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPreviousOffer, setHasPreviousOffer] = useState<boolean | null>(null);
  const [offerHistoryList, setOfferHistoryList] = useState<any[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string | number>("");

  const applyOfferValues = (prev: any) => {
    const custLvl = prev.customerLevelInputs || prev.historicalPackage || {};
    const currentProp = prev.currentProposed || prev.customerPerformance || {};

    const commitment = prev.previousCommitment ?? parseFloat(prev.tot_volume_commitment || prev.volumeCommitment || currentProp.volume_kl_proposed || currentProp.volume_kl_current || '0') ?? 0;
    const actual = prev.previousActual ?? parseFloat(currentProp.volume_kl_current || prev.tot_volume_commitment || '0') ?? 0;
    const investment = prev.total_investment_current ?? prev.totalInvestment ?? prev.previousInvestment ?? parseFloat(prev.totalCustLvlInput || custLvl.total_investment || custLvl.totalInvestment || currentProp.total_investment_current || currentProp.total_investment_proposed || '0') ?? 0;
    const gmplVal = prev.gmpl_current ?? prev.gmpl ?? parseFloat(prev.gmpl_dofa || custLvl.prev_gmpl || custLvl.prevGmpl || currentProp.gmpl_current || currentProp.gmpl_proposed || '0') ?? 0;
    const contractPeriod = prev.contract_tenure || prev.contractTenure || custLvl.months || '12';

    const periodFrom = prev.start_date || prev.startDate || custLvl.periodFrom || '';
    const periodTo = prev.end_date || prev.endDate || custLvl.periodTo || '';

    const targetIncentive = parseFloat(custLvl.target_incentive || custLvl.targetIncentive || investment || '0');
    const additionalInput = parseFloat(custLvl.additional_input || custLvl.additionalInput || '0');
    const signOnBonus = parseFloat(custLvl.sign_on_bonus || custLvl.signOnBonus || '0');
    const others = parseFloat(custLvl.others || '0');
    const arSeol = prev.AR_SEOL_current ? String(prev.AR_SEOL_current) : (custLvl.ar_seol || custLvl.arSeol || 'Not Applicable');
    const skuLevelRebate = parseFloat(custLvl.sku_level_rebate || custLvl.skuLevelRebate || '0');
    const totalFocValue = parseFloat(custLvl.total_foc_value || custLvl.totalFocValue || '0');
    const remark = prev.remark || custLvl.remark || custLvl.investmentRemarks || '';

    const tenureMonths = parseInt(String(contractPeriod)) || 12;
    const volPM = prev.volPerMonth || prev.volumePM || (commitment > 0 ? Math.round(commitment / tenureMonths) : 0);
    const actPM = prev.actualPM || (actual > 0 ? Math.round(actual / tenureMonths) : 0);
    const rate = prev.rs_l_investment_current ?? prev.rsLtrInvestment ?? prev.investmentRate ?? (commitment > 0 ? Number((investment / commitment).toFixed(2)) : 0);

    onChange('prevOfferCommitment', commitment);
    onChange('prevOfferActual', actual);
    onChange('commitment', commitment);
    onChange('actual', actual);
    onChange('months', tenureMonths);
    onChange('volumePM', volPM);
    onChange('actualPM', actPM);
    
    if (periodFrom) onChange('periodFrom', periodFrom);
    if (periodTo) onChange('periodTo', periodTo);
    
    onChange('targetIncentive', targetIncentive);
    onChange('additionalInput', additionalInput);
    onChange('signOnBonus', signOnBonus);
    onChange('others', others);
    onChange('arSeol', arSeol);
    onChange('skuLevelRebate', skuLevelRebate);
    onChange('totalFocValue', totalFocValue);
    onChange('totalInvestment', investment);
    onChange('rsLtrInvestment', rate);
    if (gmplVal) onChange('prevGmpl', gmplVal);
    if (remark) onChange('remark', remark);

    const prevSkus = prev.previousSkuDetails || prev.skus || prev.previousSkus || [];
    if (Array.isArray(prevSkus) && prevSkus.length > 0) {
      onChange('selectedSkus', prevSkus);
      onChange('skus', prevSkus);
    }
    console.log("[Debug - Frontend State Updated]: Form state populated with offer ID:", prev.offer_id || prev.offerId);
    console.log("[Debug - SKU Rebates Grid Populated]: Automatically loaded", prevSkus.length, "SKUs into working SKU list");
    console.log("[Debug - Historical Package Rendered]:", { targetIncentive, additionalInput, signOnBonus, others, arSeol, totalInvestment: investment, rsLtrInvestment: rate });
    console.log("[Debug - Customer Performance Rendered]:", { commitment, actual, months: tenureMonths, volumePM: volPM, actualPM: actPM, periodFrom, periodTo });
  };

  const resetOfferValues = () => {
    onChange('prevOfferCommitment', null);
    onChange('prevOfferActual', null);
    onChange('months', null);
    onChange('periodFrom', "");
    onChange('periodTo', "");
    onChange('volumePM', null);
    onChange('actualPM', null);
    onChange('synthShare', null);
    onChange('synthShareActual', null);
    onChange('totalInvestment', 0);
    onChange('targetIncentive', 0);
    onChange('prevGmpl', null);
    onChange('remark', "");
  };

  // Automatically query Previous Contract history when any customer identifier is provided
  useEffect(() => {
    const code = (customerCode || '').trim();
    const cid = (custId || '').trim();
    const exec = (executiveCode || '').trim();
    const name = (customerName || '').trim();

    if (!code && !cid && !exec && !name) return;

    setIsLoading(true);
    api.lookupPreviousOffer({
      customerCode: code || undefined,
      custId: cid || undefined,
      executiveCode: exec || undefined,
      customerName: name || undefined,
    })
      .then((res) => {
        if (res?.success && res.hasPreviousOffer) {
          setHasPreviousOffer(true);
          const history = res.offerHistory || [];
          setOfferHistoryList(history);
          if (res.previousOffer) {
            setSelectedOfferId(String(res.previousOffer.offer_id || res.previousOffer.offerId));
            applyOfferValues(res.previousOffer);
          }
        } else {
          setHasPreviousOffer(false);
          setOfferHistoryList([]);
        }
      })
      .catch((err) => {
        console.error("[PastPerformanceSection] Previous offer lookup failed:", err);
        setHasPreviousOffer(false);
      })
      .finally(() => setIsLoading(false));
  }, [customerCode, custId, executiveCode, customerName]);

  const handleSelectOffer = (offerIdStr: string) => {
    setSelectedOfferId(offerIdStr);
    const selected = offerHistoryList.find((o) => String(o.offer_id || o.offerId) === offerIdStr);
    if (selected) {
      console.log(`[Frontend Selected Offer User-Clicked]: Offer ID ${selected.offer_id || selected.offerId}`, selected);
      applyOfferValues(selected);
    }
  };

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

  const formatVal = (val: any) => (val === null || val === undefined || val === "" ? "—" : val);

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      {hasPreviousOffer === false && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-center gap-2">
          <span>No Previous Offer Found</span>
        </div>
      )}

      {hasPreviousOffer === true && offerHistoryList.length > 0 && (
        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3 bg-emerald-600 rounded-full"></span>
              Offer History ({offerHistoryList.length})
            </h4>
            <span className="text-[11px] text-emerald-700 font-medium">Select historical offer to populate screen</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-emerald-200 bg-emerald-100/60 text-emerald-900 font-semibold">
                  <th className="py-2 px-3">Select</th>
                  <th className="py-2 px-3">Offer Code</th>
                  <th className="py-2 px-3">Offer Period</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Volume</th>
                  <th className="py-2 px-3">GMPL</th>
                  <th className="py-2 px-3">Investment</th>
                  <th className="py-2 px-3">Created Date</th>
                  <th className="py-2 px-3">Latest Updated Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {offerHistoryList.map((item) => {
                  const idStr = String(item.offer_id || item.offerId);
                  const isSelected = String(selectedOfferId) === idStr;
                  const offerCode = item.offer_code || item.offerCode || `#${idStr}`;
                  const period = `${item.start_date || item.startDate || 'N/A'} - ${item.end_date || item.endDate || 'N/A'}`;
                  const status = item.offer_status || item.offerStatus || 'APP';
                  const vol = item.tot_volume_commitment || item.volumeCommitment || item.contractVolume || '0';
                  const gmpl = item.gmpl_dofa || item.gmpl || '0';
                  const inv = item.totalCustLvlInput || item.previousInvestment || '0';
                  const created = item.createdDate || item.start_date || item.startDate || '—';
                  const updated = item.latestUpdatedDate || item.end_date || item.endDate || created;

                  return (
                    <tr
                      key={idStr}
                      onClick={() => handleSelectOffer(idStr)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-emerald-50 font-semibold text-emerald-900" : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <td className="py-2 px-3">
                        <input
                          type="radio"
                          name="selected_offer_history"
                          checked={isSelected}
                          onChange={() => handleSelectOffer(idStr)}
                          className="text-primary focus:ring-primary h-3.5 w-3.5"
                        />
                      </td>
                      <td className="py-2 px-3 font-bold text-primary">{offerCode}</td>
                      <td className="py-2 px-3">{period}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
                          {status}
                        </span>
                      </td>
                      <td className="py-2 px-3">{vol} Ltr</td>
                      <td className="py-2 px-3">{gmpl}%</td>
                      <td className="py-2 px-3">₹{Number(inv).toLocaleString()}</td>
                      <td className="py-2 px-3">{created}</td>
                      <td className="py-2 px-3">{updated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
            <Input disabled readOnly value={formatVal(data.prevOfferCommitment)} suffixText={data.prevOfferCommitment ? "Ltr" : ""} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Previous Offer Actual</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={formatVal(data.prevOfferActual)} suffixText={data.prevOfferActual ? "Ltr" : ""} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Months</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={formatVal(data.months)} suffixText={data.months ? "Mo" : ""} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Period From</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={formatVal(data.periodFrom)} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Period To</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={formatVal(data.periodTo)} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Volume PM Commitment</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={formatVal(data.volumePM)} suffixText={data.volumePM ? "Ltr" : ""} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Volume PM Actual</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={formatVal(data.actualPM)} suffixText={data.actualPM ? "Ltr" : ""} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Synth Share Commitment</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={formatVal(data.synthShare)} suffixText={data.synthShare ? "%" : ""} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Synth Share Actual</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={formatVal(data.synthShareActual)} suffixText={data.synthShareActual ? "%" : ""} />
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
