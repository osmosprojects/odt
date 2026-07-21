"use client";

import React from "react";
import { Save, Send, X } from "lucide-react";

interface StickyFooterProps {
  onProceed: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  proceedLabel?: string;
}

export default function StickyFooter({
  onProceed,
  onSaveDraft,
  onCancel,
  isSubmitting = false,
  proceedLabel = "Proceed",
}: StickyFooterProps) {
  return (
    <footer className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:bottom-0 left-0 right-0 lg:left-64 z-30 bg-white border-t border-gray-200 px-4 py-3.5 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-stretch justify-between gap-3">
        {/* Left column: Cancel + Save Draft */}
        <div className="flex items-stretch gap-2 sm:gap-2.5 flex-1 sm:flex-initial">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4.5 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-brand-gray hover:text-brand-red border border-gray-200 hover:border-red-200 rounded-xl hover:bg-red-50/50 transition-all duration-200"
          >
            <X size={15} className="shrink-0" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4.5 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-brand-gray hover:text-brand-dark bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-all duration-200"
          >
            <Save size={15} className="shrink-0 text-brand-gray" />
            <span>Save Draft</span>
          </button>
        </div>

        {/* Right column: Submit/Proceed */}
        <div className="flex-[1.3] sm:flex-initial flex">
          <button
            type="button"
            onClick={onProceed}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all duration-200 text-center leading-snug"
          >
            <Send size={15} className="shrink-0" />
            <span>{isSubmitting ? "Submitting..." : proceedLabel}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}