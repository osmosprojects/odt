"use client";

import React from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";

interface SalesRemarksSectionProps {
  data: {
    whyInvest: string;
    associatedWithCastrol: string;
    significanceWithCastrol: string;
    upTradingOpportunities: string;
    risksToVolume: string;
    mitigationToRisk: string;
    groupBelongsTo: string;
    otherQualitativeInfo: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export default function SalesRemarksSection({
  data,
  errors,
  onChange,
}: SalesRemarksSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-4">
        <TextArea
          label="Why should we invest *"
          rows={3}
          placeholder="Strategic justification for this offer..."
          value={data.whyInvest}
          onChange={(e) => onChange("whyInvest", e.target.value)}
          error={errors.whyInvest}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Associated with Castrol"
            options={["Yes", "No"]}
            value={data.associatedWithCastrol}
            onChange={(e) => onChange("associatedWithCastrol", e.target.value)}
          />
          <Input
            label="Group Belongs To"
            placeholder="Parent Group / Conglomerate"
            value={data.groupBelongsTo}
            onChange={(e) => onChange("groupBelongsTo", e.target.value)}
          />
        </div>

        <TextArea
          label="Significance with Castrol"
          rows={3}
          placeholder="Historical importance to Castrol..."
          value={data.significanceWithCastrol}
          onChange={(e) => onChange("significanceWithCastrol", e.target.value)}
        />

        <TextArea
          label="Up Trading Opportunities"
          rows={3}
          placeholder="Cross-selling premium synthetics..."
          value={data.upTradingOpportunities}
          onChange={(e) => onChange("upTradingOpportunities", e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <TextArea
          label="Risk to Volume *"
          rows={3}
          placeholder="Identify potential volume risks..."
          value={data.risksToVolume}
          onChange={(e) => onChange("risksToVolume", e.target.value)}
          error={errors.risksToVolume}
          required
        />

        <TextArea
          label="Mitigation to Risk *"
          rows={3}
          placeholder="Detail action plan to mitigate volume risks..."
          value={data.mitigationToRisk}
          onChange={(e) => onChange("mitigationToRisk", e.target.value)}
          error={errors.mitigationToRisk}
          required
        />

        <TextArea
          label="Other Qualitative Information"
          rows={3.5}
          placeholder="Any other comments or context for approvers..."
          value={data.otherQualitativeInfo}
          onChange={(e) => onChange("otherQualitativeInfo", e.target.value)}
        />
      </div>
    </div>
  );
}
