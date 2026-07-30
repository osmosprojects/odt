"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/DashboardShell";
import BreadcrumbHeader from "@/components/offer-creation/BreadcrumbHeader";
import ModeSelection from "@/components/offer-creation/ModeSelection";
import DashboardBanner from "@/components/offer-creation/pipeline-dashboard/DashboardBanner";
import StatusTabs from "@/components/offer-creation/pipeline-dashboard/StatusTabs";
import SearchBar from "@/components/offer-creation/pipeline-dashboard/SearchBar";
import EmptyState from "@/components/offer-creation/pipeline-dashboard/EmptyState";
import OfferTable from "@/components/offer-creation/pipeline-dashboard/OfferTable";
import PipelineSidebar from "@/components/offer-creation/pipeline-dashboard/PipelineSidebar";
import { OfferStatus, PipelineOffer } from "@/components/offer-creation/pipeline-dashboard/types";
import { mockOffers } from "@/components/offer-creation/pipeline-dashboard/data";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PipelineDashboardPage() {
  const router = useRouter();

  // ----------------------------------------------------
  // FILTER & DATA STATES
  // ----------------------------------------------------
  const [activeStatus, setActiveStatus] = useState<OfferStatus>("Draft");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<PipelineOffer[]>(mockOffers);

  // Modals state
  const [selectedOffer, setSelectedOffer] = useState<PipelineOffer | null>(null);
  const [modalType, setModalType] = useState<"view" | "delete" | "reject" | null>(null);

  // Fetch live offers from NestJS backend API
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    setLoading(true);
    fetch(`${API_BASE}/offers/pipeline`)
      .then((res) => res.json())
      .then((res) => {
        const liveOffers = res.data || res;
        if (Array.isArray(liveOffers) && liveOffers.length > 0) {
          setOffers(liveOffers);
        }
      })
      .catch((err) => console.error("Error loading pipeline offers:", err))
      .finally(() => setLoading(false));
  }, []);

  // Compute status counts
  const getStatusCounts = () => {
    const counts: Record<OfferStatus, number> = {
      Draft: 0,
      "Pending Approval": 0,
      Published: 0,
      "Closed / Closure": 0,
      Cancelled: 0,
    };
    offers.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });
    return counts;
  };

  // Filtered dataset
  const filteredOffers = offers.filter((o) => {
    const statusMatch = o.status === activeStatus;
    const queryMatch = 
      o.offerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && queryMatch;
  });

  // Action Handlers
  const handleView = (offer: PipelineOffer) => {
    setSelectedOffer(offer);
    setModalType("view");
  };

  const handleEdit = (offer: PipelineOffer) => {
    // Navigate directly into the Offer Creation Workspace with template parameter
    const targetId = (offer as any).id || offer.offerCode;
    router.push(`/offer-creation-demo?templateOfferId=${targetId}`);
  };

  const handleReject = (offer: PipelineOffer) => {
    setSelectedOffer(offer);
    setModalType("reject");
  };

  const handleDelete = (offer: PipelineOffer) => {
    setSelectedOffer(offer);
    setModalType("delete");
  };

  const confirmDelete = () => {
    alert(`Draft Offer ${selectedOffer?.offerCode} deleted successfully!`);
    setModalType(null);
    setSelectedOffer(null);
  };

  const confirmReject = () => {
    alert(`Offer Approval for ${selectedOffer?.offerCode} rejected successfully!`);
    setModalType(null);
    setSelectedOffer(null);
  };

  return (
    <DashboardShell>
      <PipelineSidebar>
        <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">
          <BreadcrumbHeader
            items={[
              { label: "Home", href: "/" },
              { label: "Offer Operations", href: "/offer-operations" },
              { label: "WBC Offer Pipeline", active: true }
            ]}
            showDate={true}
          />
          <ModeSelection activeTab="pipeline" />
          <DashboardBanner />

          {/* Table Filters & Control row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <StatusTabs
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
              counts={getStatusCounts()}
            />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Table grid wrapper */}
          {filteredOffers.length === 0 && !loading ? (
            <EmptyState />
          ) : (
            <OfferTable
              offers={filteredOffers}
              loading={loading}
              onView={handleView}
              onEdit={handleEdit}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          )}
        </div>
      </PipelineSidebar>

      {/* Confirmation Modals */}
      {modalType === "delete" && selectedOffer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-150 text-center space-y-4">
            <span className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-100">
              <AlertTriangle size={24} />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-brand-dark">Delete Draft Offer?</h3>
              <p className="text-xs text-brand-gray font-semibold">
                Are you sure you want to delete the draft contract <strong>{selectedOffer.offerCode}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={() => setModalType(null)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-brand-dark text-xs font-bold py-2.5 rounded-xl transition">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "reject" && selectedOffer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-150 text-center space-y-4">
            <span className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mx-auto border border-orange-100">
              <AlertTriangle size={24} />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-brand-dark">Reject Offer Approval?</h3>
              <p className="text-xs text-brand-gray font-semibold">
                Rejecting approval request for <strong>{selectedOffer.offerCode}</strong> will return the B2B proposal to draft stage. Confirm rejection?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={() => setModalType(null)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-brand-dark text-xs font-bold py-2.5 rounded-xl transition">
                Cancel
              </button>
              <button type="button" onClick={confirmReject} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View details summary modal */}
      {modalType === "view" && selectedOffer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-150 space-y-4 relative">
            <button type="button" onClick={() => setModalType(null)} className="absolute right-4 top-4 text-brand-gray hover:text-brand-dark">
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <CheckCircle2 className="text-primary" size={18} />
              <h3 className="text-sm font-bold text-brand-dark">Offer Details Summary</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">Offer Code</span>
                <span className="font-bold text-brand-dark">{selectedOffer.offerCode}</span>
              </div>
              <div>
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">Status</span>
                <span className="font-bold text-primary">{selectedOffer.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">Customer Name</span>
                <span className="font-bold text-brand-dark">{selectedOffer.customerName}</span>
              </div>
              <div>
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">Segment</span>
                <span className="font-bold text-brand-dark">{selectedOffer.segment}</span>
              </div>
              <div>
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">DOFA Authority</span>
                <span className="font-bold text-brand-dark">{selectedOffer.dofaApproval}</span>
              </div>
              <div>
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">Committed Volume</span>
                <span className="font-bold text-brand-dark">{selectedOffer.committedVol.toLocaleString()} Litres</span>
              </div>
              <div>
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">Total Investment</span>
                <span className="font-bold text-brand-dark">₹{selectedOffer.totalInvestment.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">Average GMPL</span>
                <span className="font-black text-primary">₹{selectedOffer.avgGmpl.toFixed(1)}/Ltr</span>
              </div>
              <div>
                <span className="text-brand-gray font-semibold block text-[10px] uppercase">WBC Contract Period</span>
                <span className="font-bold text-brand-dark">{selectedOffer.wbcPeriod.startMonth} - {selectedOffer.wbcPeriod.endMonth}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button type="button" onClick={() => setModalType(null)} className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-xl transition">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
