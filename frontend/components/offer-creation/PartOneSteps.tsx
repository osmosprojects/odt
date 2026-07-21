"use client";

import { useState } from "react";
import {
  Tag,
  FileText,
  Users,
  Package,
  Percent,
  Layers,
  Boxes,
  CalendarRange,
  Gift,
  Handshake,
  Check,
  Search,
} from "lucide-react";
import StepCard, { FieldLabel, inputClass } from "./StepCard";

const offerTypes = [
  { label: "Cash Discount", icon: Percent },
  { label: "Volume Discount", icon: Layers },
  { label: "Bundle Offer", icon: Boxes },
  { label: "Seasonal Offer", icon: CalendarRange },
  { label: "Loyalty Reward", icon: Gift },
  { label: "Trade Scheme", icon: Handshake },
];

const eligibilityCriteria = [
  "Minimum 6 months purchase history",
  "KYC verified account",
  "Active credit line with no overdue",
  "Region matches offer zone",
];

const products = [
  { name: "Castrol GTX 5W-30 (4L)", sku: "CTL-GTX-530-4L" },
  { name: "Castrol Magnatec 10W-40 (4L)", sku: "CTL-MAG-1040-4L" },
  { name: "Castrol EDGE 0W-20 (4L)", sku: "CTL-EDG-020-4L" },
  { name: "Castrol CRB Turbomax 15W-40", sku: "CTL-CRB-1540-20L" },
];

export default function PartOneSteps() {
  const [selectedType, setSelectedType] = useState("Volume Discount");
  const [criteria, setCriteria] = useState<Record<string, boolean>>({
    "Minimum 6 months purchase history": true,
    "KYC verified account": true,
    "Active credit line with no overdue": false,
    "Region matches offer zone": true,
  });
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({
    "Castrol GTX 5W-30 (4L)": true,
    "Castrol Magnatec 10W-40 (4L)": true,
    "Castrol EDGE 0W-20 (4L)": false,
    "Castrol CRB Turbomax 15W-40": true,
  });

  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Steps 1–4 &middot; Offer Setup
        </h2>
        <span className="text-xs text-brand-gray">Part 1 of 3</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Step 1 */}
        <StepCard step={1} title="Select Offer Type" icon={Tag}>
          <div className="grid grid-cols-2 gap-2">
            {offerTypes.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedType === t.label;
              return (
                <button
                  key={t.label}
                  onClick={() => setSelectedType(t.label)}
                  className={`flex flex-col items-start gap-1.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isSelected ? "text-primary" : "text-brand-gray"}
                  />
                  <span
                    className={`text-xs font-medium leading-tight ${
                      isSelected ? "text-primary" : "text-brand-dark"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </StepCard>

        {/* Step 2 */}
        <StepCard step={2} title="Basic Information" icon={FileText}>
          <div>
            <FieldLabel>Offer Name</FieldLabel>
            <input
              type="text"
              defaultValue="Monsoon Fleet Volume Booster"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Offer Code</FieldLabel>
              <input
                type="text"
                disabled
                value="AUTO-OC-2026-0847"
                className={`${inputClass} bg-gray-50 text-brand-gray cursor-not-allowed`}
              />
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <select className={inputClass} defaultValue="Lubricants">
                <option>Lubricants</option>
                <option>Fleet Services</option>
                <option>Industrial</option>
                <option>Retail Fuel Additives</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Valid From</FieldLabel>
              <input type="date" defaultValue="2026-08-01" className={inputClass} />
            </div>
            <div>
              <FieldLabel>Valid To</FieldLabel>
              <input type="date" defaultValue="2026-09-30" className={inputClass} />
            </div>
          </div>
        </StepCard>

        {/* Step 3 */}
        <StepCard step={3} title="Customer Eligibility" icon={Users}>
          <div>
            <FieldLabel>Customer Segment</FieldLabel>
            <select className={inputClass} defaultValue="Wholesale">
              <option>Retail</option>
              <option>Wholesale</option>
              <option>Fleet Operator</option>
              <option>Distributor</option>
            </select>
          </div>
          <div>
            <FieldLabel>Eligibility Criteria</FieldLabel>
            <ul className="space-y-1.5">
              {eligibilityCriteria.map((c) => (
                <li key={c}>
                  <button
                    onClick={() =>
                      setCriteria((prev) => ({ ...prev, [c]: !prev[c] }))
                    }
                    className="w-full flex items-center gap-2 text-left rounded-lg px-2 py-1.5 hover:bg-gray-50"
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        criteria[c]
                          ? "bg-primary border-primary text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {criteria[c] && <Check size={11} />}
                    </span>
                    <span className="text-xs text-brand-dark">{c}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </StepCard>

        {/* Step 4 */}
        <StepCard step={4} title="Product Selection" icon={Package}>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search SKU or product name..."
              className={`${inputClass} pl-8`}
            />
          </div>
          <ul className="space-y-1.5">
            {products.map((p) => (
              <li key={p.sku}>
                <button
                  onClick={() =>
                    setSelectedProducts((prev) => ({
                      ...prev,
                      [p.name]: !prev[p.name],
                    }))
                  }
                  className="w-full flex items-center gap-2.5 text-left rounded-lg px-2 py-1.5 hover:bg-gray-50"
                >
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      selectedProducts[p.name]
                        ? "bg-primary border-primary text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedProducts[p.name] && <Check size={11} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-brand-dark truncate">
                      {p.name}
                    </span>
                    <span className="block text-[10px] text-brand-gray truncate">
                      {p.sku}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-brand-gray pt-1 border-t border-gray-100">
            {selectedCount} of {products.length} products selected
          </p>
        </StepCard>
      </div>
    </div>
  );
}
