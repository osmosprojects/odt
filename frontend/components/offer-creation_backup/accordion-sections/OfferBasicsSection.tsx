"use client";

import React from "react";
import Select from "../ui/Select";
import Input from "../ui/Input";

interface OfferBasicsSectionProps {
  data: {
    offerStream: string;
    offerCreationType: string;
    dollarValue: number;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

const AutoBadge = () => (
  <span className="text-[9px] font-semibold text-brand-gray bg-gray-100 border border-gray-200 px-1 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
    Auto-populated
  </span>
);

export default function OfferBasicsSection({
  data,
  errors,
  onChange,
}: OfferBasicsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-[fadeIn_0.2s_ease-out]">
      <Select
        label="Offer Stream *"
        options={["HD", "ILS", "WS", "IWS", "CASN", "Add Stream"]}
        value={data.offerStream}
        onChange={(e) => onChange("offerStream", e.target.value)}
        error={errors.offerStream}
        required
      />

      <Select
        label="Offer Creation Type *"
        options={["New Offer", "Copy Offer", "Dummy Offer"]}
        value={data.offerCreationType}
        onChange={(e) => onChange("offerCreationType", e.target.value)}
        error={errors.offerCreationType}
        required
      />

      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <label className="text-xs font-semibold text-brand-gray">Current Dollar Value</label>
          <AutoBadge />
        </div>
        <Input
          disabled
          readOnly
          prefixText="₹"
          value={data.dollarValue}
        />
      </div>
    </div>
  );
}
