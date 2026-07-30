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
    <footer className="fixed bottom-0 left-0 right-0 lg:left-64 z-30 bg-white border-t border-gray-200 px-4 py-3.5 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] transition-all duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4.5 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-brand-gray hover:text-brand-red border border-gray-200 hover:border-red-200 rounded-xl hover:bg-red-50/50 transition-all duration-200"
          >
            <X size={15} />
            <span>Cancel</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onSaveDraft}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-brand-gray hover:text-brand-dark bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-all duration-200"
          >
            <Save size={15} className="text-brand-gray" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={onProceed}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all duration-200"
          >
            <Send size={15} />
            <span>{isSubmitting ? "Submitting..." : proceedLabel}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
