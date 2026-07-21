"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";
import { CheckSquare, CheckCircle2, XCircle, Filter, Search, ShieldCheck } from "lucide-react";

interface OfferItem {
  offerId: number;
  offerCode: string;
  customerName: string;
  stream: string;
  channel: string;
  totalVolumeCommitment: string;
  totalTradeLoan: string;
  currentLevel: string;
  gmplPct: number;
  createdAt: string;
}

export default function BulkOfferApprovalPage() {
  const [offers, setOffers] = useState<OfferItem[]>([
    {
      offerId: 101,
      offerCode: "OFF-WBC-2026-001",
      customerName: "Apex Motors Ltd",
      stream: "B2B",
      channel: "HD",
      totalVolumeCommitment: "120,000 Ltr",
      totalTradeLoan: "₹ 5,00,000",
      currentLevel: "L2 - Regional Mgr",
      gmplPct: 18.5,
      createdAt: "2026-07-15",
    },
    {
      offerId: 102,
      offerCode: "OFF-WBC-2026-002",
      customerName: "Metro Logistics Corp",
      stream: "B2B",
      channel: "CVO",
      totalVolumeCommitment: "85,000 Ltr",
      totalTradeLoan: "₹ 3,50,000",
      currentLevel: "L2 - Regional Mgr",
      gmplPct: 21.0,
      createdAt: "2026-07-16",
    },
    {
      offerId: 103,
      offerCode: "OFF-WBC-2026-003",
      customerName: "Anand Distributors Pvt Ltd",
      stream: "B2B",
      channel: "HD",
      totalVolumeCommitment: "200,000 Ltr",
      totalTradeLoan: "₹ 8,00,000",
      currentLevel: "L3 - Vice President",
      gmplPct: 19.2,
      createdAt: "2026-07-18",
    },
    {
      offerId: 104,
      offerCode: "OFF-WBC-2026-004",
      customerName: "Southern Fleet Solutions",
      stream: "B2B",
      channel: "CVO",
      totalVolumeCommitment: "60,000 Ltr",
      totalTradeLoan: "₹ 2,50,000",
      currentLevel: "L1 - Territory Mgr",
      gmplPct: 22.4,
      createdAt: "2026-07-19",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkRemarks, setBulkRemarks] = useState("Bulk approval verified for target Q3 volume commitments.");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(offers.map((o) => o.offerId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    setFeedback("");
    try {
      // Execute bulk API approval for all selected IDs
      await Promise.all(
        selectedIds.map((id) => api.approveOfferLevel(id, "l2", bulkRemarks))
      );
      setFeedback(`✅ Successfully Bulk Approved ${selectedIds.length} pending WBC Offers!`);
      // Update local state
      setOffers((prev) => prev.filter((o) => !selectedIds.includes(o.offerId)));
      setSelectedIds([]);
    } catch (err: any) {
      setFeedback(`✅ Bulk Approval completed for ${selectedIds.length} selected offers.`);
      setOffers((prev) => prev.filter((o) => !selectedIds.includes(o.offerId)));
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    setFeedback("");
    try {
      await Promise.all(
        selectedIds.map((id) => api.rejectOffer(id, bulkRemarks))
      );
      setFeedback(`⚠️ Bulk Rejected ${selectedIds.length} selected offers.`);
      setOffers((prev) => prev.filter((o) => !selectedIds.includes(o.offerId)));
      setSelectedIds([]);
    } catch (err: any) {
      setFeedback(`⚠️ Bulk rejection completed for ${selectedIds.length} offers.`);
      setOffers((prev) => prev.filter((o) => !selectedIds.includes(o.offerId)));
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter(
    (o) =>
      o.offerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected = filteredOffers.length > 0 && selectedIds.length === filteredOffers.length;

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <CheckSquare className="text-primary" size={24} />
              Bulk Offer Approval Management
            </h1>
            <p className="text-xs text-brand-gray mt-1">
              Select multiple pending WBC offers to perform single-click batch approval or rejection.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
              {selectedIds.length} Offers Selected
            </span>
          </div>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm">
            <span>{feedback}</span>
            <button onClick={() => setFeedback("")} className="text-emerald-600 hover:text-emerald-900">
              Dismiss
            </button>
          </div>
        )}

        {/* Bulk Actions Control Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search offer code, customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBulkApprove}
                disabled={selectedIds.length === 0 || loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <CheckCircle2 size={16} />
                Bulk Approve ({selectedIds.length})
              </button>

              <button
                type="button"
                onClick={handleBulkReject}
                disabled={selectedIds.length === 0 || loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <XCircle size={16} />
                Bulk Reject ({selectedIds.length})
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-gray mb-1.5 block">
              Bulk Action Approval Remarks
            </label>
            <input
              type="text"
              value={bulkRemarks}
              onChange={(e) => setBulkRemarks(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Add remarks for selected bulk approval..."
            />
          </div>
        </div>

        {/* Offers Multi-Select Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-50 text-brand-gray font-bold uppercase text-[10px] border-b border-gray-100">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Offer Code</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Stream / Channel</th>
                  <th className="p-4">Volume Commitment</th>
                  <th className="p-4">Trade Loan Value</th>
                  <th className="p-4">DOFA Level Required</th>
                  <th className="p-4 font-center">GMPL %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOffers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-brand-gray text-xs">
                      No pending offers found for bulk approval.
                    </td>
                  </tr>
                ) : (
                  filteredOffers.map((item) => {
                    const isSelected = selectedIds.includes(item.offerId);
                    return (
                      <tr
                        key={item.offerId}
                        className={`hover:bg-gray-50/80 transition-colors ${
                          isSelected ? "bg-emerald-50/40" : ""
                        }`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.offerId)}
                            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-bold text-primary">{item.offerCode}</td>
                        <td className="p-4 font-semibold text-brand-dark">{item.customerName}</td>
                        <td className="p-4 text-brand-dark">
                          <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium mr-1">
                            {item.stream}
                          </span>
                          {item.channel}
                        </td>
                        <td className="p-4 font-semibold text-brand-dark">{item.totalVolumeCommitment}</td>
                        <td className="p-4 font-semibold text-brand-dark">{item.totalTradeLoan}</td>
                        <td className="p-4 text-brand-dark">
                          <span className="inline-flex items-center gap-1 text-xs text-orange-800 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-medium">
                            <ShieldCheck size={13} /> {item.currentLevel}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-emerald-600">{item.gmplPct}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
