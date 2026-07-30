"use client";

import React from "react";
import Input from "../ui/Input";

interface KerisTvdSectionProps {
  data: {
    kerisCode: string;
    tvdParentId: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

const AutoBadge = () => (
  <span className="text-[9px] font-semibold text-brand-gray bg-gray-100 border border-gray-200 px-1 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
    Auto-populated
  </span>
);

export default function KerisTvdSection({
  data,
  errors,
  onChange,
}: KerisTvdSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-[fadeIn_0.2s_ease-out]">
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <label className="text-xs font-semibold text-brand-gray">KERIS Customer Code</label>
          <AutoBadge />
        </div>
        <Input
          disabled
          readOnly
          value={data.kerisCode}
        />
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <label className="text-xs font-semibold text-brand-gray">TVD Parent ID</label>
          <AutoBadge />
        </div>
        <Input
          disabled
          readOnly
          value={data.tvdParentId}
        />
      </div>
    </div>
  );
}
