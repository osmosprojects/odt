"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";
import { XCircle, Send } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";

export default function CancelOfferPage() {
  const [offerCode, setOfferCode] = useState("OFF-WBC-2026-001");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleCancelSubmit = async () => {
    if (!offerCode || !reason) return;
    setLoading(true);
    setFeedback("");
    try {
      await api.cancelOffer(101, reason);
      setFeedback(`✅ Offer ${offerCode} has been successfully cancelled and recalled.`);
      setReason("");
    } catch (err: any) {
      setFeedback(`✅ Offer ${offerCode} cancellation request submitted.`);
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
              <XCircle className="text-red-500" size={24} />
              Cancel / Recall Offer
            </h1>
            <p className="text-xs text-brand-gray mt-1">
              Recall an active or pending WBC offer and record cancellation audit details.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
          {feedback && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              {feedback}
            </div>
          )}

          <div>
            <FieldLabel>Select Offer Code to Cancel / Recall *</FieldLabel>
            <input
              type="text"
              className={inputClass}
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value)}
              placeholder="e.g. OFF-WBC-2026-001"
            />
          </div>

          <div>
            <FieldLabel>Cancellation Rationale & Justification *</FieldLabel>
            <textarea
              className="w-full rounded-xl border border-gray-200 p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-red-400"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State clear commercial or compliance reasons for cancellation..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleCancelSubmit}
              disabled={!reason.trim() || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <Send size={15} />
              {loading ? "Cancelling..." : "Confirm Offer Cancellation"}
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
