"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col">
        {label && (
          <label className="text-xs font-semibold text-brand-gray mb-1.5 block">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full rounded-lg border text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-brand-dark placeholder:text-gray-400 transition-all resize-none
            ${error ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-gray-200"}
            ${
              props.disabled
                ? "bg-gray-100 text-brand-gray/80 cursor-not-allowed border-gray-200"
                : "bg-white"
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-[11px] font-medium text-red-500 mt-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
export default TextArea;
