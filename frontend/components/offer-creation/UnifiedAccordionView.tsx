"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Save,
  Send,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  Layers,
} from "lucide-react";
import PartOneSteps from "./PartOneSteps";
import PartTwoSteps from "./PartTwoSteps";
import PartThreeSteps from "./PartThreeSteps";

export default function UnifiedAccordionView() {
  const router = useRouter();

  // Accordion toggle states for all 3 master sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    part1: true,
    part2: false,
    part3: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    setOpenSections({ part1: true, part2: true, part3: true });
  };

  const collapseAll = () => {
    setOpenSections({ part1: false, part2: false, part3: false });
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      showNotification("Draft saved successfully to backend!");
    }, 800);
  };

  const handleSubmitOffer = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showNotification("Offer submitted successfully for DOFA approval!");
      setTimeout(() => router.push("/offers/view"), 1200);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-24 animate-[fadeIn_0.25s_ease-out]">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-[slideDown_0.2s_ease-out]">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles size={18} />
            </span>
            <h1 className="text-xl font-bold text-brand-dark tracking-tight">
              Offer Creation & Master Configuration
            </h1>
          </div>
          <p className="text-xs text-brand-gray mt-1">
            Complete all 3 parts below using the expandable dropdown accordions.
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={expandAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg transition"
          >
            <Layers size={14} /> Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gray bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ACCORDION 1: PART 1 - CUSTOMER DATA & OFFER BASICS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection("part1")}
          className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between border-b border-gray-150 hover:bg-gray-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
              01
            </span>
            <div>
              <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Part 1 &middot; Customer Data &amp; Offer Basics
              </h2>
              <p className="text-[11px] text-brand-gray mt-0.5">
                Offer stream, customer JDE code, Turfview number, past performance &amp; GST verification.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Steps 1–4
            </span>
            {openSections.part1 ? (
              <ChevronUp size={20} className="text-primary" />
            ) : (
              <ChevronDown size={20} className="text-brand-gray" />
            )}
          </div>
        </button>

        {openSections.part1 && (
          <div className="p-6 bg-white animate-[slideDown_0.2s_ease-out]">
            <PartOneSteps />
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ACCORDION 2: PART 2 - INVESTMENT & SALES STRATEGIC REMARKS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection("part2")}
          className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between border-b border-gray-150 hover:bg-gray-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
              02
            </span>
            <div>
              <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                Part 2 &middot; Investment Details &amp; Sales Strategic Remarks
              </h2>
              <p className="text-[11px] text-brand-gray mt-0.5">
                Competitor offers, AR/SEOL investment, sign-on bonus, strategic justification &amp; volume risk mitigation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Steps 5–8
            </span>
            {openSections.part2 ? (
              <ChevronUp size={20} className="text-primary" />
            ) : (
              <ChevronDown size={20} className="text-brand-gray" />
            )}
          </div>
        </button>

        {openSections.part2 && (
          <div className="p-6 bg-white animate-[slideDown_0.2s_ease-out]">
            <PartTwoSteps />
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ACCORDION 3: PART 3 - SKU INCENTIVE POOL & SUMMARY BREAKDOWN */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection("part3")}
          className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between border-b border-gray-150 hover:bg-gray-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
              03
            </span>
            <div>
              <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Part 3 &middot; SKU Incentive Pool &amp; Totals Breakdown
              </h2>
              <p className="text-[11px] text-brand-gray mt-0.5">
                SKU incentive table, product disbursement schedule, total FOC value &amp; DOFA approval matrix.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Steps 9–13
            </span>
            {openSections.part3 ? (
              <ChevronUp size={20} className="text-primary" />
            ) : (
              <ChevronDown size={20} className="text-brand-gray" />
            )}
          </div>
        </button>

        {openSections.part3 && (
          <div className="p-6 bg-white animate-[slideDown_0.2s_ease-out]">
            <PartThreeSteps />
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* STICKY ACTION FOOTER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-6 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-brand-dark">
            Master Accordion View &middot; All 3 Parts Enabled
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gray bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition disabled:opacity-50"
          >
            <Save size={15} />
            {isSavingDraft ? "Saving Draft..." : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={handleSubmitOffer}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark px-5 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
          >
            <Send size={15} />
            {isSubmitting ? "Submitting..." : "Submit Offer for Approval"}
          </button>
        </div>
      </div>
    </div>
  );
}
