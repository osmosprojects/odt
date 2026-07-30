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
}: AccordionProps) {
  return (
    <div
      id={`accordion-section-${id}`}
      className={`bg-white rounded-xl border transition-all duration-300 shadow-sm
        ${
          isOpen
            ? "border-primary/40 ring-1 ring-primary/10 shadow-md"
            : "border-gray-200 hover:border-gray-300"
        }
        ${requiredFieldsMissing ? "border-red-300 ring-1 ring-red-100" : ""}
      `}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${id}`}
        id={`accordion-header-${id}`}
        className="w-full flex items-center justify-between px-4 py-4.5 sm:px-5 sm:py-5 text-left focus:outline-none select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 border
              ${
                isOpen
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 text-brand-gray border-gray-200"
              }
            `}
          >
            {index}
          </span>

          <div className="flex items-center gap-2 min-w-0">
            {Icon && (
              <Icon
                size={18}
                className={`shrink-0 ${isOpen ? "text-primary" : "text-brand-gray"}`}
              />
            )}
            <h3
              className={`text-sm sm:text-base font-bold truncate transition-colors duration-200
                ${isOpen ? "text-brand-dark" : "text-brand-dark/95"}
              `}
            >
              {title}
            </h3>
            {requiredFieldsMissing && (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse shrink-0 ml-1">
                Required Info Missing
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`text-brand-gray transition-transform duration-300 shrink-0
            ${isOpen ? "transform rotate-180 text-primary" : ""}
          `}
        />
      </button>

      <div
        id={`accordion-panel-${id}`}
        aria-labelledby={`accordion-header-${id}`}
        role="region"
        className={`transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-gray-100 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
