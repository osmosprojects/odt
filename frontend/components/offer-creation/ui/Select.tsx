"use client";

import React, { SelectHTMLAttributes, forwardRef } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { label: string; value: string }[] | string[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col">
        {label && (
          <label className="text-xs font-semibold text-brand-gray mb-1.5 block">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full rounded-lg border text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-brand-dark bg-white transition-all
            ${error ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-gray-200"}
            ${
              props.disabled
                ? "bg-gray-100 text-brand-gray/80 cursor-not-allowed border-gray-200"
                : "bg-white"
            }
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => {
            const labelStr = typeof opt === "string" ? opt : opt.label;
            const valStr = typeof opt === "string" ? opt : opt.value;
            return (
              <option key={valStr} value={valStr}>
                {labelStr}
              </option>
            );
          })}
        </select>
        {error && (
          <span className="text-[11px] font-medium text-red-500 mt-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
