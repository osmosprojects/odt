"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardBanner() {
  const router = useRouter();

  const handleCreateOffer = () => {
    // Navigate to the existing single-page workspace route
    router.push("/offer-creation-demo");
  };

  return (
    <div className="bg-gradient-to-r from-[#0C7A43] to-[#0A6235] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md mb-6 transition-all duration-300 hover:shadow-lg">
      <div className="space-y-1.5 max-w-xl">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
          WBC Offer Pipeline Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 font-medium">
          Manage volume commitment agreements, review margins, and process approval flows.
        </p>
      </div>

      <button
        type="button"
        onClick={handleCreateOffer}
        className="inline-flex items-center gap-2 bg-white text-primary hover:bg-emerald-50 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl transition-all duration-200 shadow-md hover:scale-[1.03] active:scale-[0.97]"
      >
        <Plus size={16} className="stroke-[3]" /> Create New Offer
      </button>
    </div>
  );
}
