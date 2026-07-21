"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";
import { GitBranch, CheckCircle2, Clock, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

export default function OfferPipelineS2Page() {
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPipelineS2()
      .then((res) => {
        setPipelineData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <GitBranch className="text-primary" size={24} />
              Offer Approval Pipeline Stage 2 (DOFA Financial Evaluation)
            </h1>
            <p className="text-xs text-brand-gray mt-1">
              Stage 2 DOFA matrix limit validations, financial payback metrics, and multi-level manager approvals.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Stage 2 Pipeline
          </span>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Active Stage 2 Offers</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">12 Offers</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ 4 Pending DOFA L2</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Avg. Payback Period</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">14.2 Months</p>
            <p className="text-[11px] text-brand-gray font-medium mt-1">Compliant (&lt; 18 Months)</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Total Stage 2 Deal Value</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">₹ 2.45 Cr</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">85% B2B Volume Share</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">Avg. ROACE %</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">24.5%</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">+2.1% above target</p>
          </div>
        </div>

        {/* Pipeline S2 Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-dark">Stage 2 Offers Queue</h3>
            <span className="text-xs text-brand-gray">Active Review Queue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-50 text-brand-gray font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Offer Code</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Current Approver</th>
                  <th className="p-3.5">Volume Commitment</th>
                  <th className="p-3.5">Trade Loan Value</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-bold text-primary">OFF-WBC-2026-001</td>
                  <td className="p-3.5 font-semibold text-brand-dark">Apex Motors Ltd</td>
                  <td className="p-3.5 text-brand-dark flex items-center gap-1.5">
                    <UserCheck size={14} className="text-primary" /> L2 - Regional Mgr
                  </td>
                  <td className="p-3.5 text-brand-dark font-medium">120,000 Ltr</td>
                  <td className="p-3.5 text-brand-dark font-medium">₹ 5,00,000</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                      Pending Approval
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <a href="/offers/bulk-approval" className="text-xs font-semibold text-primary hover:underline">
                      Review & Approve →
                    </a>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-bold text-primary">OFF-WBC-2026-002</td>
                  <td className="p-3.5 font-semibold text-brand-dark">Metro Logistics Corp</td>
                  <td className="p-3.5 text-brand-dark flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Fully Approved
                  </td>
                  <td className="p-3.5 text-brand-dark font-medium">85,000 Ltr</td>
                  <td className="p-3.5 text-brand-dark font-medium">₹ 3,50,000</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      Approved
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <a href="/offers/bulk-approval" className="text-xs font-semibold text-primary hover:underline">
                      View Details →
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
