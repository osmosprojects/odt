"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  Hash,
  Check,
  X,
  Loader2,
  Building2,
  User2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Customer } from "@/lib/offer-demo/types";
import { searchCustomersApi } from "@/lib/offer-demo/customerApi";

interface SearchCustomerProps {
  selectedCustomer: Customer | null;
  onSelect: (customer: Customer | null) => void;
  error?: string;
}

// Colour map for business stream badges
const STREAM_COLORS: Record<string, string> = {
  WBC: "bg-emerald-100 text-emerald-800 border-emerald-200",
  MCO: "bg-violet-100 text-violet-800 border-violet-200",
  HD: "bg-blue-100 text-blue-800 border-blue-200",
  IWS: "bg-amber-100 text-amber-800 border-amber-200",
  ILS: "bg-orange-100 text-orange-800 border-orange-200",
  CAS: "bg-sky-100 text-sky-800 border-sky-200",
  CASN: "bg-teal-100 text-teal-800 border-teal-200",
};
const streamBadge = (stream: string) =>
  STREAM_COLORS[stream?.toUpperCase()] ?? "bg-gray-100 text-gray-700 border-gray-200";

export default function SearchCustomer({
  selectedCustomer,
  onSelect,
  error,
}: SearchCustomerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Close on outside click ─────────────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Debounced live search ─────────────────────────────────────────────
  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setNoResults(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNoResults(false);
    try {
      const res = await searchCustomersApi(q);
      const data = res.data ?? [];
      setResults(data);
      setNoResults(data.length === 0);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 300);
  };

  // ── Keyboard navigation ───────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      selectCustomer(results[activeIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectCustomer = (customer: Customer) => {
    onSelect(customer);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIdx(-1);
  };

  const clearSelection = () => {
    onSelect(null);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── Selected customer chip ────────────────────────────────────────────
  if (selectedCustomer) {
    const stream = selectedCustomer.businessStream || "";
    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Building2 size={12} /> Selected Customer
        </label>
        <div
          className={`flex items-center justify-between gap-3 p-3 rounded-xl border-2 border-primary/30 bg-emerald-50/60 shadow-sm`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Building2 size={17} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                {selectedCustomer.name}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                {stream && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${streamBadge(stream)}`}
                  >
                    {stream}
                  </span>
                )}
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Hash size={10} />
                  {selectedCustomer.customerCode || selectedCustomer.jdeCode}
                </span>
                {selectedCustomer.state && (
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <MapPin size={10} /> {selectedCustomer.state}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            title="Change customer"
            className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <X size={12} /> Change
          </button>
        </div>
        {error && (
          <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
            <AlertCircle size={11} /> {error}
          </p>
        )}
      </div>
    );
  }

  // ── Search input + dropdown ───────────────────────────────────────────
  const isDropdownOpen = isOpen && (results.length > 0 || loading || noResults);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
        <Building2 size={12} /> Customer Search{" "}
        <span className="text-red-500">*</span>
      </label>

      {/* Search hint tags */}
      <div className="flex flex-wrap gap-1.5 mb-1">
        {["Customer Name", "Customer Code", "Distributor", "JDE Code", "Customer ID"].map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Relative wrapper connecting input and dropdown */}
      <div className="relative w-full">
        {/* Search icon */}
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-primary" />
          ) : (
            <Search size={16} />
          )}
        </span>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            setIsOpen(true);
            if (query.length >= 2) runSearch(query);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full text-sm font-medium text-slate-800 bg-white border-2 pl-10 pr-4 py-3 shadow-sm transition-all
            ${isDropdownOpen
              ? "rounded-t-xl rounded-b-none border-primary ring-2 ring-primary/15 border-b-slate-100"
              : "rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"}
            ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : isDropdownOpen ? "border-primary" : "border-slate-200 hover:border-slate-300"}`}
          placeholder="Type at least 2 characters to search e.g. Balaji, 13303368, WBC..."
          autoComplete="off"
          aria-label="Search customer"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />

        {/* Clear query button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setNoResults(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition z-10"
          >
            <X size={15} />
          </button>
        )}

        {/* Results dropdown attached directly below input */}
        {isDropdownOpen && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-full z-40 w-full bg-white border-2 border-t-0 border-primary rounded-b-xl shadow-2xl overflow-hidden"
            style={{ maxHeight: "320px", overflowY: "auto" }}
          >
            {/* Header bar */}
            <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {loading ? "Searching..." : `${results.length} result${results.length !== 1 ? "s" : ""} found`}
              </span>
              {!loading && results.length > 0 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  ↑↓ navigate · Enter select
                </span>
              )}
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="px-4 py-3 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-100 rounded w-3/4" />
                      <div className="h-2 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results empty state */}
            {!loading && noResults && (
              <div className="px-4 py-6 text-center bg-white">
                <Search size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No matching customers found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Try searching by JDE code, customer name, or distributor
                </p>
              </div>
            )}

            {/* Result rows */}
            {!loading && results.length > 0 && (
              <ul className="divide-y divide-slate-50">
                {results.map((customer, idx) => {
                  const stream = customer.businessStream || "";
                  const isActive = idx === activeIdx;
                  return (
                    <li key={`${customer.id}-${idx}`} role="option" aria-selected={isActive}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => selectCustomer(customer)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                          ${isActive ? "bg-primary/5" : "hover:bg-slate-50"}`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border
                            ${isActive ? "bg-primary/10 border-primary/20" : "bg-slate-100 border-slate-200"}`}
                        >
                          <Building2
                            size={16}
                            className={isActive ? "text-primary" : "text-slate-500"}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-bold text-slate-800 truncate">
                              {customer.name}
                            </span>
                            {stream && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${streamBadge(stream)}`}
                              >
                                {stream}
                              </span>
                            )}
                            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-semibold uppercase shrink-0">
                              {customer.customerType}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Hash size={10} />
                              {customer.customerCode || customer.jdeCode}
                            </span>
                            {customer.distributorName && (
                              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 truncate max-w-[160px]">
                                <User2 size={10} />
                                {customer.distributorName}
                              </span>
                            )}
                            {customer.state && (
                              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                <MapPin size={10} />
                                {customer.state}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight
                          size={14}
                          className={`shrink-0 transition-colors ${isActive ? "text-primary" : "text-slate-300"}`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Footer note */}
            {!loading && results.length >= 25 && (
              <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-4 py-2 text-center">
                <span className="text-[10px] text-slate-400 font-medium">
                  Showing top 25 — refine search query for specific results
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}
