"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  offerPerformance,
  topOffersByVolume,
  totalVolumeKL,
} from "@/lib/reportsAnalytics";

export default function OfferPerformanceOverview() {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-brand-dark mb-3">
            Offer Performance Overview
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={offerPerformance} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#6C757D" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: "#6C757D" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  cursor={{ fill: "rgba(10,125,62,0.06)" }}
                  formatter={(v: number) => [`${v}%`, "Performance"]}
                />
                <Bar dataKey="value" fill="#0A7D3E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut + legend */}
        <div>
          <h2 className="font-semibold text-brand-dark mb-3">Top Offer by Volume</h2>
          <div className="flex items-center gap-4">
            <div className="relative h-28 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topOffersByVolume}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={34}
                    outerRadius={52}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {topOffersByVolume.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-bold text-brand-dark">
                  {totalVolumeKL} KL
                </span>
                <span className="text-[10px] text-brand-gray text-center leading-tight">
                  Total Volume
                </span>
              </div>
            </div>

            <ul className="space-y-1.5 flex-1 min-w-0">
              {topOffersByVolume.map((entry) => (
                <li
                  key={entry.label}
                  className="flex items-center gap-1.5 text-xs text-brand-gray"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-brand-dark font-medium truncate">
                    {entry.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link
          href="/reports-analytics/all"
          className="text-xs font-medium text-primary hover:underline"
        >
          View All Reports
        </Link>
      </div>
    </div>
  );
}
