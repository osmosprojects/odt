"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Info, Calendar, ShieldCheck, AlertTriangle } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

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

  // ----------------------------------------------------
  // STATE MANAGEMENT FOR INVESTMENT FIELDS
  // ----------------------------------------------------
  const [formData, setFormData] = useState({
    // Section 1: Investment Classification
    investmentType: "Cash Loan",
    fws: "FWS", // FWS field
    iws: "Standard IWS",
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

    // Section 3: Advance Rebate & Volume Disbursement Plan
    year1Volume: 20000,
    year1VolumePct: 40,
    year1MonthlyVolume: 833.33,
    year1AdvanceRebate: 25000,
    year1AdvanceRebatePct: 50,

    year2Volume: 30000,
    year2VolumePct: 60,
    year2MonthlyVolume: 1250,
    year2AdvanceRebate: 25000,
    year2AdvanceRebatePct: 50,

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
    bgTenureCheck: true,

    // Section 6: Credit Input
    creditTerm: 45,
    primaryCustomerCreditTerm: 30,
    tradingCreditLimit: 150000,
    existingSecurity: 50000,
    additionalSecurityRequired: 170000,
    totalCreditExposure: 230000,
  });

  // ----------------------------------------------------
  // AUTO CALCULATIONS EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    // 1. Rule: If Investment Type = None, set IWS = None, and disable/hide FWS, Rationale, BP/Bank Funded, Planning Status
    let updatedIws = formData.iws;
    let updatedFws = formData.fws;
    let updatedRationale = formData.investmentRationale;
    let updatedBpBankFunded = formData.bpBankFunded;
    let updatedPlanningStatus = formData.planningStatus;

    if (formData.investmentType === "None") {
      updatedIws = "None";
      updatedFws = "None";
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

    // 4. Year 1 & Year 2 Volume % and Rebate % Calculations
    const calculatedTotalVolume = Number(formData.year1Volume || 0) + Number(formData.year2Volume || 0);
    const calculatedTotalRebate = Number(formData.year1AdvanceRebate || 0) + Number(formData.year2AdvanceRebate || 0);

    const termMonths = Number(formData.investmentTerm || 1);
    const y1MonthlyVol = Number((Number(formData.year1Volume || 0) / termMonths).toFixed(2));
    const y2MonthlyVol = Number((Number(formData.year2Volume || 0) / termMonths).toFixed(2));

    const y1VolPct = Number(formData.totalVolumeCommitment || 1) > 0 ? Math.round((Number(formData.year1Volume || 0) / Number(formData.totalVolumeCommitment || 1)) * 100) : 0;
    const y2VolPct = Number(formData.totalVolumeCommitment || 1) > 0 ? Math.round((Number(formData.year2Volume || 0) / Number(formData.totalVolumeCommitment || 1)) * 100) : 0;

    const y1RebatePct = calculatedTotalRebate > 0 ? Math.round((Number(formData.year1AdvanceRebate || 0) / calculatedTotalRebate) * 100) : 0;
    const y2RebatePct = calculatedTotalRebate > 0 ? Math.round((Number(formData.year2AdvanceRebate || 0) / calculatedTotalRebate) * 100) : 0;

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
    // Total Credit Exposure = Trading Credit Limit + Additional Loan
    // Additional Security Required = Total Credit Exposure - Existing Security
    const calculatedExposure = Number(formData.tradingCreditLimit || 0) + calculatedTotalAdditional;
    const calculatedAddSec = calculatedExposure - Number(formData.existingSecurity || 0);

    // Update state once if any calculated value changes
    if (
      updatedIws !== formData.iws ||
      updatedFws !== formData.fws ||
      updatedRationale !== formData.investmentRationale ||
      updatedBpBankFunded !== formData.bpBankFunded ||
      updatedPlanningStatus !== formData.planningStatus ||
      calculatedEndDate !== formData.endDate ||
      calculatedTotalAdditional !== formData.totalAdditionalLoan ||
      calculatedTotalVolume !== formData.totalVolume ||
      calculatedTotalRebate !== formData.totalAdvanceRebateAmount ||
      y1MonthlyVol !== formData.year1MonthlyVolume ||
      y2MonthlyVol !== formData.year2MonthlyVolume ||
      y1VolPct !== formData.year1VolumePct ||
      y2VolPct !== formData.year2VolumePct ||
      y1RebatePct !== formData.year1AdvanceRebatePct ||
      y2RebatePct !== formData.year2AdvanceRebatePct ||
      calculatedBgPctOfAr !== formData.bgAmountPctOfAr ||
      isBgTenureValid !== formData.bgTenureCheck ||
      calculatedExposure !== formData.totalCreditExposure ||
      calculatedAddSec !== formData.additionalSecurityRequired
    ) {
      setFormData((prev) => ({
        ...prev,
        iws: updatedIws,
        fws: updatedFws,
        investmentRationale: updatedRationale,
        bpBankFunded: updatedBpBankFunded,
        planningStatus: updatedPlanningStatus,
        endDate: calculatedEndDate,
        totalAdditionalLoan: calculatedTotalAdditional,
        totalVolume: calculatedTotalVolume,
        totalAdvanceRebateAmount: calculatedTotalRebate,
        year1MonthlyVolume: y1MonthlyVol,
        year2MonthlyVolume: y2MonthlyVol,
        year1VolumePct: y1VolPct,
        year2VolumePct: y2VolPct,
        year1AdvanceRebatePct: y1RebatePct,
        year2AdvanceRebatePct: y2RebatePct,
        bgAmountPctOfAr: calculatedBgPctOfAr,
        bgTenureCheck: isBgTenureValid,
        totalCreditExposure: calculatedExposure,
        additionalSecurityRequired: calculatedAddSec,
      }));
    }
  }, [
    formData.investmentType,
    formData.fws,
    formData.iws,
    formData.investmentRationale,
    formData.bpBankFunded,
    formData.planningStatus,
    formData.startDate,
    formData.investmentTerm,
    formData.additionalCashLoan,
    formData.additionalEquipmentLoan,
    formData.year1Volume,
    formData.year2Volume,
    formData.year1AdvanceRebate,
    formData.year2AdvanceRebate,
    formData.bgAmount,
    formData.bgEndDate,
    formData.tradingCreditLimit,
    formData.existingSecurity,
    formData.totalVolumeCommitment,
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
  // Enabled / Visible only for FWS + Cash Loan
  const isFwsCashLoan = formData.investmentType === "Cash Loan" && formData.fws === "FWS";

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

              <Select
                label="FWS"
                disabled={formData.investmentType === "None"}
                options={["None", "FWS"]}
                value={formData.fws}
                onChange={(e) => handleFieldChange("fws", e.target.value)}
              />

              <Select
                label="IWS"
                disabled={formData.investmentType === "None"}
                options={["None", "Standard IWS", "Custom IWS"]}
                value={formData.iws}
                onChange={(e) => handleFieldChange("iws", e.target.value)}
              />

              {isFwsCashLoan && (
                <>
                  <Select
                    label="Investment Rationale *"
                    options={["", "Asset Purchase", "Marketing Support", "Distributor Setup"]}
                    value={formData.investmentRationale}
                    onChange={(e) => handleFieldChange("investmentRationale", e.target.value)}
                    error={errors.investmentRationale}
                    required
                  />

                  <Select
                    label="BP / Bank Funded *"
                    options={["", "BP Funded", "Bank Funded"]}
                    value={formData.bpBankFunded}
                    onChange={(e) => handleFieldChange("bpBankFunded", e.target.value)}
                    error={errors.bpBankFunded}
                    required
                  />

                  <Select
                    label="Planning Status *"
                    options={["", "Planned", "Unplanned"]}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year 1 */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-4">
                <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-2">
                  <Calendar size={14} className="text-primary" />
                  Year 1 Plan
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Volume (Ltr)"
                    type="number"
                    value={formData.year1Volume || ""}
                    onChange={(e) => handleFieldChange("year1Volume", Number(e.target.value))}
                  />
                  <Input
                    label="Monthly Volume (Ltr)"
                    type="number"
                    disabled
                    value={formData.year1MonthlyVolume}
                  />
                  <Input
                    label="Volume %"
                    type="number"
                    disabled
                    value={formData.year1VolumePct}
                    suffixText="%"
                  />
                  <Input
                    label="Advance Rebate (₹)"
                    type="number"
                    value={formData.year1AdvanceRebate || ""}
                    onChange={(e) => handleFieldChange("year1AdvanceRebate", Number(e.target.value))}
                  />
                  <Input
                    label="Advance Rebate %"
                    type="number"
                    disabled
                    value={formData.year1AdvanceRebatePct}
                    suffixText="%"
                  />
                </div>
              </div>

              {/* Year 2 */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-4">
                <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-2">
                  <Calendar size={14} className="text-primary" />
                  Year 2 Plan
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Volume (Ltr)"
                    type="number"
                    value={formData.year2Volume || ""}
                    onChange={(e) => handleFieldChange("year2Volume", Number(e.target.value))}
                  />
                  <Input
                    label="Monthly Volume (Ltr)"
                    type="number"
                    disabled
                    value={formData.year2MonthlyVolume}
                  />
                  <Input
                    label="Volume %"
                    type="number"
                    disabled
                    value={formData.year2VolumePct}
                    suffixText="%"
                  />
                  <Input
                    label="Advance Rebate (₹)"
                    type="number"
                    value={formData.year2AdvanceRebate || ""}
                    onChange={(e) => handleFieldChange("year2AdvanceRebate", Number(e.target.value))}
                  />
                  <Input
                    label="Advance Rebate %"
                    type="number"
                    disabled
                    value={formData.year2AdvanceRebatePct}
                    suffixText="%"
                  />
                </div>
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
