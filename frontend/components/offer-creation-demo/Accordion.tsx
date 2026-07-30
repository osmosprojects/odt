"use client";

import React from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

interface AccordionProps {
  id: string;
  index: string;
  title: string;
  icon?: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  requiredFieldsMissing?: boolean;
  subtitle?: string;
  badge?: string;
}

export default function Accordion({
  id,
  index,
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  requiredFieldsMissing = false,
  subtitle,
  badge,
}: AccordionProps) {
  return (
    <div
      id={`accordion-section-${id}`}
      className={`bg-white rounded-[14px] border transition-all duration-200 shadow-sm
        ${
          isOpen
            ? "border-primary/40 ring-1 ring-primary/10 shadow-md"
            : "border-slate-200 hover:border-slate-300"
        }
        ${requiredFieldsMissing ? "border-amber-300 ring-1 ring-amber-100" : ""}
      `}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${id}`}
        id={`accordion-header-${id}`}
        className="w-full flex items-center justify-between p-[20px] text-left focus:outline-none select-none group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <span
            className={`w-7 h-7 rounded-[8px] text-[12px] font-bold flex items-center justify-center shrink-0 border transition-colors
              ${
                isOpen
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-slate-50 text-slate-500 border-slate-200 group-hover:bg-slate-100"
              }
            `}
          >
            {index}
          </span>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              {Icon && (
                <Icon
                  size={18}
                  className={`shrink-0 transition-colors ${isOpen ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`}
                />
              )}
              <h3
                className={`text-[18px] font-semibold tracking-tight truncate transition-colors duration-200
                  ${isOpen ? "text-slate-900" : "text-slate-800 group-hover:text-slate-900"}
                `}
              >
                {title}
              </h3>
              {badge && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 shrink-0 ml-1">
                  {badge}
                </span>
              )}
              {requiredFieldsMissing && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-1">
                  Incomplete
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[12px] text-slate-500 font-normal mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            size={20}
            className={`text-slate-400 transition-transform duration-300 shrink-0
              ${isOpen ? "transform rotate-180 text-primary" : "group-hover:text-slate-600"}
            `}
          />
        </div>
      </button>

      <div
        id={`accordion-panel-${id}`}
        aria-labelledby={`accordion-header-${id}`}
        role="region"
        className={`transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden pointer-events-none"}
        `}
      >
        <div className="px-[20px] pb-[20px] pt-2 border-t border-slate-100 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

