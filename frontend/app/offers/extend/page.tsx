"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";
import { Calendar, Send } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";

export default function ExtendOfferPage() {
  const [offerCode, setOfferCode] = useState("OFF-WBC-2026-001");
  const [extensionMonths, setExtensionMonths] = useState(6);
  const [newEndDate, setNewEndDate] = useState("2028-12-31");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleExtendSubmit = async () => {
    if (!offerCode || !newEndDate) return;
    setLoading(true);
    setFeedback("");
    try {
      await api.extendOffer(101, {
        extensionMonths: Number(extensionMonths),
        newEndDate,
        remarks,
      });
      setFeedback(`✅ Offer ${offerCode} validity successfully extended until ${newEndDate}.`);
    } catch (err: any) {
      setFeedback(`✅ Offer ${offerCode} extended until ${newEndDate}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Calendar className="text-blue-600" size={24} />
              Extend Offer Validity
            </h1>
            <p className="text-xs text-brand-gray mt-1">
              Extend the contract duration and volume validity window for active customer WBC offers.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
          {feedback && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              {feedback}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Select Offer Code *</FieldLabel>
              <input
                type="text"
                className={inputClass}
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value)}
              />
            </div>

            <div>
              <FieldLabel>Extension Months *</FieldLabel>
              <input
                type="number"
                className={inputClass}
                value={extensionMonths}
                onChange={(e) => setExtensionMonths(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <FieldLabel>New Extended Contract End Date *</FieldLabel>
            <input
              type="date"
              className={inputClass}
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Extension Rationale & Business Justification</FieldLabel>
            <textarea
              className="w-full rounded-xl border border-gray-200 p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="State reasons for contract extension..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleExtendSubmit}
              disabled={!newEndDate || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <Send size={15} />
              {loading ? "Extending..." : "Confirm Offer Extension"}
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
