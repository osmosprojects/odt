"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

export interface Customer {
  name: string;
  newExistingCustomer: string;
  currentCustomerType: string;
  proposedCustomerType: string;
  distributorName: string;
  customerNumber: string;
  keyAccount: string;
  state: string;
  segment: string;
  subSegment: string;
  jdeCode: string;
  salesRep: string;
  salesArea: string;
  address: string;
  previousWbc: string;
  previousWbcOffer: string;
  gstNumber: string;
}


// Header & Footer Layouts
import OfferHeader from "@/components/offer-creation/layout/OfferHeader";
import StickyFooter from "@/components/offer-creation/layout/StickyFooter";

// Reusable Accordion Wrapper
import Accordion from "@/components/offer-creation/ui/Accordion";

// Accordion Form Sections
import OfferBasicsSection from "@/components/offer-creation/accordion-sections/OfferBasicsSection";
import CustomerDataSection from "@/components/offer-creation/accordion-sections/CustomerDataSection";
import PastPerformanceSection from "@/components/offer-creation/accordion-sections/PastPerformanceSection";
import KerisTvdSection from "@/components/offer-creation/accordion-sections/KerisTvdSection";
import CompetitorOfferSection from "@/components/offer-creation/accordion-sections/CompetitorOfferSection";
import SalesRemarksSection from "@/components/offer-creation/accordion-sections/SalesRemarksSection";

