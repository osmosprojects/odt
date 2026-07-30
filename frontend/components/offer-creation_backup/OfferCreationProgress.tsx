"use client";

import { Check } from "lucide-react";

const parts = [
  { id: 1, title: "Offer Setup", range: "Steps 1–4" },
  { id: 2, title: "Configuration", range: "Steps 5–8" },
  { id: 3, title: "Review & Launch", range: "Steps 9–13" },
];

export default function OfferCreationProgress({
  activePart,
  onSelect,
}: {
  activePart: number;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-3 sm:p-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {parts.map((p) => {
          const isActive = p.id === activePart;
          const isDone = p.id < activePart;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`text-left rounded-xl border px-2.5 py-2.5 sm:px-4 sm:py-3 transition-colors ${
                isActive
                  ? "border-primary bg-primary/5"
                  : isDone
                  ? "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive
                      ? "bg-primary text-white"
                      : isDone
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-brand-gray"
                  }`}
                >
                  {isDone ? <Check size={11} /> : p.id}
                </span>
                <span
                  className={`text-[11px] sm:text-sm font-semibold truncate ${
                    isActive ? "text-primary" : "text-brand-dark"
                  }`}
                >
                  {p.title}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-brand-gray pl-7">
                {p.range}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
