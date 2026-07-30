"use client";

import React from "react";
import TextArea from "../ui/TextArea";

interface CompetitorOfferSectionProps {
  data: {
    competitorDetails: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export default function CompetitorOfferSection({
  data,
  errors,
  onChange,
}: CompetitorOfferSectionProps) {
  return (
    <div className="w-full">
      <TextArea
        label="Main Competitor Offer Details *"
        rows={4}
        placeholder="Detail competitor schemes, rebates, or marketing investments..."
        value={data.competitorDetails}
        onChange={(e) => onChange("competitorDetails", e.target.value)}
        error={errors.competitorDetails}
        required
      />
    </div>
  );
}
