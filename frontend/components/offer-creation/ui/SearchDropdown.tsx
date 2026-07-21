"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface SearchDropdownProps {
  label?: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SearchDropdown({
  label,
  placeholder = "Search and select...",
  options,
  value,
  onChange,
  error,
  required,
  disabled = false,
}: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="w-full flex flex-col relative" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold text-brand-gray mb-1.5 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-lg border text-sm px-3 py-2 outline-none transition-all text-left bg-white
          ${error ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"}
          ${disabled ? "bg-gray-100 text-brand-gray/80 cursor-not-allowed border-gray-200" : "cursor-pointer"}
        `}
      >
        <span className={`block truncate ${!value ? "text-gray-400" : "text-brand-dark font-medium"}`}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0 text-brand-gray">
          {value && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-gray-100 hover:text-brand-dark transition"
              title="Clear selection"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "transform rotate-180 text-primary" : ""}`}
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-gray-150 flex items-center gap-2 bg-gray-50/50">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to filter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-brand-dark placeholder:text-gray-400 outline-none border-none p-1"
            />
          </div>

          <div className="flex-1 overflow-y-auto thin-scroll py-1 max-h-44">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt === value;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors
                      ${
                        isSelected
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-brand-dark hover:bg-gray-50"
                      }
                    `}
                  >
                    <span className="truncate">{opt}</span>
                    {isSelected && <Check size={14} className="text-primary shrink-0" />}
                  </button>
                );
              })
            ) : (
              <p className="text-center py-4 text-xs text-brand-gray font-medium">
                No matches found
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <span className="text-[11px] font-medium text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
