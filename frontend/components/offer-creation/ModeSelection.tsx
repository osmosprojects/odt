"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ModeSelectionProps {
  activeTab: "pipeline" | "workspace";
}

export default function ModeSelection({ activeTab }: ModeSelectionProps) {
  const router = useRouter();

  const handleToggle = (tab: "pipeline" | "workspace") => {
    if (tab === activeTab) return;
    if (tab === "pipeline") {
      router.push("/offer-creation/pipeline-dashboard");
    } else {
      router.push("/offer-creation-demo");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none min-h-[90px]">
      {/* Left side: Accent bar and title */}
      <div className="flex items-center gap-3">
        <span className="w-[6px] h-[36px] bg-[#0C7A43] rounded-full shrink-0" />
        <h2 className="text-[28px] font-black text-[#0a2540] tracking-tight uppercase leading-none">
          Mode Selection:
        </h2>
      </div>

      {/* Right side: Segmented controller */}
      <div className="bg-gray-100 p-1 rounded-full flex items-center shadow-inner self-end md:self-auto w-full md:w-auto max-w-sm">
        <button
          type="button"
          onClick={() => handleToggle("pipeline")}
          className={`flex-1 md:flex-initial text-center text-xs font-black px-5 py-2.5 rounded-full transition-all duration-200 h-[40px] flex items-center justify-center whitespace-nowrap
            ${
              activeTab === "pipeline"
                ? "bg-[#0C7A43] text-white shadow-md hover:scale-[1.02]"
                : "bg-transparent text-gray-600 hover:bg-[#0C7A43]/10 hover:text-[#0C7A43]"
            }
          `}
        >
          Pipeline Dashboard
        </button>
        <button
          type="button"
          onClick={() => handleToggle("workspace")}
          className={`flex-1 md:flex-initial text-center text-xs font-black px-5 py-2.5 rounded-full transition-all duration-200 h-[40px] flex items-center justify-center whitespace-nowrap
            ${
              activeTab === "workspace"
                ? "bg-[#0C7A43] text-white shadow-md hover:scale-[1.02]"
                : "bg-transparent text-gray-600 hover:bg-[#0C7A43]/10 hover:text-[#0C7A43]"
            }
          `}
        >
          Workspace (New Offer)
        </button>
      </div>
    </div>
  );
}
