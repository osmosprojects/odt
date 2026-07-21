"use client";

import React from "react";
import DashboardShell from "@/components/DashboardShell";
import { Award, FileText, CheckCircle, ArrowRight, Upload } from "lucide-react";

export default function OfferPipelineS3Page() {
  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Award className="text-primary" size={24} />
              Offer Approval Pipeline Stage 3 (Final Release & Letter Publishing)
            </h1>
            <p className="text-xs text-brand-gray mt-1">
              Final Commercial Letter publication, legal review, and customer acceptance sign-off.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Stage 3 Release
          </span>
        </div>

        {/* Stage 3 Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Letters Pending Release</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">5 Offers</p>
            <p className="text-xs text-brand-gray mt-1">Ready for PDF Publishing</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Published Today</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">8 Letters</p>
            <p className="text-xs text-brand-gray mt-1">Sent to Customer Mailbox</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Customer Sign-off Rate</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">94.5%</p>
            <p className="text-xs text-emerald-600 mt-1">High Acceptance Rate</p>
          </div>
        </div>

        {/* Stage 3 Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-dark">Stage 3 Release Queue</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-50 text-brand-gray font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">WBC Number</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Effective Date</th>
                  <th className="p-3.5">Offer Letter PDF</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-bold text-primary">WBC-2026-9824</td>
                  <td className="p-3.5 font-semibold text-brand-dark">Anand Distributors Pvt Ltd</td>
                  <td className="p-3.5 text-brand-dark">HD (Heavy Duty)</td>
                  <td className="p-3.5 text-brand-dark">2026-08-01</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
                      <FileText size={13} /> Generated
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <a href="/offer-letters" className="text-xs font-semibold text-primary hover:underline">
                      Publish & Release →
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
