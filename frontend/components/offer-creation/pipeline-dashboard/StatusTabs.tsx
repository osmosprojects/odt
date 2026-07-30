"use client";

import React from "react";
import { OfferStatus } from "./types";
import { STATUS_OPTIONS } from "./constants";

interface StatusTabsProps {
  activeStatus: OfferStatus;
  onStatusChange: (status: OfferStatus) => void;
  counts: Record<OfferStatus, number>;
}

export default function StatusTabs({
  activeStatus,
  onStatusChange,
  counts,
}: StatusTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-5 select-none">
      {STATUS_OPTIONS.map((opt) => {
        const isActive = activeStatus === opt.value;
        const count = counts[opt.value] || 0;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusChange(opt.value)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 shadow-xs hover:scale-[1.02] active:scale-[0.98]
              ${
                isActive
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-brand-gray border-gray-200 hover:bg-gray-50 hover:text-brand-dark"
              }
            `}
          >
            <span>{opt.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                ${
                  isActive
                    ? "bg-emerald-800/80 text-white"
                    : "bg-gray-100 text-brand-gray"
                }
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
