"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm ml-auto">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">
        <Search size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by customer or code..."
        className="w-full text-xs font-semibold text-brand-dark bg-white border border-gray-200 rounded-xl pl-9.5 pr-4 py-2.5 outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-xs transition-all placeholder:text-gray-400"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-gray hover:text-brand-dark"
        >
          Clear
        </button>
      )}
    </div>
  );
}
