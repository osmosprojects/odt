"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  prefixText?: string;
  suffixText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, prefixText, suffixText, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col">
        {label && (
          <label className="text-xs font-semibold text-brand-gray mb-1.5 block">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixText && (
            <span className="absolute left-3 text-xs font-semibold text-brand-gray pointer-events-none select-none">
              {prefixText}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full rounded-lg border text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-brand-dark placeholder:text-gray-400 bg-white transition-all
              ${prefixText ? "pl-8" : ""}
              ${suffixText ? "pr-8" : ""}
              ${error ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-gray-200"}
              ${
                props.disabled || props.readOnly
                  ? "bg-gray-100 text-brand-gray/80 cursor-not-allowed border-gray-200"
                  : "bg-white"
              }
              ${className}
            `}
            {...props}
          />
          {suffixText && (
            <span className="absolute right-3 text-xs font-semibold text-brand-gray pointer-events-none select-none">
              {suffixText}
            </span>
          )}
        </div>
        {error && (
          <span className="text-[11px] font-medium text-red-500 mt-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
