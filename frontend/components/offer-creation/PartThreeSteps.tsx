"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Workflow,
  Rocket,
  Activity,
  Pencil,
  Check,
  Clock,
  UserRound,
} from "lucide-react";
import StepCard, { FieldLabel } from "./StepCard";
import Toggle from "./Toggle";
import OfferLetterDocumentStep from "./OfferLetterDocumentStep";

const reviewRows = [
  { label: "Offer Type", value: "Volume Discount" },
  { label: "Customer Segment", value: "Wholesale" },
  { label: "Products Selected", value: "3 SKUs" },
  { label: "Discount", value: "12% flat, capped at ₹25,000" },
  { label: "Validity", value: "01 Aug – 30 Sep 2026" },
];

const workflowStages = [
  { label: "Submitted", status: "done" as const, owner: "Ken Fernandes" },
  { label: "Manager Review", status: "active" as const, owner: "Regional Sales Head" },
  { label: "Finance Review", status: "pending" as const, owner: "Finance Controller" },
  { label: "Final Approval", status: "pending" as const, owner: "Category Head" },
];

const channels = ["Web Portal", "Mobile App", "Partner Network", "Email Campaign"];
const regions = ["North", "South", "East", "West", "Central"];

export default function PartThreeSteps() {
  const [channelState, setChannelState] = useState<Record<string, boolean>>({
    "Web Portal": true,
    "Mobile App": true,
    "Partner Network": false,
    "Email Campaign": true,
  });
  const [regionState, setRegionState] = useState<Record<string, boolean>>({
    North: true,
    South: false,
    East: true,
    West: true,
    Central: false,
  });

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Steps 9–13 &middot; Review &amp; Launch
        </h2>
        <span className="text-xs text-brand-gray">Part 3 of 3</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Step 9 */}
        <StepCard step={9} title="Review & Submit" icon={ClipboardCheck}>
          <ul className="divide-y divide-gray-100">
            {reviewRows.map((r) => (
              <li key={r.label} className="flex items-center justify-between gap-2 py-2">
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wide text-brand-gray">
                    {r.label}
                  </span>
                  <span className="block text-xs font-medium text-brand-dark truncate">
                    {r.value}
                  </span>
                </span>
                <button
                  aria-label={`Edit ${r.label}`}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:text-primary hover:bg-primary/5"
                >
                  <Pencil size={13} />
                </button>
              </li>
            ))}
          </ul>
        </StepCard>

        {/* Step 10 */}
        <StepCard step={10} title="Approval Workflow" icon={Workflow}>
          <ul className="space-y-3">
            {workflowStages.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      s.status === "done"
                        ? "bg-emerald-500 text-white"
                        : s.status === "active"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-brand-gray"
                    }`}
                  >
                    {s.status === "done" ? (
                      <Check size={13} />
                    ) : s.status === "active" ? (
                      <Clock size={12} />
                    ) : (
                      <UserRound size={12} />
                    )}
                  </span>
                  {i < workflowStages.length - 1 && (
                    <span
                      className={`w-px flex-1 min-h-[14px] ${
                        s.status === "done" ? "bg-emerald-300" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="min-w-0 pb-1">
                  <p className="text-xs font-semibold text-brand-dark">{s.label}</p>
                  <p className="text-[11px] text-brand-gray truncate">{s.owner}</p>
                  <span
                    className={`inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      s.status === "done"
                        ? "bg-emerald-50 text-emerald-600"
                        : s.status === "active"
                        ? "bg-orange-50 text-orange-500"
                        : "bg-gray-100 text-brand-gray"
                    }`}
                  >
                    {s.status === "done"
                      ? "Approved"
                      : s.status === "active"
                      ? "Pending"
                      : "Not Started"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </StepCard>

        {/* Step 11 */}
        <StepCard step={11} title="Publish & Access" icon={Rocket}>
          <div>
            <FieldLabel>Publish Channels</FieldLabel>
            <ul className="space-y-1.5">
              {channels.map((c) => (
                <li
                  key={c}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                >
                  <span className="text-xs font-medium text-brand-dark">{c}</span>
                  <Toggle
                    checked={channelState[c]}
                    onChange={() =>
                      setChannelState((prev) => ({ ...prev, [c]: !prev[c] }))
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <FieldLabel>Region-wise Visibility</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() =>
                    setRegionState((prev) => ({ ...prev, [r]: !prev[r] }))
                  }
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                    regionState[r]
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-gray-200 text-brand-gray hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </StepCard>

        {/* Step 12 */}
        <StepCard step={12} title="Live Monitoring" icon={Activity}>
          <div className="flex items-center gap-1.5 text-[11px] text-brand-gray">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live &middot; updated just now
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-gray-50 px-2.5 py-2 text-center">
              <p className="text-sm font-bold text-brand-dark">1,204</p>
              <p className="text-[10px] text-brand-gray">Views</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-2.5 py-2 text-center">
              <p className="text-sm font-bold text-brand-dark">187</p>
              <p className="text-[10px] text-brand-gray">Redemptions</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-2.5 py-2 text-center">
              <p className="text-sm font-bold text-primary">15.5%</p>
              <p className="text-[10px] text-brand-gray">Conversion</p>
            </div>
          </div>
          <svg viewBox="0 0 200 60" className="w-full h-14" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#0A7D3E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,50 25,42 50,45 75,30 100,33 125,20 150,24 175,10 200,8"
            />
            <polygon
              fill="#0A7D3E"
              opacity="0.08"
              points="0,50 25,42 50,45 75,30 100,33 125,20 150,24 175,10 200,8 200,60 0,60"
            />
          </svg>
        </StepCard>
      </div>
    </div>
  );
}
