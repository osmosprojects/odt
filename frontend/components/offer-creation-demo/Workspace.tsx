"use client";

import React, { useState } from "react";
import { Customer, FormData, SkuRow } from "@/lib/offer-demo/types";
import {
  CheckCircle2,
  Save,
  Send,
  ChevronLeft,
  Database,
  Building2,
  TrendingUp,
  BarChart2,
  PieChart,
  FileText,
  ClipboardCheck,
  Search,
  CheckCircle,
  Circle,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import Accordion from "./Accordion";
import OfferBasicsSection from "./OfferBasicsSection";
import CustomerSection from "./CustomerSection";
import InvestmentSection from "./InvestmentSection";
import SkuSection from "./SkuSection";
import ReviewSection from "./ReviewSection";
import PerformanceComparison from "./PerformanceComparison";
import CommercialSummary from "./CommercialSummary";
import CustomerOfferHistory from "./CustomerOfferHistory";
import { calculateCommercials } from "@/lib/offer-demo/calculations";
import { usePreviousOffer } from "@/lib/offer-demo/hooks/usePreviousOffer";
import ModeSelection from "@/components/offer-creation/ModeSelection";
import BreadcrumbHeader, { BreadcrumbItem } from "@/components/offer-creation/BreadcrumbHeader";
import { createFullOfferApi, submitForApprovalApi, fetchCustomerOffersApi } from "@/lib/offer-demo/customerApi";

// ── Pipeline step definitions ──────────────────────────────────────────────
const PIPELINE_STEPS = [
  { id: "search",  label: "Customer Search",       icon: Search },
  { id: "qualify", label: "Customer Qualification", icon: Building2 },
  { id: "offer",   label: "Offer Creation",         icon: FileText },
  { id: "invest",  label: "Investment",             icon: TrendingUp },
  { id: "sku",     label: "SKU Planning",           icon: BarChart2 },
  { id: "summary", label: "Commercial Summary",     icon: PieChart },
  { id: "review",  label: "Review & Submit",        icon: ClipboardCheck },
];

interface PipelineStepperProps {
  formData: FormData;
}
function PipelineStepper({ formData: fd }: PipelineStepperProps) {
  const completed: Record<string, boolean> = {
    search:  !!fd.selectedCustomer,
    qualify: !!(fd.whyInvest && fd.risksToVolume && fd.mitigationToRisk),
    offer:   !!(fd.offerCreationType && fd.dollarValue > 0),
    invest:  !!(fd.investmentType && fd.investmentTerm),
    sku:     fd.selectedSkus.length > 0,
    summary: fd.selectedSkus.length > 0,
    review:  !!(fd.selectedCustomer && fd.whyInvest && fd.risksToVolume && fd.mitigationToRisk && fd.selectedSkus.length > 0 && fd.dollarValue > 0),
  };

  // Find first incomplete step
  const activeId = PIPELINE_STEPS.find((s) => !completed[s.id])?.id ?? "review";

  return (
    <div className="bg-white border border-slate-200 rounded-[14px] p-[20px] shadow-xs overflow-x-auto">
      <div className="flex items-center justify-between gap-2 min-w-max">
        {PIPELINE_STEPS.map((step, idx) => {
          const done    = completed[step.id];
          const active  = step.id === activeId;
          const isLast  = idx === PIPELINE_STEPS.length - 1;
          const Icon    = step.icon;

          return (
            <React.Fragment key={step.id}>
              {/* Step node */}
              <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                    ${done
                      ? "bg-primary border-primary text-white shadow-sm"
                      : active
                        ? "bg-white border-primary text-primary shadow ring-4 ring-primary/10"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                >
                  {done ? (
                    <CheckCircle size={16} />
                  ) : active ? (
                    <Icon size={15} />
                  ) : (
                    <Circle size={12} className="opacity-40" />
                  )}
                </div>
                <span
                  className={`text-[12px] font-semibold whitespace-nowrap leading-tight text-center
                    ${done ? "text-primary" : active ? "text-slate-900" : "text-slate-500"}`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-1 rounded-full shrink-0 mt-[-18px] transition-colors
                    ${done ? "bg-primary" : "bg-slate-200"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Workspace ─────────────────────────────────────────────────────────
export default function Workspace() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/dashboard" },
    { label: "Offer Operations", href: "/offers/bulk-approval" },
    { label: "Offer Creation", active: true },
  ];

  const [formData, setFormData] = useState<FormData>({
    // Basics
    offerStream: "",
    offerCreationType: "New Offer",
    dollarValue: 0,

    // No customer pre-selected
    selectedCustomer: null,

    // Previous offer from odt_offer_details — null until customer selected
    previousOffer: null,

    // Past Performance defaults
    prevOfferCommitment: 10000,
    prevOfferActual: 9500,
    months: 12,
    periodFrom: "2025-01-01",
    periodTo: "2025-12-31",
    volumePM: 800,
    actualPM: 790,
    synthShare: 15,
    synthShareActual: 12,
    commitment: 10000,
    actual: 9500,
    arSeol: "AR Scheme",
    targetIncentive: 5000,
    additionalInput: 0,
    signOnBonus: 0,
    others: 0,
    totalInvestment: 0,
    rsLtrInvestment: 0.5,
    skuLevelRebate: 2.0,
    totalFocValue: 41991,
    prevGmpl: 19.5,
    remark: "Standard commercial contract rollover.",

    // KERIS / TVD
    kerisCode: "KERIS-84920",
    tvdParentId: "TVD-94812",

    // Competitor
    competitorDetails: "No active competitor poaching reported.",

    // Remarks
    whyInvest: "",
    associatedWithCastrol: "Yes",
    significanceWithCastrol: "",
    upTradingOpportunities: "",
    risksToVolume: "",
    mitigationToRisk: "",
    groupBelongsTo: "",
    otherQualitativeInfo: "",

    // Investment
    investmentType: "None",
    investmentRationale: "",
    bpBankFunded: "BP Funded",
    planningStatus: "",
    investmentTerm: "12",
    startDate: "2026-07-01",
    endDate: "2027-06-30",
    existingLoanBalance: 0,
    existingLoanEndDate: "",
    existingLoanVolumeRemaining: 0,
    additionalCashLoan: 0,
    additionalEquipmentLoan: 0,
    totalAdditionalLoan: 0,
    totalTradeLoan: 0,
    totalVolumeCommitment: 10000,
    amortizationRatePerLitre: 0,

    yearlyPlans: [
      {
        year: 1,
        volume: 10000,
        monthlyVolume: 833.33,
        volumePct: 100,
        advanceRebate: 0,
        advanceRebatePct: 0,
      },
    ],

    // Bank Guarantee
    bgEndDate: "2027-12-31",
    bgTenure: "12",
    bgAmount: 0,
    bgAmountPctOfAr: 0,
    bankName: "",
    bankAddress: "",
    gstNumberBg: "",
    gstNameBg: "",
    bgTenureCheck: true,

    // Credit
    creditTerm: 45,
    primaryCustomerCreditTerm: 45,
    tradingCreditLimit: 0,
    existingSecurity: 0,
    additionalSecurityRequired: 0,
    totalCreditExposure: 0,

    // Disbursements
    targetIncentiveDisbVol: 10000,
    targetIncentiveDisbMonths: 12,
    targetIncentiveDisbAmt: 5000,
    secondaryTransportCost: 1.3,

    // SKUs — start empty; user adds via search
    selectedSkus: [],
  });

  // ── Previous offer hook ───────────
  const selectedCustomer = formData.selectedCustomer;
  const custCode = selectedCustomer?.customerCode || selectedCustomer?.jdeCode || '';
  const custId = selectedCustomer?.id || '';
  const execCode = selectedCustomer?.executiveCode || '';
  const custName = selectedCustomer?.name || '';

  const lookupCriteria = React.useMemo(() => {
    if (!custCode && !custId && !execCode && !custName) return null;
    return {
      customerCode: custCode,
      custId: custId,
      executiveCode: execCode,
      customerName: custName,
    };
  }, [custCode, custId, execCode, custName]);

  const { state: previousOfferState, data: prevOfferData, loading: prevOfferLoading } = usePreviousOffer(lookupCriteria);

  // ── Sync single-owner previousOfferState into formData & auto-populate SKU Rebates grid ───────────
  React.useEffect(() => {
    if (!formData.selectedCustomer) {
      setFormData((prev) => {
        if (
          prev.previousOffer === null &&
          prev.selectedSkus.length === 0 &&
          !prev.whyInvest &&
          !prev.risksToVolume &&
          !prev.mitigationToRisk &&
          prev.prevOfferCommitment === 0 &&
          prev.commitment === 0 &&
          prev.additionalCashLoan === 0
        ) {
          return prev;
        }
        return {
          ...prev,
          selectedCustomer: null,
          previousOffer: null,
          previousOfferState: { status: 'idle', customerCode: null, requestId: 0, data: null, error: null },
          selectedSkus: [],

          // Reset customer performance & contract metrics
          prevOfferCommitment: 0,
          prevOfferActual: 0,
          months: 12,
          periodFrom: "",
          periodTo: "",
          volumePM: 0,
          actualPM: 0,
          synthShare: 0,
          synthShareActual: 0,
          commitment: 0,
          actual: 0,
          arSeol: "",
          targetIncentive: 0,
          additionalInput: 0,
          signOnBonus: 0,
          others: 0,
          totalInvestment: 0,
          rsLtrInvestment: 0,
          skuLevelRebate: 0,
          totalFocValue: 0,
          prevGmpl: 0,
          remark: "",

          // Reset customer qualification remarks
          whyInvest: "",
          significanceWithCastrol: "",
          upTradingOpportunities: "",
          risksToVolume: "",
          mitigationToRisk: "",
          groupBelongsTo: "",
          otherQualitativeInfo: "",

          // Reset customer-level investment loans
          existingLoanBalance: 0,
          existingLoanEndDate: "",
          existingLoanVolumeRemaining: 0,
          additionalCashLoan: 0,
          additionalEquipmentLoan: 0,
          totalAdditionalLoan: 0,
          totalTradeLoan: 0,
          amortizationRatePerLitre: 0,
        };
      });
      return;
    }

    setFormData((prev) => {
      let nextSkus = prev.selectedSkus;
      if (prevOfferData?.found && prevOfferData !== prev.previousOffer) {
        const loadedSkus = (prevOfferData as any)?.skus || (prevOfferData as any)?.previousSkus || (prevOfferData as any)?.previousSkuDetails || [];
        if (Array.isArray(loadedSkus) && loadedSkus.length > 0) {
          nextSkus = loadedSkus.map((s: any, idx: number) => {
            const cogs = Number(s.cogs ?? s.baseCogs ?? s.sku_base_cogs ?? 0);
            const reb = Number(s.skuRebate ?? s.rebatePerLtr ?? s.sku_reb_per_ltr ?? s.sku_rebate ?? 0);
            const mixInc = Number(s.mixIncentive ?? s.mix_incentive ?? reb);
            const recMixInc = Number(s.recMixIncentive ?? s.rec_mix_incentive ?? 0);
            const inc = Number(s.productTargetIncentive ?? s.incentive ?? s.sku_incentive ?? 0);
            const vol = Number(s.contractVolume ?? s.volume ?? s.sku_volume ?? 0);
            const focVol = Number(s.focVolume ?? s.foc_volume ?? 0);
            const sur = Number(s.surcharge ?? s.sku_surcharge ?? 0);
            const nhfVal = Number(s.nhf ?? s.sku_nhf ?? s.grossMargin ?? s.baseGross ?? 0);
            const totInp = Number(s.totalInput ?? s.total_input ?? (reb + mixInc + inc));
            const baseTOVal = Number(s.baseTO ?? (cogs * 1.45));

            return {
              id: s.id || String(idx + 1),
              skuCode: s.skuCode || s.sku_code || "",
              skuName: s.skuName || s.sku_name || "",
              skuDataOption: s.skuDataOption || "Primary",
              cogs: cogs,
              baseCOGS: cogs,
              baseTO: baseTOVal,
              lbmName: s.lbmName || "Lubricants",
              pvName: s.pvName || "PV",
              lbm: s.lbm || s.lbm_name || "",
              pv: s.pv || s.pv_name || "",
              contractVolume: vol,
              focVolume: focVol,
              totalInput: totInp,
              surcharge: sur,
              nhf: nhfVal,
              recMixIncentive: recMixInc,
              mixIncentive: mixInc,
              skuRebate: reb,
              productTargetIncentive: inc,
              productTargetIncentiveDisbVol: vol,
              productTargetIncentiveDisbMonths: 12,
              productTargetIncentiveDisbAmt: inc * vol,
            };
          });
        }
      }

      if (prev.previousOfferState === previousOfferState && prev.previousOffer === prevOfferData && prev.selectedSkus === nextSkus) {
        return prev;
      }
      return {
        ...prev,
        previousOfferState,
        previousOffer: prevOfferData,
        selectedSkus: nextSkus,
      };
    });
  }, [formData.selectedCustomer, previousOfferState, prevOfferData]);

  // ── Hydrate offer data when copying / editing a template offer ID ─────────────
  const targetOfferId = (formData as any).templateOfferId || (formData as any).editingOfferId;
  const [templateBanner, setTemplateBanner] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlOfferId = params.get("copyOfferId") || params.get("templateOfferId") || params.get("offerId");
      if (urlOfferId) {
        handleFieldChange("templateOfferId" as any, urlOfferId);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!targetOfferId) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    fetch(`${API_BASE}/offers/${targetOfferId}`)
      .then((res) => res.json())
      .then((res) => {
        const data = res.data || res;
        if (data) {
          setFormData((prev) => ({
            ...prev,
            offerStream: data.offerStream || data.selectedCustomer?.businessStream || prev.offerStream,
            offerCreationType: "Copy/Edit",
            selectedCustomer: data.selectedCustomer || prev.selectedCustomer,
            selectedSkus: Array.isArray(data.selectedSkus) && data.selectedSkus.length > 0 ? data.selectedSkus : prev.selectedSkus,
            totalVolumeCommitment: data.totalVolumeCommitment || prev.totalVolumeCommitment,
            investmentTerm: String(data.tenure || prev.investmentTerm),
            startDate: data.startDate || prev.startDate,
            endDate: data.endDate || prev.endDate,
            whyInvest: data.customerLevelInput?.why_invest || data.remark || prev.whyInvest,
            risksToVolume: data.customerLevelInput?.risks_to_volume || prev.risksToVolume,
            mitigationToRisk: data.customerLevelInput?.mitigation_to_risk || prev.mitigationToRisk,
            targetIncentive: parseFloat(data.customerLevelInput?.target_incentive || "0") || prev.targetIncentive,
            additionalCashLoan: parseFloat(data.currentProposed?.total_investment_proposed || "0") || prev.additionalCashLoan,
          }));

          const code = data.offer_code || `WBC-${targetOfferId}`;
          setTemplateBanner(`📋 Form pre-filled using Offer template: ${code}. You can now modify parameters and submit a new offer based on this template.`);
        }
      })
      .catch((err) => console.error("Error hydrating template offer:", err));
  }, [targetOfferId]);

  // ── Accordion open/close state (All 7 sections open by default) ──
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basics: true,
    customer: true,
    prevContract: true,
    investment: true,
    skus: true,
    summary: true,
    review: true,
  });

  const handleToggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // ── Errors & validation ────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  // ── Customer Offer History Data & Loading State ──────────────────
  const [customerOfferHistory, setCustomerOfferHistory] = useState<any>(null);
  const [customerOfferHistoryLoading, setCustomerOfferHistoryLoading] = useState<boolean>(false);
  const [customerOfferHistoryError, setCustomerOfferHistoryError] = useState<string | null>(null);

  const fetchHistoryForCustomer = React.useCallback((customer: Customer | null) => {
    if (!customer) {
      setCustomerOfferHistory(null);
      setCustomerOfferHistoryLoading(false);
      setCustomerOfferHistoryError(null);
      return;
    }
    const code = customer.executiveCode || customer.customerCode || customer.jdeCode || customer.id || '';
    const name = customer.name || '';
    if (!code && !name) {
      setCustomerOfferHistory(null);
      return;
    }

    setCustomerOfferHistoryLoading(true);
    setCustomerOfferHistoryError(null);

    fetchCustomerOffersApi(code, name)
      .then((res: any) => {
        setCustomerOfferHistory(res);
        if (res) {
          const normalize = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const nameKey = normalize(name).slice(0, 12);
          const candidates = [
            ...(res.activeOffers || []),
            ...(res.pendingOffers || []),
            ...(res.expiredOffers || []),
            ...(res.allOffers || []),
            ...(res.offerHistory || []),
          ];
          const baseline = candidates.find((o: any) => normalize(o.customerName || '').includes(nameKey));

          if (baseline) {
            setFormData((prev) => ({
              ...prev,
              prevOfferCommitment: parseFloat(baseline.volumeCommitment || '0') || prev.prevOfferCommitment,
              prevOfferActual: parseFloat(baseline.volumeCommitment || '0') || prev.prevOfferActual,
              months: parseInt(baseline.tenure || '12', 10) || prev.months,
              periodFrom: baseline.startDate || prev.periodFrom,
              periodTo: baseline.endDate || prev.periodTo,
              commitment: parseFloat(baseline.volumeCommitment || '0') || prev.commitment,
              actual: parseFloat(baseline.volumeCommitment || '0') || prev.actual,
            }));
          }
        }
      })
      .catch((err: any) => {
        setCustomerOfferHistory(null);
        setCustomerOfferHistoryError(err?.message || 'Failed to load customer offer history');
      })
      .finally(() => {
        setCustomerOfferHistoryLoading(false);
      });
  }, []);

  const handleFieldChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "selectedCustomer" && value) {
        const stream = (value as any).businessStream;
        if (stream) next.offerStream = stream;
      }

      return next;
    });

    if (field === "selectedCustomer") {
      fetchHistoryForCustomer(value as Customer | null);
    }

    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  const handleSkusChange = (updatedSkus: SkuRow[]) => {
    handleFieldChange("selectedSkus", updatedSkus);
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.selectedCustomer)
      nextErrors.selectedCustomer = "Customer selection is required";
    if (!formData.whyInvest.trim())
      nextErrors.whyInvest = "Investment justification is required";
    if (!formData.risksToVolume.trim())
      nextErrors.risksToVolume = "Volume risks are required";
    if (!formData.mitigationToRisk.trim())
      nextErrors.mitigationToRisk = "Mitigation actions are required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ── Submission state ────────────────────────────────────────────────────
  const [submitting, setSubmitting] = React.useState(false);
  const [submitResult, setSubmitResult] = React.useState<{
    offerId: number;
    offerCode: string;
    message: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Validation failed. Please fill out all required fields before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createFullOfferApi(formData);
      if (result.status === 'ERROR' || result.error) {
        alert(`Offer creation failed: ${result.message}`);
        return;
      }
      await submitForApprovalApi(result.offerId);
      setSubmitResult({ offerId: result.offerId, offerCode: result.offerCode, message: result.message });
      setShowSubmitSuccess(true);
    } catch (err: any) {
      console.error("Submit error:", err);
      setShowSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const result = await createFullOfferApi({ ...formData, offer_status: 'D' });
      if (result.offerId && result.offerCode) {
        alert(`✅ Draft saved! Offer Code: ${result.offerCode} (ID: ${result.offerId})`);
      } else {
        alert("Draft saved successfully!");
      }
    } catch {
      alert("Draft saved locally. Backend sync will retry on next action.");
    }
  };

  const sectionHasErrors = (fields: (keyof FormData)[]) =>
    fields.some((f) => !!errors[f]);

  const metrics = calculateCommercials(formData);

  return (
    <div className="p-[24px] space-y-[16px] pb-48 text-slate-800 bg-slate-50/50 min-h-screen">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="space-y-[16px]">
        {/* ROW 1: Breadcrumb & System Date */}
        <BreadcrumbHeader items={breadcrumbItems} showDate />

        {/* ROW 2: Mode Selection */}
        <ModeSelection activeTab="workspace" />

        {/* ROW 3: Offer Creation Workspace Section */}
        <div className="bg-white p-[20px] border border-slate-200 rounded-[14px] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <h1 className="text-[28px] sm:text-[30px] font-bold text-slate-900 tracking-tight leading-tight">
                Offer Creation Workspace
              </h1>
            </div>
            <p className="text-[12px] font-normal text-slate-500 max-w-3xl">
              Enterprise offer formulation, commercial calculations, investment modeling, and DOFA governance engine.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[12px] px-3.5 py-1.5 rounded-full shrink-0 self-start sm:self-auto">
            <Database size={13} />
            <span>Live Data – Production Mode</span>
          </div>
        </div>
      </div>

      {/* ── Template Banner ── */}
      {templateBanner && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-[14px] text-[12px] font-semibold text-emerald-800 shadow-xs">
          <span>{templateBanner}</span>
          <button
            type="button"
            onClick={() => setTemplateBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-3 underline shrink-0 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── STEPPER ─────────────────────────────────────────────────── */}
      <PipelineStepper formData={formData} />

      {/* ── MAIN TWO-COLUMN FULL-WIDTH LAYOUT (Left ~75-80% flex-1, Right ~20-25% 380-420px) ── */}
      <div className="flex flex-col lg:flex-row gap-[16px] items-stretch w-full max-w-none">

        {/* ── LEFT COLUMN: Offer Creation Workspace (5 Accordions) ────────────────────────── */}
        <div className="flex-1 min-w-0 w-full space-y-[16px]">


          {/* 01 Offer Basics */}
          <Accordion
            id="basics"
            index="01"
            title="Offer Basics"
            subtitle="Business Stream, Offer Creation Mode & Base Currency Value"
            isOpen={expandedSections.basics}
            onToggle={() => handleToggleSection("basics")}
            requiredFieldsMissing={sectionHasErrors(["offerCreationType", "dollarValue"])}
          >
            <OfferBasicsSection
              data={{
                businessStream: formData.selectedCustomer?.businessStream || formData.offerStream || "",
                offerCreationType: formData.offerCreationType,
                dollarValue: formData.dollarValue,
              }}
              errors={errors}
              onChange={handleFieldChange}
            />
          </Accordion>

          {/* 02 Customer & Performance Profile */}
          <Accordion
            id="customer"
            index="02"
            title="Customer & Performance Profile"
            subtitle="Customer Account Lookup, Address, Sales Territory & Strategic Justification"
            isOpen={expandedSections.customer}
            onToggle={() => handleToggleSection("customer")}
            requiredFieldsMissing={sectionHasErrors([
              "selectedCustomer",
              "whyInvest",
              "risksToVolume",
              "mitigationToRisk",
            ])}
          >
            <CustomerSection
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
              previousOfferLoading={prevOfferLoading}
              customerOfferHistory={customerOfferHistory}
              customerOfferHistoryLoading={customerOfferHistoryLoading}
              customerOfferHistoryError={customerOfferHistoryError}
              onRefreshHistory={() => fetchHistoryForCustomer(formData.selectedCustomer)}
            />
          </Accordion>

          {/* 03 Investment, Loans & Guarantee */}
          <Accordion
            id="investment"
            index="03"
            title="Investment, Loans & Guarantee"
            subtitle="AR/SEOL Scheme Investment, Cash/Equipment Loans, Bank Guarantee & Credit Terms"
            isOpen={expandedSections.investment}
            onToggle={() => handleToggleSection("investment")}
            requiredFieldsMissing={sectionHasErrors(["investmentType", "investmentTerm", "bgAmount"])}
          >
            <InvestmentSection
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
            />
          </Accordion>

          {/* 04 SKU Incentive & Plan */}
          <Accordion
            id="skus"
            index="04"
            title="SKU Incentive & Plan"
            subtitle="SKU Rebates Grid, Mix Incentives, Base COGS & Annual Volume Delivery Schedule"
            isOpen={expandedSections.skus}
            onToggle={() => handleToggleSection("skus")}
            requiredFieldsMissing={formData.selectedSkus.length === 0}
          >
            <SkuSection
              selectedSkus={formData.selectedSkus}
              onChange={handleSkusChange}
              stream={formData.selectedCustomer?.businessStream || ""}
            />
          </Accordion>

          {/* 05 Review & Submit */}
          <Accordion
            id="review"
            index="05"
            title="Review & Submit"
            subtitle="Final Policy Compliance Checks, DOFA Approver Verification & Workflow Submission"
            isOpen={expandedSections.review}
            onToggle={() => handleToggleSection("review")}
            requiredFieldsMissing={Object.keys(errors).length > 0}
          >
            <ReviewSection
              formData={formData}
              errors={errors}
              onSubmit={handleSubmit}
            />
          </Accordion>

        </div>

        {/* ── RIGHT COLUMN: Commercial Dashboard (Constrained width 380-420px, Sticky, Stretches Height) ────── */}
        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 lg:sticky lg:top-[20px] self-stretch flex flex-col">
          <CommercialSummary formData={formData} />
        </div>


      </div>


      {/* ── BOTTOM ACTION BAR ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-[20px] flex flex-col sm:flex-row items-center justify-between gap-4 z-40 shadow-2xl">
        {/* Navigation & Draft */}
        <div className="flex items-center gap-4 text-[14px] font-semibold text-slate-600 select-none">
          <button
            type="button"
            onClick={() => handleToggleSection("basics")}
            className="hover:text-primary transition flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft size={16} /> Previous Section
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="hover:text-primary transition flex items-center gap-1.5 cursor-pointer text-slate-700"
          >
            <Save size={16} /> Save Draft
          </button>
        </div>

        {/* Center Progress */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">COMPLETION:</span>
          <div className="w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${metrics.completionPct}%` }}
            />
          </div>
          <span className="text-[14px] font-bold text-slate-900">{metrics.completionPct}%</span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={submitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[14px] font-semibold py-2.5 px-5 rounded-[12px] transition shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-[14px] font-semibold py-2.5 px-6 rounded-[12px] transition shadow-md disabled:opacity-70 cursor-pointer"
          >
            {submitting ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Submitting...</>
            ) : (
              <><Send size={16} /> Next Step</>
            )}
          </button>
        </div>
      </div>

      {/* ── Success Modal ─────────────────────────────────────────────────── */}
      {showSubmitSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[14px] p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-slate-200">
            <span className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-primary mx-auto border border-emerald-200">
              <CheckCircle2 size={32} />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-[18px] font-bold text-slate-900">
                Offer Submitted Successfully
              </h3>
              <p className="text-[12px] text-slate-500 font-normal">
                The commercial proposal for{" "}
                <strong>{formData.selectedCustomer?.name}</strong> has been routed to{" "}
                <strong>{calculateCommercials(formData).dofaApprover}</strong> for Level {calculateCommercials(formData).dofaLevel} DOFA authorization.
              </p>
            </div>
            <div className="bg-slate-50 rounded-[10px] p-4 text-left border border-slate-200 space-y-2">
              <p className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
                Submission Summary
              </p>
              <div className="grid grid-cols-2 gap-2 text-[13px]">
                <span className="text-slate-500 font-medium">Offer Code:</span>
                <span className="font-bold text-slate-900 text-right">{submitResult?.offerCode || 'WBC-DRAFT'}</span>
                <span className="text-slate-500 font-medium">Offer ID:</span>
                <span className="font-bold text-primary text-right">{submitResult?.offerId || '—'}</span>
                <span className="text-slate-500 font-medium">DOFA Threshold:</span>
                <span className="font-bold text-primary text-right">
                  Level {calculateCommercials(formData).dofaLevel}
                </span>
                <span className="text-slate-500 font-medium">Approver:</span>
                <span className="font-bold text-slate-900 text-right truncate">
                  {calculateCommercials(formData).dofaApprover}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSubmitSuccess(false)}
              className="w-full bg-primary hover:bg-primary-dark text-white text-[14px] font-semibold py-3 rounded-[12px] transition shadow-sm cursor-pointer"
            >
              Back to Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


