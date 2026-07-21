"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";
import OfferCreationProgress from "./OfferCreationProgress";
import PartOneSteps from "./PartOneSteps";
import PartTwoSteps from "./PartTwoSteps";
import PartThreeSteps from "./PartThreeSteps";

export default function OfferCreationWizard() {
  const router = useRouter();
  const [part, setPart] = useState(1);

  return (
    <div className="space-y-4 sm:space-y-6">
      <OfferCreationProgress activePart={part} onSelect={setPart} />

      {part === 1 && <PartOneSteps />}
      {part === 2 && <PartTwoSteps />}
      {part === 3 && <PartThreeSteps />}

      <div className="bg-white rounded-card shadow-card border border-gray-100 p-3 sm:p-5 flex items-center justify-between gap-2 sm:gap-3">
        <button
          onClick={() => setPart((p) => Math.max(1, p - 1))}
          disabled={part === 1}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-gray px-3 sm:px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <button className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
          <Save size={15} /> Save as Draft
        </button>

        {part < 3 ? (
          <button
            onClick={() => setPart((p) => Math.min(3, p + 1))}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white bg-primary px-4 sm:px-5 py-2 rounded-lg hover:bg-primary-dark"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => router.push("/offers/view")}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white bg-primary px-4 sm:px-5 py-2 rounded-lg hover:bg-primary-dark"
          >
            <Send size={15} /> Submit Offer
          </button>
        )}
      </div>
    </div>
  );
}
