"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingCustomerData() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-sm font-semibold text-brand-dark">
        Loading Customer Segment Data...
      </p>
    </div>
  );
}
