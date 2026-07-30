"use client";

import React, { useState } from "react";
import { editOfferApi, extendOfferApi } from "@/lib/offer-demo/customerApi";
import { FileText, Clock, AlertCircle, CheckCircle, RefreshCw, Calendar, ArrowRight } from "lucide-react";

export interface CustomerOfferHistoryProps {
  customerCode: string;
  customerName?: string;
  offers?: any;
  loading?: boolean;
  error?: string | null;
  onChange: (field: any, value: any) => void;
  onRefreshOffers?: () => void;
}

export default function CustomerOfferHistory({
  customerCode,
  customerName,
  offers = null,
  loading = false,
  error = null,
  onChange,
  onRefreshOffers,
}: CustomerOfferHistoryProps) {
  const [activeTab, setActiveTab] = useState<"active" | "expired" | "extended" | "pending">("active");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const data = offers;

  const handleExtend = async (offer: any) => {
    setActionMessage(`Extending contract for ${offer.offerCode}...`);
    try {
      const res = await extendOfferApi({ offerId: offer.offerId, additionalMonths: 6 });
      setActionMessage(res.message || `Extended ${offer.offerCode} by 6 months`);
      if (onRefreshOffers) {
        onRefreshOffers();
      }
    } catch {
      setActionMessage("Extension failed. Please try again.");
    }
  };

  const handleEdit = (offer: any) => {
    onChange("editingOfferId", offer.offerId);
    onChange("creationType", "Copy/Edit");
    setActionMessage(`Loaded offer ${offer.offerCode} for editing.`);
  };

  if (loading) {
    return (
      <div className="border border-slate-150 rounded-xl p-4 bg-white flex items-center gap-2 text-xs text-slate-500">
        <RefreshCw size={14} className="animate-spin text-primary" /> Loading customer offer history...
      </div>
    );
  }

  if (!data) return null;

  const getList = () => {
    switch (activeTab) {
      case "active":
        return data.activeOffers || [];
      case "expired":
        return data.expiredOffers || [];
      case "extended":
        return data.extendedOffers || [];
      case "pending":
        return data.pendingOffers || [];
      default:
        return [];
    }
  };

  const currentList = getList();

  return (
    <div className="border border-slate-150 rounded-xl p-4 sm:p-5 space-y-4 bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Customer Offer History &amp; Status
          </h4>
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {data.totalCount || 0} Total
          </span>
        </div>

        {/* Action message banner */}
        {actionMessage && (
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            {actionMessage}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "active"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Active ({data.activeOffers?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("expired")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "expired"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Expired ({data.expiredOffers?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("extended")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "extended"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Extended ({data.extendedOffers?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            activeTab === "pending"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Pending / Draft ({data.pendingOffers?.length || 0})
        </button>
      </div>

      {/* List Table */}
      {currentList.length === 0 ? (
        <div className="text-xs text-slate-400 italic py-4 text-center">
          No {activeTab} offers found for this customer.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2 px-3">Offer Code</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Start Date</th>
                <th className="py-2 px-3">End Date</th>
                <th className="py-2 px-3">Volume Commitment</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {currentList.map((o: any) => (
                <tr key={o.offerId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-primary">{o.offerCode}</td>
                  <td className="py-2.5 px-3">{o.offerType}</td>
                  <td className="py-2.5 px-3">{o.startDate || "N/A"}</td>
                  <td className="py-2.5 px-3">{o.effectiveEndDate || o.endDate || "N/A"}</td>
                  <td className="py-2.5 px-3">{o.volumeCommitment} KL</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        onChange("templateOfferId", o.offerId);
                        onChange("editingOfferId", o.offerId);
                        onChange("offerCreationType", "Copy/Edit");
                        setActionMessage(`Loaded template from offer ${o.offerCode}. Form pre-filled!`);
                      }}
                      className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Use as Template
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(o)}
                      className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExtend(o)}
                      className="text-xs font-semibold px-2 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      Extend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
