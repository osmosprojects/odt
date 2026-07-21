"use client";

import React from "react";
import { FileText, Landmark } from "lucide-react";

interface OfferHeaderProps {
  title?: string;
  offerCode: string;
  totalValue: number;
  onPreviewClick: () => void;
}

export default function OfferHeader({
  title = "Offer Creation",
  offerCode = "OC-2026-0847",
  totalValue = 0,
  onPreviewClick,
}: OfferHeaderProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <header className="sticky top-[64px] z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 py-3.5 px-1 sm:px-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-dark flex items-center gap-2">
            {title}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Draft
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-brand-gray">
            <span className="font-medium">{offerCode}</span>
            <span className="text-gray-300 font-normal">|</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto Saved
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3.5">
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shrink-0">
            <Landmark size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
              Est. Deal Value
            </p>
            <p className="text-sm sm:text-base font-bold text-brand-dark">
              {formatCurrency(totalValue)}
            </p>
          </div>
        </div>

        <button
          onClick={onPreviewClick}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-gray hover:text-brand-dark bg-white hover:bg-gray-50 border border-gray-200 px-3.5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200"
        >
          <FileText size={16} className="text-brand-gray" />
          <span>Preview Summary</span>
        </button>
      </div>
    </header>
  );
}