export default function OfferCreationAccordionPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ----------------------------------------------------
  // ACCORDIONS OPEN/CLOSE STATES
  // ----------------------------------------------------
  // Sections can be expanded independently, with only the first expanded initially
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basics: true,
    customer: false,
    performance: false,
    kerisTvd: false,
    competitor: false,
    remarks: false,
  });

  // ----------------------------------------------------
  // FORM UNIFIED DATA STATE (Upgraded version)
  // ----------------------------------------------------
  const [formData, setFormData] = useState({
    // Accordion 1: Offer Basics
    offerStream: "HD",
    offerCreationType: "New Offer",
    dollarValue: 250000,

    // Accordion 2: Customer Data (Upgraded to array of Customer objects)
    customers: [
      {
        name: "Anand Distributors Pvt Ltd",
        newExistingCustomer: "Existing Customer",
        currentCustomerType: "Wholesale Dealer",
        proposedCustomerType: "Direct Key Account",
        distributorName: "Anand Logistics West",
        customerNumber: "C-839284",
        keyAccount: "Yes",
        state: "Maharashtra",
        segment: "Automotive Lubricants",
        subSegment: "Logistics & Fleet",
        jdeCode: "JDE-8472910",
        salesRep: "Rajesh Kumar",
        salesArea: "West 1 (Mumbai)",
        address: "Plot 12, GIDC Industrial Estate, Thane West, Mumbai, 400604",
        previousWbc: "Yes",
        previousWbcOffer: "WBC-2025-091 - Monsoon Fleet Base",
        gstNumber: "",
      },
    ],

    // Accordion 3: Past Actual Performance
    // volume details
    prevOfferCommitment: 20000,
    prevOfferActual: 18500,
    months: 12,
    periodFrom: "2025-01-01",
    periodTo: "2025-12-31",
    volumePM: 1500,
    actualPM: 1200,
    synthShare: 25,
    synthShareActual: 20, // added synthShareActual
    commitment: 20000,
    actual: 18500,
    // investment details
    arSeol: "AR Scheme",
    targetIncentive: 50000,
    additionalInput: 20000,
    signOnBonus: 30000,
    others: 10000,
    totalInvestment: 110000,
    rsLtrInvestment: 5.5,
    skuLevelRebate: 25,
    totalFocValue: 15000,
    prevGmpl: 18.5,
    remark: "Proposed retrospective payouts on Q3-Q4 volume targets.",

    // Accordion 4: KERIS / TVD
    kerisCode: "KERIS-MW84920",
    tvdParentId: "TVD-94812",

    // Accordion 5: Competitor Offer
    competitorDetails: "Competitor is offering flat rebate of ₹4.20/Ltr on mineral lubricants with 60 days credit terms.",

    // Accordion 6: Sales Remarks
    whyInvest: "High strategic importance in Mumbai region. Retaining this partner secures major heavy vehicle workshop volumes.",
    associatedWithCastrol: "Yes",
    significanceWithCastrol: "Associated for over 8 years, representing 14% of region's distribution capacity.",
    upTradingOpportunities: "Opportunity to up-trade from GTX to EDGE synthetics by FY27.",
    risksToVolume: "Competitor aggressive poaching, price undercut.",
    mitigationToRisk: "Secure with this long-term volume-rebate incentive package.",
    groupBelongsTo: "Anand Conglomerate",
    otherQualitativeInfo: "Client requested an audit of regional marketing assets.",
  });

  // ----------------------------------------------------
  // VALIDATION & ERROR HANDLING
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

    // 1. Offer Basics
    if (!formData.offerStream) newErrors.offerStream = "Offer Stream is required";
    if (!formData.offerCreationType) newErrors.offerCreationType = "Offer Creation Type is required";
    if (!formData.dollarValue || formData.dollarValue <= 0) {
      newErrors.dollarValue = "Dollar Value must be greater than zero";
    }

    // 2. Customer Data (Iterate over all customers)
    formData.customers.forEach((customer, index) => {
      if (!customer.name.trim()) {
        newErrors[`customer_${index}_name`] = "Customer Name is required";
      }
      if (customer.previousWbc === "Yes" && !customer.previousWbcOffer.trim()) {
        newErrors[`customer_${index}_previousWbcOffer`] = "Previous WBC Offer is required";
      }
      // GST visibility & mandatory rules based on Offer Stream
      const isGstMandatory = formData.offerStream === "CAS" || formData.offerStream === "CASN";
      if (isGstMandatory && !customer.gstNumber.trim()) {
        newErrors[`customer_${index}_gstNumber`] = "GST Number is required for CAS/CASN stream";
      }
    });

    // 5. Competitor Offer
    if (!formData.competitorDetails.trim()) {
      newErrors.competitorDetails = "Competitor details are required";
    }

    // 6. Sales Remarks
    if (!formData.whyInvest.trim()) newErrors.whyInvest = "Investment justification is required";
    if (!formData.risksToVolume.trim()) newErrors.risksToVolume = "Volume risks description is required";
    if (!formData.mitigationToRisk.trim()) newErrors.mitigationToRisk = "Mitigation action is required";

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
        // Navigates directly to the Investment & Approval page
        router.push("/offer-creation/investment");
      });
    } else {
      const hasSectionError = (fields: string[]) => {
        if (fields.includes("customerName")) {
          const hasCustErr = Object.keys(newErrors).some((k) => k.startsWith("customer_"));
          if (hasCustErr) return true;
        }
        return fields.some((f) => !!newErrors[f]);
      };

      // Auto expand any accordion containing errors
      setExpandedSections((prev) => {
        const next = { ...prev };
        if (hasSectionError(["offerStream", "offerCreationType", "dollarValue"])) {
          next.basics = true;
        }
        if (
          hasSectionError([
            "customerName",
            "previousWbcOffer",
            "gstNumber",
          ])
        ) {
          next.customer = true;
        }
        if (hasSectionError(["competitorDetails"])) {
          next.competitor = true;
        }
        if (hasSectionError(["whyInvest", "risksToVolume", "mitigationToRisk"])) {
          next.remarks = true;
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
    if (fields.includes("customerName")) {
      const hasCustErr = Object.keys(errors).some((k) => k.startsWith("customer_"));
      if (hasCustErr) return true;
    }
    return touched && fields.some((f) => !!errors[f]);
  };

  return (
    <DashboardShell>
      <div className="pb-32 space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-out]">
        <OfferHeader
          title="Offer Creation - Customer Data"
          offerCode="OC-2026-0847"
          totalValue={formData.dollarValue}
          onPreviewClick={() => setExpandedSections((prev) => ({ ...prev, remarks: true }))}
        />

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 shadow-sm">
          <Info size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-primary">
              Enterprise Accordion Form Enabled
            </p>
            <p className="text-xs text-primary/95 mt-0.5 leading-relaxed">
              Complete each of the sections below. Mandatory fields are marked with a red asterisk (*). You can expand any section independently.
            </p>
          </div>
        </div>

        {/* ==================================================== */}
        {/* VERTICAL ACCORDIONS LIST */}
        {/* ==================================================== */}
        <div className="space-y-4">
          {/* Accordion 1: Offer Basics */}
          <Accordion
            id="basics"
            index="01"
            title="Offer Basics"
            isOpen={expandedSections.basics}
            onToggle={() => handleToggleSection("basics")}
            requiredFieldsMissing={sectionHasErrors(["offerStream", "offerCreationType", "dollarValue"])}
          >
            <OfferBasicsSection
              data={{
                offerStream: formData.offerStream,
                offerCreationType: formData.offerCreationType,
                dollarValue: formData.dollarValue,
              }}
              errors={errors}
              onChange={handleFieldChange}
            />
          </Accordion>

          {/* Accordion 2: Customer Data */}
          <Accordion
            id="customer"
            index="02"
            title="Customer Data"
            isOpen={expandedSections.customer}
            onToggle={() => handleToggleSection("customer")}
            requiredFieldsMissing={sectionHasErrors([
              "customerName",
              "previousWbcOffer",
              "gstNumber",
            ])}
          >
            <CustomerDataSection
              offerStream={formData.offerStream}
              customers={formData.customers}
              errors={errors}
              onChange={(updatedCustomers) => handleFieldChange("customers", updatedCustomers)}
              touched={touched}
            />
          </Accordion>

          {/* Accordion 3: Past Actual Performance */}
          <Accordion
            id="performance"
            index="03"
            title="Past Actual Performance"
            isOpen={expandedSections.performance}
            onToggle={() => handleToggleSection("performance")}
            requiredFieldsMissing={sectionHasErrors([])}
          >
            <PastPerformanceSection
              data={{
                prevOfferCommitment: formData.prevOfferCommitment,
                prevOfferActual: formData.prevOfferActual,
                months: formData.months,
                periodFrom: formData.periodFrom,
                periodTo: formData.periodTo,
                volumePM: formData.volumePM,
                actualPM: formData.actualPM,
                synthShare: formData.synthShare,
                synthShareActual: formData.synthShareActual,
                commitment: formData.commitment,
                actual: formData.actual,
                arSeol: formData.arSeol,
                targetIncentive: formData.targetIncentive,
                additionalInput: formData.additionalInput,
                signOnBonus: formData.signOnBonus,
                others: formData.others,
                totalInvestment: formData.totalInvestment,
                rsLtrInvestment: formData.rsLtrInvestment,
                skuLevelRebate: formData.skuLevelRebate,
                totalFocValue: formData.totalFocValue,
                prevGmpl: formData.prevGmpl,
                remark: formData.remark,
              }}
              targetVolume={formData.commitment}
              errors={errors}
              onChange={handleFieldChange}
            />
          </Accordion>

          {/* Accordion 4: KERIS / TVD */}
          <Accordion
            id="kerisTvd"
            index="04"
            title="KERIS / TVD"
            isOpen={expandedSections.kerisTvd}
            onToggle={() => handleToggleSection("kerisTvd")}
            requiredFieldsMissing={sectionHasErrors([])}
          >
            <KerisTvdSection
              data={{
                kerisCode: formData.kerisCode,
                tvdParentId: formData.tvdParentId,
              }}
              errors={errors}
              onChange={handleFieldChange}
            />
          </Accordion>

          {/* Accordion 5: Main Competitor Offer */}
          <Accordion
            id="competitor"
            index="05"
            title="Main Competitor Offer"
            isOpen={expandedSections.competitor}
            onToggle={() => handleToggleSection("competitor")}
            requiredFieldsMissing={sectionHasErrors(["competitorDetails"])}
          >
            <CompetitorOfferSection
              data={{
                competitorDetails: formData.competitorDetails,
              }}
              errors={errors}
              onChange={handleFieldChange}
            />
          </Accordion>

          {/* Accordion 6: Sales Remarks */}
          <Accordion
            id="remarks"
            index="06"
            title="Sales Remarks"
            isOpen={expandedSections.remarks}
            onToggle={() => handleToggleSection("remarks")}
            requiredFieldsMissing={sectionHasErrors(["whyInvest", "risksToVolume", "mitigationToRisk"])}
          >
            <SalesRemarksSection
              data={{
                whyInvest: formData.whyInvest,
                associatedWithCastrol: formData.associatedWithCastrol,
                significanceWithCastrol: formData.significanceWithCastrol,
                upTradingOpportunities: formData.upTradingOpportunities,
                risksToVolume: formData.risksToVolume,
                mitigationToRisk: formData.mitigationToRisk,
                groupBelongsTo: formData.groupBelongsTo,
                otherQualitativeInfo: formData.otherQualitativeInfo,
              }}
              errors={errors}
              onChange={handleFieldChange}
            />
          </Accordion>
        </div>
      </div>

      <StickyFooter
        onProceed={handleProceed}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
        isSubmitting={isPending}
        proceedLabel="Next → Investment & Approval"
      />
    </DashboardShell>
  );
}
