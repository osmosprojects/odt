"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Info, Calendar, ShieldCheck, Play, ArrowRight, UserCheck } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

// Custom UI Inputs
import Input from "@/components/offer-creation/ui/Input";
import Select from "@/components/offer-creation/ui/Select";
import TextArea from "@/components/offer-creation/ui/TextArea";
import Accordion from "@/components/offer-creation/ui/Accordion";

// Header & Footer Layouts
import OfferHeader from "@/components/offer-creation/layout/OfferHeader";
import StickyFooter from "@/components/offer-creation/layout/StickyFooter";

export default function OfferLifecyclePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ----------------------------------------------------
  // ROLE PERMISSIONS SIMULATOR STATE
  // ----------------------------------------------------
  const [activeRole, setActiveRole] = useState<string>("Account Manager");

  // ----------------------------------------------------
  // ACCORDIONS OPEN/CLOSE STATES
  // ----------------------------------------------------
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pipeline: true,
    view: false,
    auth: true,
    publish: false,
    closure: false,
    extend: false,
  });

  // ----------------------------------------------------
  // WORKFLOW STAGES PROGRESS TIMELINE
  // ----------------------------------------------------
  const workflowStages = ["Pending", "Under Review", "Approved", "Published", "Closed", "Extended"];
  const [currentStage, setCurrentStage] = useState<string>("Under Review");

  // ----------------------------------------------------
  // FORM & METRICS STATE
  // ----------------------------------------------------
  const [formData, setFormData] = useState({
    // Section 1: Approval Pipeline
    accountManager: "Rajesh Kumar",
    offerCode: "OC-2026-0847",
    finalOfferName: "Monsoon Premium Rebate Package",
    finalDofa: "L3 - Vice President Approval Required",
    gmpl: 18.5,
    level: "L3",
    bulkSelection: false,
    totalVolume: 50000,
    totalOfferValue: 200000,
    remarks: "Formulated targeting heavy vehicle key distributors in West region.",

    // Calculated Financial Metrics
    yo: 230000,
    yoPerLtr: 4.6,
    gm: 144000,
    gmPerLtr: 2.88,
    roc: 56000,
    rocPct: 28,
    roacePct: 23.8,

    // Economic Indicators
    ebit: 35000,
    irr: 24,
    irrPct: 24,
    discountedPayback: "14 Months",

    // Section 2: Approval View
    currentApprover: "Suresh Chandra (VP Sales)",
    approvalComments: "Financial KPIs look highly compliant; volume commitments are secured.",

    // Section 3: Approval Authentication
    authOption: "Approve",
    authRemarks: "Recommended for final deployment. Excellent profit margins.",

    // Section 4: Offer Publish
    autoPublish: true,
    wbcNumber: "WBC-2026-9824",
    offerNumber: "OFF-482910",
    customer: "Anand Distributors Pvt Ltd",
    customerType: "Wholesale Dealer",
    offerType: "Volume Payout",
    startDate: "2026-08-01",
    endDate: "2028-08-01",
    effectiveDate: "2026-08-01",
    skuCode: "SKU-8392",
    skuName: "EDGE 5W-40 Synthetic",
    proposedVolume: 50000,

    // Section 5: Offer Closure
    closureAdditionalVolume: 5000,
    closureActualVolume: 48000,
    closurePercentageVolume: 96,
    closureActualGmpl: 19.1,
    closureComments: "Excellent compliance and timely quarterly slab execution.",

    // Section 6: Offer Extend
    extendActualVolume: 48000,
    extendTargetIncentive: 60000,
    extendGmpl: 19.5,
    extendEarlierContract: "Yes",
    extendReason: "Extend rebate contract by 6 months due to customer expansion in Pune area.",
  });

  // ----------------------------------------------------
  // AUTO CALCULATIONS EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    // 1. Pipeline Financial calculations
    const calculatedYo = Number(formData.totalOfferValue || 0) * 1.15;
    const calculatedYoLtr = Number((calculatedYo / (formData.totalVolume || 1)).toFixed(2));
    const calculatedGm = Number(formData.totalOfferValue || 0) * 0.72;
    const calculatedGmLtr = Number((calculatedGm / (formData.totalVolume || 1)).toFixed(2));
    const calculatedRoc = Number(formData.totalOfferValue || 0) * 0.28;
    const calculatedRocPct = Number(formData.totalOfferValue || 1) > 0 ? Math.round((calculatedRoc / Number(formData.totalOfferValue || 1)) * 100) : 0;
    const calculatedRoace = Number((calculatedRocPct * 0.85).toFixed(1));

    // 2. Closure calculations
    // Percentage Volume = Actual Volume / Total Volume Commitment * 100
    const calculatedPercentageVolume = formData.totalVolume > 0 ? Math.round((Number(formData.closureActualVolume || 0) / formData.totalVolume) * 100) : 0;

    // Update state once if any calculated value changes
    if (
      calculatedYo !== formData.yo ||
      calculatedYoLtr !== formData.yoPerLtr ||
      calculatedGm !== formData.gm ||
      calculatedGmLtr !== formData.gmPerLtr ||
      calculatedRoc !== formData.roc ||
      calculatedRocPct !== formData.rocPct ||
      calculatedRoace !== formData.roacePct ||
      calculatedPercentageVolume !== formData.closurePercentageVolume
    ) {
      setFormData((prev) => ({
        ...prev,
        yo: calculatedYo,
        yoPerLtr: calculatedYoLtr,
        gm: calculatedGm,
        gmPerLtr: calculatedGmLtr,
        roc: calculatedRoc,
        rocPct: calculatedRocPct,
        roacePct: calculatedRoace,
        closurePercentageVolume: calculatedPercentageVolume,
      }));
    }
  }, [
    formData.totalOfferValue,
    formData.totalVolume,
    formData.closureActualVolume,
    formData.yo,
    formData.yoPerLtr,
    formData.gm,
    formData.gmPerLtr,
    formData.roc,
    formData.rocPct,
    formData.roacePct,
    formData.closurePercentageVolume,
  ]);

  // Previous approvals log dataset
  const [approvalHistory] = useState([
    { role: "Regional Sales Mgr", comment: "Verified customer credentials. Looks good.", time: "2026-07-15 10:30 AM", status: "Approved" },
    { role: "Finance Auditor", comment: "Calculations validated. Payback terms meet the standard 18-month guideline.", time: "2026-07-16 02:15 PM", status: "Approved" },
    { role: "National Sales Lead", comment: "Pending DOFA VP final approval threshold.", time: "2026-07-17 09:00 AM", status: "Approved" },
  ]);

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAuthAction = (action: string) => {
    if (action === "Approve") {
      setCurrentStage("Approved");
      alert("Offer approved successfully! Updated timeline stage to Approved.");
    } else if (action === "Reject") {
      setCurrentStage("Pending");
      alert("Offer status updated to Rejected. Returned to Pending stage.");
    } else {
      alert("Workflow routed back to Regional Sales Manager.");
    }
  };

  const handleProceed = () => {
    startTransition(() => {
      alert("Offer successfully published and launched! Returning to Dashboard.");
      router.push("/dashboard");
    });
  };

  const handleSaveDraft = () => {
    alert("Draft successfully saved! Your configuration changes have been recorded.");
  };

  const handleCancel = () => {
    startTransition(() => {
      router.push("/offer-creation/sku-incentive");
    });
  };

  // Role permissions helpers
  const isAccountManager = activeRole === "Account Manager";
  const isApprover = activeRole === "Approver";
  const isPublisher = activeRole === "Publisher";
  const isViewer = activeRole === "Viewer";

  return (
    <DashboardShell>
      <div className="pb-32 space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-out]">
        <OfferHeader
          title="Offer Lifecycle"
          offerCode={formData.offerCode}
          totalValue={formData.totalOfferValue}
          onPreviewClick={() => setExpandedSections((prev) => ({ ...prev, view: true }))}
        />

        {/* ROLE SIMULATOR BAR */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-primary shrink-0" />
            <span className="text-sm font-semibold text-brand-dark">
              Simulate Enterprise User Role:
            </span>
          </div>
          <div className="w-full sm:w-64">
            <Select
              options={["Account Manager", "Approver", "Publisher", "Viewer"]}
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
            />
          </div>
        </div>

        {/* TIMELINE PROGRESS COMPONENT */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-5">
            Workflow Progress Timeline
          </h3>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {workflowStages.map((stage, idx) => {
              const isActive = stage === currentStage;
              const isPassed = workflowStages.indexOf(currentStage) >= idx;

              return (
                <React.Fragment key={stage}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-white ring-4 ring-primary/20 scale-110"
                          : isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-brand-gray"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-bold ${isActive ? "text-primary" : "text-brand-dark"}`}>
                        {stage}
                      </p>
                      <p className="text-[10px] text-brand-gray font-semibold uppercase tracking-wider mt-0.5">
                        {isActive ? "Current Stage" : isPassed ? "Completed" : "Scheduled"}
                      </p>
                    </div>
                  </div>
                  {idx < workflowStages.length - 1 && (
                    <div className="hidden md:block flex-1 h-0.5 bg-gray-100 relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                        style={{ width: isPassed ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ==================================================== */}
        {/* VERTICAL ACCORDIONS LIST */}
        {/* ==================================================== */}
        <div className="space-y-4">
          {/* Section 1: Approval Pipeline */}
          <Accordion
            id="pipeline"
            index="01"
            title="Approval Pipeline Details"
            isOpen={expandedSections.pipeline}
            onToggle={() => setExpandedSections((p) => ({ ...p, pipeline: !p.pipeline }))}
          >
            <div className="space-y-6">
              {/* Info headers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Input label="Account Manager" disabled value={formData.accountManager} />
                <Input label="Offer Code" disabled value={formData.offerCode} />
                <Input label="Final Offer Name" disabled value={formData.finalOfferName} />
                <Input label="Final DOFA Threshold" disabled value={formData.finalDofa} />
                <Input label="Level" disabled value={formData.level} />
                <Input label="GMPL" disabled value={`${formData.gmpl}%`} />
                <div className="flex items-center gap-2 px-1">
                  <input
                    type="checkbox"
                    disabled={isViewer}
                    checked={formData.bulkSelection}
                    onChange={(e) => handleFieldChange("bulkSelection", e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-brand-dark">Enable Bulk Selection</span>
                </div>
              </div>

              {/* Financial Metrics */}
              <div>
                <h4 className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                  Calculated Financial Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Input label="Y/O (Rs.)" disabled value={formData.yo} />
                  <Input label="Y/O per Ltr (Rs.)" disabled value={formData.yoPerLtr} />
                  <Input label="GM (Rs.)" disabled value={formData.gm} />
                  <Input label="GM per Ltr (Rs.)" disabled value={formData.gmPerLtr} />
                  <Input label="ROC (Rs.)" disabled value={formData.roc} />
                  <Input label="ROC (%)" disabled value={`${formData.rocPct}%`} />
                  <Input label="ROACE (%)" disabled value={`${formData.roacePct}%`} />
                </div>
              </div>

              {/* Economic Indicators */}
              <div>
                <h4 className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                  Economic Indicators
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Input label="EBIT (Rs.)" disabled value={formData.ebit} />
                  <Input label="IRR" disabled value={formData.irr} />
                  <Input label="IRR (%)" disabled value={`${formData.irrPct}%`} />
                  <Input label="Discounted Payback" disabled value={formData.discountedPayback} />
                </div>
              </div>

              <TextArea
                label="Remarks"
                disabled={isViewer}
                rows={2.5}
                value={formData.remarks}
                onChange={(e) => handleFieldChange("remarks", e.target.value)}
              />
            </div>
          </Accordion>

          {/* Section 2: Approval View */}
          <Accordion
            id="view"
            index="02"
            title="Approval View & Timeline History"
            isOpen={expandedSections.view}
            onToggle={() => setExpandedSections((p) => ({ ...p, view: !p.view }))}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Current Approver Assigned" disabled value={formData.currentApprover} />
                <Input label="Approval Current Status" disabled value={currentStage} />
              </div>

              {/* History Table */}
              <div>
                <h4 className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                  Workflow Log / History
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-gray-50 text-brand-gray font-bold uppercase text-[10px] border-b border-gray-200">
                      <tr>
                        <th className="p-3">Approver / Role</th>
                        <th className="p-3">Remarks / Comments</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Action Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {approvalHistory.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-brand-dark">{row.role}</td>
                          <td className="p-3 text-brand-dark">{row.comment}</td>
                          <td className="p-3 text-brand-gray">{row.time}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Accordion>

          {/* Section 3: Approval Authentication */}
          <Accordion
            id="auth"
            index="03"
            title="Approval Authentication Panel"
            isOpen={expandedSections.auth}
            onToggle={() => setExpandedSections((p) => ({ ...p, auth: !p.auth }))}
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-brand-gray mb-2.5 block">
                  Select Decision Path
                </label>
                <div className="flex flex-wrap items-center gap-4 py-1.5">
                  {["Approve", "Reject", "Edit", "Cancel", "Publish"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer"
                    >
                      <input
                        type="radio"
                        disabled={!isApprover}
                        name="authOption"
                        value={opt}
                        checked={formData.authOption === opt}
                        onChange={(e) => handleFieldChange("authOption", e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 disabled:opacity-50"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <TextArea
                label="Authentication Remarks"
                disabled={!isApprover}
                rows={2.5}
                value={formData.authRemarks}
                onChange={(e) => handleFieldChange("authRemarks", e.target.value)}
              />

              <div className="flex flex-wrap gap-3.5 pt-2">
                <button
                  type="button"
                  disabled={!isApprover}
                  onClick={() => handleAuthAction("Approve")}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition"
                >
                  Approve Offer
                </button>
                <button
                  type="button"
                  disabled={!isApprover}
                  onClick={() => handleAuthAction("Reject")}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition"
                >
                  Reject Offer
                </button>
                <button
                  type="button"
                  disabled={!isApprover}
                  onClick={() => handleAuthAction("Send Back")}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-brand-dark bg-gray-100 hover:bg-gray-250 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm border border-gray-200 transition"
                >
                  Send Back
                </button>
              </div>
            </div>
          </Accordion>

          {/* Section 4: Offer Publish */}
          <Accordion
            id="publish"
            index="04"
            title="Offer Publish Configuration"
            isOpen={expandedSections.publish}
            onToggle={() => setExpandedSections((p) => ({ ...p, publish: !p.publish }))}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 shadow-sm max-w-lg">
                <input
                  type="checkbox"
                  disabled={isViewer}
                  checked={formData.autoPublish}
                  onChange={(e) => handleFieldChange("autoPublish", e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <span className="text-xs font-semibold text-brand-dark">
                  Auto Publish (Automatically publish immediately upon final approval)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="WBC Number" disabled value={formData.wbcNumber} />
                <Input label="Offer Number" disabled value={formData.offerNumber} />
                <Input label="Customer" disabled value={formData.customer} />
                <Input label="Customer Type" disabled value={formData.customerType} />
                <Input label="Offer Type" disabled value={formData.offerType} />
                <Input label="Offer Value (Rs.)" disabled value={formData.totalOfferValue} />
                <Input label="Contract Volume (Ltr)" disabled value={formData.totalVolume} />
                <Input label="Start Date" disabled value={formData.startDate} />
                <Input label="End Date" disabled value={formData.endDate} />

                <Input
                  label="Effective Date *"
                  type="date"
                  disabled={isViewer}
                  value={formData.effectiveDate}
                  onChange={(e) => handleFieldChange("effectiveDate", e.target.value)}
                />

                <Input label="SKU Code" disabled value={formData.skuCode} />
                <Input label="SKU Name" disabled value={formData.skuName} />
                <Input label="Proposed Volume" disabled value={formData.proposedVolume} />
              </div>
            </div>
          </Accordion>

          {/* Section 5: Offer Closure */}
          <Accordion
            id="closure"
            index="05"
            title="Offer Closure Details"
            isOpen={expandedSections.closure}
            onToggle={() => setExpandedSections((p) => ({ ...p, closure: !p.closure }))}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Input label="Proposed Volume (Ltr)" disabled value={formData.proposedVolume} />
                <Input label="Total Contract Volume (Ltr)" disabled value={formData.totalVolume} />

                <Input
                  label="Additional Volume (Ltr) *"
                  type="number"
                  disabled={isViewer}
                  value={formData.closureAdditionalVolume}
                  onChange={(e) => handleFieldChange("closureAdditionalVolume", Number(e.target.value))}
                />

                <Input
                  label="Actual Volume (Ltr) *"
                  type="number"
                  disabled={isViewer}
                  value={formData.closureActualVolume}
                  onChange={(e) => handleFieldChange("closureActualVolume", Number(e.target.value))}
                />

                <Input label="Percentage Volume Completed" disabled value={`${formData.closurePercentageVolume}%`} />

                <Input
                  label="Actual GMPL (%) *"
                  type="number"
                  disabled={isViewer}
                  value={formData.closureActualGmpl}
                  onChange={(e) => handleFieldChange("closureActualGmpl", Number(e.target.value))}
                />
              </div>

              <TextArea
                label="Closure Comments"
                disabled={isViewer}
                rows={2.5}
                value={formData.closureComments}
                onChange={(e) => handleFieldChange("closureComments", e.target.value)}
              />

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  disabled={isViewer}
                  onClick={() => {
                    setCurrentStage("Closed");
                    alert("Closure request submitted for review.");
                  }}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition"
                >
                  Submit Closure
                </button>
                <button
                  type="button"
                  disabled={isViewer}
                  onClick={() => alert("Closure parameters approved.")}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition"
                >
                  Approve Closure
                </button>
                <button
                  type="button"
                  disabled={isViewer}
                  onClick={() => alert("Closure parameters rejected. Returned to under-review status.")}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition"
                >
                  Reject Closure
                </button>
              </div>
            </div>
          </Accordion>

          {/* Section 6: Offer Extend */}
          <Accordion
            id="extend"
            index="06"
            title="Offer Extend Configuration"
            isOpen={expandedSections.extend}
            onToggle={() => setExpandedSections((p) => ({ ...p, extend: !p.extend }))}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="Actual Volume (Ltr) *"
                  type="number"
                  disabled={isViewer}
                  value={formData.extendActualVolume}
                  onChange={(e) => handleFieldChange("extendActualVolume", Number(e.target.value))}
                />

                <Input
                  label="Target Incentive (Rs.) *"
                  type="number"
                  disabled={isViewer}
                  value={formData.extendTargetIncentive}
                  onChange={(e) => handleFieldChange("extendTargetIncentive", Number(e.target.value))}
                />

                <Input
                  label="GMPL (%) *"
                  type="number"
                  disabled={isViewer}
                  value={formData.extendGmpl}
                  onChange={(e) => handleFieldChange("extendGmpl", Number(e.target.value))}
                />

                <div>
                  <label className="text-xs font-semibold text-brand-gray mb-2 block">
                    Earlier Contract *
                  </label>
                  <div className="flex items-center gap-4 py-1.5">
                    <label className="flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer">
                      <input
                        type="radio"
                        disabled={isViewer}
                        name="extendEarlierContract"
                        value="No"
                        checked={formData.extendEarlierContract === "No"}
                        onChange={(e) => handleFieldChange("extendEarlierContract", e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      />
                      No
                    </label>
                    <label className="flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer">
                      <input
                        type="radio"
                        disabled={isViewer}
                        name="extendEarlierContract"
                        value="Yes"
                        checked={formData.extendEarlierContract === "Yes"}
                        onChange={(e) => handleFieldChange("extendEarlierContract", e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      />
                      Yes
                    </label>
                  </div>
                </div>
              </div>

              <TextArea
                label="Reason for Extension *"
                disabled={isViewer}
                rows={2.5}
                value={formData.extendReason}
                onChange={(e) => handleFieldChange("extendReason", e.target.value)}
              />

              <button
                type="button"
                disabled={isViewer}
                onClick={() => {
                  setCurrentStage("Extended");
                  alert("Offer extension completed successfully!");
                }}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition"
              >
                Submit Extension
              </button>
            </div>
          </Accordion>
        </div>
      </div>

      <StickyFooter
        onProceed={handleProceed}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
        isSubmitting={isPending}
        proceedLabel="Save & Publish"
      />
    </DashboardShell>
  );
}
