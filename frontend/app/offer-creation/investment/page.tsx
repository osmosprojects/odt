"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Info, Calendar, ShieldCheck, AlertTriangle, Check, AlertCircle } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

export interface YearlyPlan {
  year: number;
  volume: number;
  monthlyVolume: number;
  volumePct: number;
  advanceRebate: number;
  advanceRebatePct: number;
}


// Custom UI Inputs
import Input from "@/components/offer-creation/ui/Input";
import Select from "@/components/offer-creation/ui/Select";
import TextArea from "@/components/offer-creation/ui/TextArea";
import Accordion from "@/components/offer-creation/ui/Accordion";

// Header & Footer Layouts
import OfferHeader from "@/components/offer-creation/layout/OfferHeader";
import StickyFooter from "@/components/offer-creation/layout/StickyFooter";

export default function InvestmentAndApprovalPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ----------------------------------------------------
  // ACCORDIONS OPEN/CLOSE STATES
  // ----------------------------------------------------
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    classification: true,
    data: false,
    plan: false,
    totals: false,
    bg: false,
    credit: false,
  });

  const [activeYearIndex, setActiveYearIndex] = useState<number>(0);

  // ----------------------------------------------------
  // STATE MANAGEMENT FOR INVESTMENT FIELDS
  // ----------------------------------------------------
  const [formData, setFormData] = useState({
    // Section 1: Investment Classification
    investmentType: "Cash Loan",
    investmentRationale: "Asset Purchase",
    bpBankFunded: "BP Funded",
    planningStatus: "Planned",

    // Section 2: Investment Data
    investmentTerm: "24",
    startDate: "2026-08-01",
    endDate: "2028-08-01",
    existingLoanBalance: 200000,
    existingLoanEndDate: "2026-07-31",
    existingLoanVolumeRemaining: 15000,
    additionalCashLoan: 50000,
    additionalEquipmentLoan: 30000,
    totalAdditionalLoan: 80000,
    totalTradeLoan: 120000,
    totalVolumeCommitment: 50000,
    amortizationRatePerLitre: 2.4,

    // Section 3: Advance Rebate & Volume Disbursement Plan (Upgraded to dynamic array)
    yearlyPlans: [
      {
        year: 1,
        volume: 20000,
        monthlyVolume: 1666.67,
        volumePct: 40,
        advanceRebate: 25000,
        advanceRebatePct: 50,
      },
      {
        year: 2,
        volume: 30000,
        monthlyVolume: 2500.00,
        volumePct: 60,
        advanceRebate: 25000,
        advanceRebatePct: 50,
      },
    ] as YearlyPlan[],

    // Section 4: Advance Rebate Total
    totalVolume: 50000,
    totalAdvanceRebateAmount: 50000,

    // Section 5: Bank Guarantee Details
    bgEndDate: "2029-02-28", // default set to > 6 months after end date
    bgTenure: "30",
    bgAmount: 40000,
    bgAmountPctOfAr: 80,
    bankName: "State Bank of India",
    bankAddress: "MG Road Branch, Mumbai",
    gstNumber: "",
    gstName: "",
    bgTenureCheck: true,

    // Section 6: Credit Input
    creditTerm: 45,
    primaryCustomerCreditTerm: 30,
    tradingCreditLimit: 150000,
    existingSecurity: 50000,
    additionalSecurityRequired: 170000,
    totalCreditExposure: 230000,
  });

  // Keep activeYearIndex inside valid boundaries
  useEffect(() => {
    if (activeYearIndex >= formData.yearlyPlans.length) {
      setActiveYearIndex(Math.max(0, formData.yearlyPlans.length - 1));
    }
  }, [formData.yearlyPlans.length, activeYearIndex]);

  // ----------------------------------------------------
  // AUTO CALCULATIONS EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    // 1. Rule: If Investment Type = None, clear Rationale, BP/Bank Funded, Planning Status
    let updatedRationale = formData.investmentRationale;
    let updatedBpBankFunded = formData.bpBankFunded;
    let updatedPlanningStatus = formData.planningStatus;

    if (formData.investmentType === "None") {
      updatedRationale = "";
      updatedBpBankFunded = "";
      updatedPlanningStatus = "";
    }

    // 2. End Date Calculation: Start Date + Term (months)
    let calculatedEndDate = "";
    if (formData.startDate && formData.investmentTerm) {
      const start = new Date(formData.startDate);
      if (!isNaN(start.getTime())) {
        start.setMonth(start.getMonth() + Number(formData.investmentTerm));
        calculatedEndDate = start.toISOString().split("T")[0];
      }
    }

    // 3. Total Additional Loan: Cash + Equipment
    const calculatedTotalAdditional = Number(formData.additionalCashLoan || 0) + Number(formData.additionalEquipmentLoan || 0);

    // 4. Dynamic Yearly Plans resizing & calculations
    const targetYears = Math.floor(Number(formData.investmentTerm || 24) / 12);
    let updatedYearlyPlans = [...formData.yearlyPlans];

    if (updatedYearlyPlans.length !== targetYears) {
      if (updatedYearlyPlans.length > targetYears) {
        // Shrink term: preserve Year 1 values
        updatedYearlyPlans = updatedYearlyPlans.slice(0, targetYears);
      } else {
        // Expand term: add new years, initialize with default values
        for (let y = updatedYearlyPlans.length + 1; y <= targetYears; y++) {
          updatedYearlyPlans.push({
            year: y,
            volume: 0,
            monthlyVolume: 0,
            volumePct: 0,
            advanceRebate: 0,
            advanceRebatePct: 0,
          });
        }
      }
    }

    // Calculate sums
    let calculatedTotalVolume = 0;
    let calculatedTotalRebate = 0;
    updatedYearlyPlans.forEach((plan) => {
      calculatedTotalVolume += Number(plan.volume || 0);
      calculatedTotalRebate += Number(plan.advanceRebate || 0);
    });

    const totalCommitment = Number(formData.totalVolumeCommitment || 0);

    // Map yearly calculations: Monthly Volume = Year Volume / 12
    // Volume % = (Year Volume / Total Volume Commitment) * 100
    // Advance Rebate % = (Year Advance Rebate / Total Advance Rebate Amount) * 100
    updatedYearlyPlans = updatedYearlyPlans.map((plan) => {
      const vol = Number(plan.volume || 0);
      const reb = Number(plan.advanceRebate || 0);
      return {
        ...plan,
        monthlyVolume: Number((vol / 12).toFixed(2)),
        volumePct: totalCommitment > 0 ? Math.round((vol / totalCommitment) * 100) : 0,
        advanceRebatePct: calculatedTotalRebate > 0 ? Math.round((reb / calculatedTotalRebate) * 100) : 0,
      };
    });

    // 5. BG Amount % of AR Amount
    const calculatedBgPctOfAr = calculatedTotalRebate > 0 ? Math.round((Number(formData.bgAmount || 0) / calculatedTotalRebate) * 100) : 0;

    // 6. BG Tenure Validation: End Date of BG >= 6 months after Offer End Date
    let isBgTenureValid = false;
    if (calculatedEndDate && formData.bgEndDate) {
      const offerEnd = new Date(calculatedEndDate);
      const bgEnd = new Date(formData.bgEndDate);
      if (!isNaN(offerEnd.getTime()) && !isNaN(bgEnd.getTime())) {
        const diffMonths = (bgEnd.getFullYear() - offerEnd.getFullYear()) * 12 + (bgEnd.getMonth() - offerEnd.getMonth());
        isBgTenureValid = diffMonths >= 6;
      }
    }

    // 7. Total Credit Exposure & Additional Security Required
    const calculatedExposure = Number(formData.tradingCreditLimit || 0) + calculatedTotalAdditional;
    const calculatedAddSec = calculatedExposure - Number(formData.existingSecurity || 0);

    // Check if yearly plans changed
    let plansChanged = false;
    if (updatedYearlyPlans.length !== formData.yearlyPlans.length) {
      plansChanged = true;
    } else {
      for (let i = 0; i < updatedYearlyPlans.length; i++) {
        const u = updatedYearlyPlans[i];
        const f = formData.yearlyPlans[i];
        if (
          u.year !== f.year ||
          u.volume !== f.volume ||
          u.monthlyVolume !== f.monthlyVolume ||
          u.volumePct !== f.volumePct ||
          u.advanceRebate !== f.advanceRebate ||
          u.advanceRebatePct !== f.advanceRebatePct
        ) {
          plansChanged = true;
          break;
        }
      }
    }

    // Update state once if any calculated value changes
    if (
      updatedRationale !== formData.investmentRationale ||
      updatedBpBankFunded !== formData.bpBankFunded ||
      updatedPlanningStatus !== formData.planningStatus ||
      calculatedEndDate !== formData.endDate ||
      calculatedTotalAdditional !== formData.totalAdditionalLoan ||
      calculatedTotalVolume !== formData.totalVolume ||
      calculatedTotalRebate !== formData.totalAdvanceRebateAmount ||
      calculatedBgPctOfAr !== formData.bgAmountPctOfAr ||
      isBgTenureValid !== formData.bgTenureCheck ||
      calculatedExposure !== formData.totalCreditExposure ||
      calculatedAddSec !== formData.additionalSecurityRequired ||
      plansChanged
    ) {
      setFormData((prev) => ({
        ...prev,
        investmentRationale: updatedRationale,
        bpBankFunded: updatedBpBankFunded,
        planningStatus: updatedPlanningStatus,
        endDate: calculatedEndDate,
        totalAdditionalLoan: calculatedTotalAdditional,
        totalVolume: calculatedTotalVolume,
        totalAdvanceRebateAmount: calculatedTotalRebate,
        yearlyPlans: updatedYearlyPlans,
        bgAmountPctOfAr: calculatedBgPctOfAr,
        bgTenureCheck: isBgTenureValid,
        totalCreditExposure: calculatedExposure,
        additionalSecurityRequired: calculatedAddSec,
      }));
    }
  }, [
    formData.investmentType,
    formData.investmentRationale,
    formData.bpBankFunded,
    formData.planningStatus,
    formData.startDate,
    formData.investmentTerm,
    formData.additionalCashLoan,
    formData.additionalEquipmentLoan,
    formData.bgAmount,
    formData.bgEndDate,
    formData.tradingCreditLimit,
    formData.existingSecurity,
    formData.totalVolumeCommitment,
    JSON.stringify(formData.yearlyPlans),
  ]);

  // ----------------------------------------------------
  // VALIDATIONS & TOUCH STATE
  // ----------------------------------------------------
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleYearlyPlanChange = (index: number, field: "volume" | "advanceRebate", value: number) => {
    setFormData((prev) => {
      const updatedPlans = prev.yearlyPlans.map((plan, i) => {
        if (i === index) {
          return { ...plan, [field]: value };
        }
        return plan;
      });
      return { ...prev, yearlyPlans: updatedPlans };
    });
  };

  const getYearPlanStatus = (plan: YearlyPlan) => {
    const vol = Number(plan.volume || 0);
    const reb = Number(plan.advanceRebate || 0);
    if (vol > 0 && reb > 0) {
      return { status: "complete", label: "Complete" };
    }
    if (vol === 0 && reb === 0) {
      return { status: "unconfigured", label: "Not Configured" };
    }
    return { status: "incomplete", label: "Incomplete" };
  };


  const handleToggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const validateForm = (): { isValid: boolean; newErrors: Record<string, string> } => {
    const newErrors: Record<string, string> = {};

    // Required fields:
    if (!formData.investmentType) newErrors.investmentType = "Investment Type is required";
    if (!formData.investmentTerm) newErrors.investmentTerm = "Investment Term is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (formData.existingLoanBalance === undefined || formData.existingLoanBalance === null) {
      newErrors.existingLoanBalance = "Existing Loan Balance is required";
    }
    if (!formData.totalVolumeCommitment || formData.totalVolumeCommitment <= 0) {
      newErrors.totalVolumeCommitment = "Volume Commitment must be greater than zero";
    }
    if (formData.bgAmount === undefined || formData.bgAmount === null) {
      newErrors.bgAmount = "Bank Guarantee Amount is required";
    }
    if (formData.creditTerm === undefined || formData.creditTerm === null) {
      newErrors.creditTerm = "Credit Term is required";
    }

    // BG Tenure validation check
    if (!formData.bgTenureCheck) {
      newErrors.bgEndDate = "BG Tenure must end at least 6 months after offer end date";
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      newErrors,
    };
  };

  const handleProceed = () => {
    setTouched(true);
    const { isValid, newErrors } = validateForm();

    if (isValid) {
      startTransition(() => {
        alert("Investment & Loan configuration validated successfully!");
        router.push("/offer-creation/sku-incentive");
      });
    } else {
      const hasSectionError = (fields: string[]) => fields.some((f) => !!newErrors[f]);

      setExpandedSections((prev) => {
        const next = { ...prev };
        if (hasSectionError(["investmentType"])) {
          next.classification = true;
        }
        if (hasSectionError(["investmentTerm", "startDate", "existingLoanBalance", "totalVolumeCommitment"])) {
          next.data = true;
        }
        if (hasSectionError(["bgAmount", "bgEndDate"])) {
          next.bg = true;
        }
        if (hasSectionError(["creditTerm"])) {
          next.credit = true;
        }
        return next;
      });

      alert("Validation failed. Please correct the validation errors in the highlighted sections.");
    }
  };

  const handleSaveDraft = () => {
    alert("Draft successfully saved! Your configuration changes have been recorded.");
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
      router.push("/dashboard");
    }
  };

  const sectionHasErrors = (fields: string[]): boolean => {
    return touched && fields.some((f) => !!errors[f]);
  };

  // Section 1 Visibility logic
  const isCashLoanActive = formData.investmentType === "Cash Loan";

  return (
    <DashboardShell>
      <div className="pb-32 space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-out]">
        <OfferHeader
          title="Offer Creation - Investment & Approval"
          offerCode="OC-2026-0847"
          totalValue={formData.additionalCashLoan + formData.additionalEquipmentLoan}
          onPreviewClick={() => setExpandedSections((prev) => ({ ...prev, credit: true }))}
        />

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 shadow-sm">
          <Info size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-primary">
              Investment & Loan Form Enabled
            </p>
            <p className="text-xs text-primary/95 mt-0.5 leading-relaxed">
              Define loan disbursements, advance rebate schedules, bank guarantees, and total credit exposures for this customer offer.
            </p>
          </div>
        </div>

        {/* ==================================================== */}
        {/* VERTICAL ACCORDIONS LIST */}
        {/* ==================================================== */}
        <div className="space-y-4">
          {/* Section 1: Investment Classification */}
          <Accordion
            id="classification"
            index="01"
            title="Investment Classification"
            isOpen={expandedSections.classification}
            onToggle={() => handleToggleSection("classification")}
            requiredFieldsMissing={sectionHasErrors(["investmentType"])}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Select
                label="Investment Type *"
                options={["None", "Cash Loan"]}
                value={formData.investmentType}
                onChange={(e) => handleFieldChange("investmentType", e.target.value)}
                error={errors.investmentType}
                required
              />

              {isCashLoanActive && (
                <>
                  <Select
                    label="Investment Rationale *"
                    options={["- select -", "Asset Purchase", "Marketing Support", "Distributor Setup"]}
                    value={formData.investmentRationale}
                    onChange={(e) => handleFieldChange("investmentRationale", e.target.value)}
                    error={errors.investmentRationale}
                    required
                  />

                  <Select
                    label="BP / Bank Funded *"
                    options={["- select -", "BP Funded", "Bank Funded"]}
                    value={formData.bpBankFunded}
                    onChange={(e) => handleFieldChange("bpBankFunded", e.target.value)}
                    error={errors.bpBankFunded}
                    required
                  />

                  <Select
                    label="Planning Status *"
                    options={["- select -", "Planned", "Unplanned"]}
                    value={formData.planningStatus}
                    onChange={(e) => handleFieldChange("planningStatus", e.target.value)}
                    error={errors.planningStatus}
                    required
                  />
                </>
              )}
            </div>
          </Accordion>

          {/* Section 2: Investment Data */}
          <Accordion
            id="data"
            index="02"
            title="Investment Data"
            isOpen={expandedSections.data}
            onToggle={() => handleToggleSection("data")}
            requiredFieldsMissing={sectionHasErrors(["investmentTerm", "startDate", "existingLoanBalance", "totalVolumeCommitment"])}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Select
                label="Investment Term (Months) *"
                options={["12", "24", "36", "48", "60"]}
                value={formData.investmentTerm}
                onChange={(e) => handleFieldChange("investmentTerm", e.target.value)}
                error={errors.investmentTerm}
                required
              />

              <Input
                label="Start Date *"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleFieldChange("startDate", e.target.value)}
                error={errors.startDate}
                required
              />

              <Input
                label="End Date"
                type="date"
                disabled
                value={formData.endDate}
              />

              <Input
                label="Existing Loan Balance (₹) *"
                type="number"
                placeholder="₹ Balance"
                value={formData.existingLoanBalance || ""}
                onChange={(e) => handleFieldChange("existingLoanBalance", Number(e.target.value))}
                error={errors.existingLoanBalance}
                required
              />

              <Input
                label="Existing Contract End Date"
                type="date"
                value={formData.existingLoanEndDate}
                onChange={(e) => handleFieldChange("existingLoanEndDate", e.target.value)}
              />

              <Input
                label="Existing Vol Remaining (Ltr)"
                type="number"
                placeholder="Volume Ltr"
                value={formData.existingLoanVolumeRemaining || ""}
                onChange={(e) => handleFieldChange("existingLoanVolumeRemaining", Number(e.target.value))}
              />

              <Input
                label="Additional Cash Loan (₹)"
                type="number"
                placeholder="Cash Loan"
                value={formData.additionalCashLoan || ""}
                onChange={(e) => handleFieldChange("additionalCashLoan", Number(e.target.value))}
              />

              <Input
                label="Additional Equip Loan (₹)"
                type="number"
                placeholder="Equipment Loan"
                value={formData.additionalEquipmentLoan || ""}
                onChange={(e) => handleFieldChange("additionalEquipmentLoan", Number(e.target.value))}
              />

              <Input
                label="Total Additional Loan (₹)"
                type="number"
                disabled
                value={formData.totalAdditionalLoan}
              />

              <Input
                label="Total Trade Loan (₹)"
                type="number"
                placeholder="Trade Loan"
                value={formData.totalTradeLoan || ""}
                onChange={(e) => handleFieldChange("totalTradeLoan", Number(e.target.value))}
              />

              <Input
                label="Total Vol Commitment (Ltr) *"
                type="number"
                placeholder="e.g. 50000"
                value={formData.totalVolumeCommitment || ""}
                onChange={(e) => handleFieldChange("totalVolumeCommitment", Number(e.target.value))}
                error={errors.totalVolumeCommitment}
                required
              />

              <Input
                label="Amortization Rate (₹/Ltr)"
                type="number"
                step="0.01"
                placeholder="₹ Per Ltr"
                value={formData.amortizationRatePerLitre || ""}
                onChange={(e) => handleFieldChange("amortizationRatePerLitre", Number(e.target.value))}
              />
            </div>
          </Accordion>

          {/* Section 3: Advance Rebate & Volume Disbursement Plan */}
          <Accordion
            id="plan"
            index="03"
            title="Advance Rebate & Volume Disbursement Plan"
            isOpen={expandedSections.plan}
            onToggle={() => handleToggleSection("plan")}
          >
            <div className="flex flex-col md:flex-row gap-6 w-full text-brand-dark">
              {/* LEFT PANEL: YEAR LIST */}
              <div className="w-full md:w-[35%] lg:w-[30%] shrink-0 flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                  <h4 className="text-xs font-bold text-brand-gray uppercase tracking-wider">Rebate Plans</h4>
                  <span className="text-[10px] font-semibold text-brand-gray bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full select-none">
                    {formData.yearlyPlans.length} {formData.yearlyPlans.length === 1 ? "Year" : "Years"}
                  </span>
                </div>

                {/* MOBILE LAYOUT: Horizontal scrollable tab list */}
                <div className="flex md:hidden flex-row gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
                  {formData.yearlyPlans.map((plan, index) => {
                    const isActive = index === activeYearIndex;
                    const { status } = getYearPlanStatus(plan);
                    const formattedVol = plan.volume ? `${plan.volume.toLocaleString()} Ltr` : "Not Configured";
                    const formattedReb = plan.advanceRebate ? `₹${plan.advanceRebate.toLocaleString()}` : "";

                    return (
                      <div
                        key={plan.year}
                        onClick={() => setActiveYearIndex(index)}
                        className={`shrink-0 w-44 snap-align-start relative p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-24 select-none
                          ${isActive ? "border-primary bg-primary/[0.02] shadow-sm" : "border-gray-200 bg-white"}
                        `}
                      >
                        <div>
                          <span className="text-[9px] font-bold text-brand-gray uppercase tracking-wider block mb-0.5">
                            Year {plan.year}
                          </span>
                          <h4 className={`text-xs font-bold truncate ${plan.volume ? "text-brand-dark" : "text-brand-gray/60 italic"}`}>
                            {formattedVol}
                          </h4>
                          {formattedReb && (
                            <span className="text-[9px] font-semibold text-brand-gray block mt-0.5">
                              {formattedReb}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {status === "complete" && (
                            <>
                              <div className="bg-emerald-500 text-white rounded-full p-0.5 flex items-center justify-center shrink-0">
                                <Check size={8} className="stroke-[3]" />
                              </div>
                              <span className="text-[9px] font-bold text-emerald-600">Complete</span>
                            </>
                          )}
                          {status === "unconfigured" && (
                            <>
                              <div className="w-2.5 h-2.5 rounded-full border border-gray-300 flex items-center justify-center shrink-0" />
                              <span className="text-[9px] font-bold text-gray-500">Not Configured</span>
                            </>
                          )}
                          {status === "incomplete" && (
                            <>
                              <div className="text-amber-500 shrink-0">
                                <AlertTriangle size={10} className="stroke-amber-500 stroke-[2.5]" />
                              </div>
                              <span className="text-[9px] font-bold text-amber-600">Incomplete</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TABLET / DESKTOP LAYOUT: Vertical card list */}
                <div className="hidden md:flex flex-col gap-3 max-h-[260px] overflow-y-auto overflow-x-hidden pr-1 thin-scroll scroll-smooth">
                  {formData.yearlyPlans.map((plan, index) => {
                    const isActive = index === activeYearIndex;
                    const { status } = getYearPlanStatus(plan);
                    const formattedVol = plan.volume ? `${plan.volume.toLocaleString()} Ltr` : "Not Configured";
                    const formattedReb = plan.advanceRebate ? `₹${plan.advanceRebate.toLocaleString()}` : "—";

                    return (
                      <div
                        key={plan.year}
                        onClick={() => setActiveYearIndex(index)}
                        className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-28 select-none
                          ${isActive ? "border-primary bg-primary/[0.01] shadow-xs" : "border-gray-250 bg-white hover:border-gray-350 hover:shadow-xs"}
                        `}
                      >
                        <div>
                          <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider block mb-1">
                            Year {plan.year}
                          </span>
                          <h4 className={`text-sm font-bold truncate leading-snug ${plan.volume ? "text-brand-dark" : "text-brand-gray/60 italic"}`}>
                            {formattedVol}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-medium text-brand-gray pt-1">
                          <div>
                            <span className="text-gray-400 font-normal">Rebate:</span> {formattedReb}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {status === "complete" && (
                              <>
                                <div className="bg-emerald-500 text-white rounded-full p-0.5 flex items-center justify-center shrink-0">
                                  <Check size={10} className="stroke-[3]" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600">Complete</span>
                              </>
                            )}
                            {status === "unconfigured" && (
                              <>
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0" />
                                <span className="text-[10px] font-bold text-gray-500">Not Configured</span>
                              </>
                            )}
                            {status === "incomplete" && (
                              <>
                                <div className="text-amber-500 shrink-0">
                                  <AlertTriangle size={12} className="stroke-amber-500 stroke-[2.5]" />
                                </div>
                                <span className="text-[10px] font-bold text-amber-600">Incomplete</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT PANEL: SELECTED YEAR DETAILS */}
              <div className="flex-1 md:w-[65%] lg:w-[70%]">
                {formData.yearlyPlans[activeYearIndex] ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-xs space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Year {formData.yearlyPlans[activeYearIndex].year} Plan</h4>
                      <p className="text-xs text-brand-gray mt-0.5 font-medium">
                        Configure volume targets and advance rebates for Year {formData.yearlyPlans[activeYearIndex].year}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Volume (Ltr) *"
                        type="number"
                        value={formData.yearlyPlans[activeYearIndex].volume || ""}
                        onChange={(e) => handleYearlyPlanChange(activeYearIndex, "volume", Number(e.target.value))}
                      />
                      <Input
                        label="Monthly Volume (Ltr)"
                        type="number"
                        disabled
                        value={formData.yearlyPlans[activeYearIndex].monthlyVolume}
                      />
                      <Input
                        label="Volume %"
                        type="number"
                        disabled
                        value={formData.yearlyPlans[activeYearIndex].volumePct}
                        suffixText="%"
                      />
                      <Input
                        label="Advance Rebate (₹) *"
                        type="number"
                        value={formData.yearlyPlans[activeYearIndex].advanceRebate || ""}
                        onChange={(e) => handleYearlyPlanChange(activeYearIndex, "advanceRebate", Number(e.target.value))}
                      />
                      <Input
                        label="Advance Rebate %"
                        type="number"
                        disabled
                        value={formData.yearlyPlans[activeYearIndex].advanceRebatePct}
                        suffixText="%"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-250 rounded-xl p-8 text-center text-brand-gray font-medium text-xs">
                    Please select a Year Plan to see details.
                  </div>
                )}
              </div>
            </div>
          </Accordion>

          {/* Section 4: Advance Rebate Total */}
          <Accordion
            id="totals"
            index="04"
            title="Advance Rebate Total"
            isOpen={expandedSections.totals}
            onToggle={() => handleToggleSection("totals")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Total Volume (Ltr)"
                type="number"
                disabled
                value={formData.totalVolume}
                suffixText="Ltr"
              />
              <Input
                label="Total Advance Rebate Amount (₹)"
                type="number"
                disabled
                value={formData.totalAdvanceRebateAmount}
                prefixText="₹"
              />
            </div>
          </Accordion>

          {/* Section 5: Bank Guarantee Details */}
          <Accordion
            id="bg"
            index="05"
            title="Bank Guarantee Details"
            isOpen={expandedSections.bg}
            onToggle={() => handleToggleSection("bg")}
            requiredFieldsMissing={sectionHasErrors(["bgAmount", "bgEndDate"])}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                label="BG End Date *"
                type="date"
                value={formData.bgEndDate}
                onChange={(e) => handleFieldChange("bgEndDate", e.target.value)}
                error={errors.bgEndDate}
                required
              />

              <Input
                label="BG Tenure (Months)"
                type="text"
                value={formData.bgTenure}
                onChange={(e) => handleFieldChange("bgTenure", e.target.value)}
              />

              <Input
                label="BG Amount (₹) *"
                type="number"
                placeholder="₹ Guarantee"
                value={formData.bgAmount || ""}
                onChange={(e) => handleFieldChange("bgAmount", Number(e.target.value))}
                error={errors.bgAmount}
                required
              />

              <Input
                label="BG Amount as %"
                type="number"
                disabled
                value={formData.bgAmountPctOfAr}
                suffixText="%"
              />

              <Input
                label="Bank Name"
                placeholder="State Bank, ICICI..."
                value={formData.bankName}
                onChange={(e) => handleFieldChange("bankName", e.target.value)}
              />

              <TextArea
                label="Bank Address"
                placeholder="Bank branch location"
                rows={2}
                value={formData.bankAddress}
                onChange={(e) => handleFieldChange("bankAddress", e.target.value)}
              />

              <Input
                label="GST Number"
                placeholder="Enter GST Number"
                value={formData.gstNumber}
                onChange={(e) => handleFieldChange("gstNumber", e.target.value)}
              />

              <Input
                label="GST Name (Company Name)"
                placeholder="Enter GST Name"
                value={formData.gstName}
                onChange={(e) => handleFieldChange("gstName", e.target.value)}
              />

              <div className="sm:col-span-3">
                <div className="py-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className={formData.bgTenureCheck ? "text-primary" : "text-red-500"} />
                    <span className="text-xs font-semibold text-brand-dark">
                      BG Tenure &ge; 6 Months after Offer End Date including further claim period of 6 months.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    disabled
                    checked={formData.bgTenureCheck}
                    className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 pointer-events-none"
                  />
                </div>
                {!formData.bgTenureCheck && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-red-500 animate-pulse px-1">
                    <AlertTriangle size={14} />
                    <span>Warning: Bank Guarantee End Date must be at least 6 months after the calculated Offer End Date.</span>
                  </div>
                )}
              </div>
            </div>
          </Accordion>

          {/* Section 6: Credit Input */}
          <Accordion
            id="credit"
            index="06"
            title="Credit Input"
            isOpen={expandedSections.credit}
            onToggle={() => handleToggleSection("credit")}
            requiredFieldsMissing={sectionHasErrors(["creditTerm"])}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                label="Credit Term (Days) *"
                type="number"
                value={formData.creditTerm || ""}
                onChange={(e) => handleFieldChange("creditTerm", Number(e.target.value))}
                error={errors.creditTerm}
                required
              />

              <Input
                label="Primary Distr Credit Term"
                type="number"
                value={formData.primaryCustomerCreditTerm || ""}
                onChange={(e) => handleFieldChange("primaryCustomerCreditTerm", Number(e.target.value))}
              />

              <Input
                label="Additional Loan (₹)"
                type="number"
                disabled
                value={formData.totalAdditionalLoan}
              />

              <Input
                label="Trading Credit Limit (₹)"
                type="number"
                placeholder="Trading Limit"
                value={formData.tradingCreditLimit || ""}
                onChange={(e) => handleFieldChange("tradingCreditLimit", Number(e.target.value))}
              />

              <Input
                label="Existing Security (+) (₹)"
                type="number"
                placeholder="Existing Security"
                value={formData.existingSecurity || ""}
                onChange={(e) => handleFieldChange("existingSecurity", Number(e.target.value))}
              />

              <Input
                label="Additional Security Required (+) (₹)"
                type="number"
                disabled
                value={formData.additionalSecurityRequired}
                className="bg-gray-100"
              />

              <div className="sm:col-span-3">
                <Input
                  label="Total Credit Exposure (₹)"
                  type="number"
                  disabled
                  value={formData.totalCreditExposure}
                  className="bg-gray-100 font-semibold"
                />
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      <StickyFooter
        onProceed={handleProceed}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
        isSubmitting={isPending}
        proceedLabel="Next → SKU & Incentive"
      />
    </DashboardShell>
  );
}
