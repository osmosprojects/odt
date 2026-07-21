"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  ListChecks,
  TrendingUp,
  FileCheck2,
  Check,
  Plus,
} from "lucide-react";
import StepCard, { FieldLabel, inputClass } from "./StepCard";
import Toggle from "./Toggle";

const clauses = [
  "Offer valid for one-time redemption only",
  "Cannot be combined with other promotional schemes",
  "Subject to stock availability at the time of redemption",
  "Company reserves the right to modify or withdraw the offer",
];

const budgetSplit = [
  { region: "North", value: 32 },
  { region: "West", value: 24 },
  { region: "East", value: 21 },
  { region: "South", value: 23 },
];

export default function PartTwoSteps() {
  const [tieredSlabs, setTieredSlabs] = useState(true);
  const [stacking, setStacking] = useState(false);
  const [acceptedClauses, setAcceptedClauses] = useState<Record<string, boolean>>({
    "Offer valid for one-time redemption only": true,
    "Cannot be combined with other promotional schemes": true,
    "Subject to stock availability at the time of redemption": true,
    "Company reserves the right to modify or withdraw the offer": false,
  });

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Steps 5–8 &middot; Configuration
        </h2>
        <span className="text-xs text-brand-gray">Part 2 of 3</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Step 5 */}
        <StepCard step={5} title="Scheme Configuration" icon={SlidersHorizontal}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Discount Type</FieldLabel>
              <select className={inputClass} defaultValue="Flat Amount">
                <option>Percentage</option>
                <option>Flat Amount</option>
                <option>Tiered Slab</option>
              </select>
            </div>
            <div>
              <FieldLabel>Discount Value</FieldLabel>
              <div className="relative">
                <input
                  type="number"
                  defaultValue={12}
                  className={`${inputClass} pr-7`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-gray">
                  %
                </span>
              </div>
            </div>
          </div>
          <div>
            <FieldLabel>Maximum Discount Cap (₹)</FieldLabel>
            <input type="number" defaultValue={25000} className={inputClass} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
            <span className="text-xs font-medium text-brand-dark">
              Enable tiered quantity slabs
            </span>
            <Toggle checked={tieredSlabs} onChange={() => setTieredSlabs((v) => !v)} />
          </div>
        </StepCard>

        {/* Step 6 */}
        <StepCard step={6} title="Business Rules" icon={ListChecks}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Min. Order Quantity</FieldLabel>
              <input type="number" defaultValue={50} className={inputClass} />
            </div>
            <div>
              <FieldLabel>Max Discount / Customer</FieldLabel>
              <input type="number" defaultValue={40000} className={inputClass} />
            </div>
          </div>
          <div>
            <FieldLabel>Rule Priority</FieldLabel>
            <select className={inputClass} defaultValue="High">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
            <span className="text-xs font-medium text-brand-dark">
              Allow stacking with other offers
            </span>
            <Toggle checked={stacking} onChange={() => setStacking((v) => !v)} />
          </div>
        </StepCard>

        {/* Step 7 */}
        <StepCard step={7} title="Financial Impact" icon={TrendingUp}>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-gray-50 px-2.5 py-2 text-center">
              <p className="text-sm font-bold text-brand-dark">₹12.4L</p>
              <p className="text-[10px] text-brand-gray">Est. Budget</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-2.5 py-2 text-center">
              <p className="text-sm font-bold text-brand-dark">18.6%</p>
              <p className="text-[10px] text-brand-gray">Proj. Margin</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-2.5 py-2 text-center">
              <p className="text-sm font-bold text-primary">3.2x</p>
              <p className="text-[10px] text-brand-gray">Exp. ROI</p>
            </div>
          </div>
          <div>
            <FieldLabel>Budget Allocation by Region</FieldLabel>
            <div className="space-y-1.5">
              {budgetSplit.map((r) => (
                <div key={r.region} className="flex items-center gap-2">
                  <span className="w-11 text-[11px] text-brand-gray shrink-0">
                    {r.region}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                  <span className="w-8 text-[11px] text-brand-dark font-medium text-right">
                    {r.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StepCard>

        {/* Step 8 */}
        <StepCard step={8} title="Terms & Conditions" icon={FileCheck2}>
          <ul className="space-y-1.5">
            {clauses.map((c) => (
              <li key={c}>
                <button
                  onClick={() =>
                    setAcceptedClauses((prev) => ({ ...prev, [c]: !prev[c] }))
                  }
                  className="w-full flex items-start gap-2 text-left rounded-lg px-2 py-1.5 hover:bg-gray-50"
                >
                  <span
                    className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 border ${
                      acceptedClauses[c]
                        ? "bg-primary border-primary text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {acceptedClauses[c] && <Check size={11} />}
                  </span>
                  <span className="text-xs text-brand-dark leading-snug">{c}</span>
                </button>
              </li>
            ))}
          </ul>
          <button className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-primary border border-dashed border-primary/40 rounded-lg py-2 hover:bg-primary/5">
            <Plus size={13} /> Add Custom Clause
          </button>
        </StepCard>
      </div>
    </div>
  );
}
