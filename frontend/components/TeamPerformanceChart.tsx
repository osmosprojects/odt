"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { teamPerformance } from "@/lib/data";

export default function TeamPerformanceChart() {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-brand-dark">
          My Team Performance{" "}
          <span className="text-xs font-normal text-brand-gray">
            (This Month)
          </span>
        </h2>
        <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-brand-gray outline-none">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={teamPerformance} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis
              dataKey="region"
              tick={{ fontSize: 11, fill: "#6C757D" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6C757D" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              cursor={{ fill: "rgba(10,125,62,0.06)" }}
            />
            <Bar dataKey="target" fill="#D1FAE5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="achievement" fill="#0A7D3E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-2 text-xs text-brand-gray">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Achievement
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100" /> Target
        </span>
      </div>
    </div>
  );
}
