"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { offersOverview, totalOffers } from "@/lib/data";

export default function OffersOverview() {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-brand-dark">Offers Overview</h2>
        <button className="text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="h-40 w-40 relative shrink-0 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={offersOverview}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                stroke="none"
              >
                {offersOverview.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-brand-dark">
              {totalOffers}
            </span>
            <span className="text-[10px] text-brand-gray">Total Offers</span>
          </div>
        </div>

        <ul className="space-y-2 text-xs w-full">
          {offersOverview.map((o) => {
            const pct = Math.round((o.value / totalOffers) * 100);
            return (
              <li key={o.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-brand-gray">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: o.color }}
                  />
                  {o.name}
                </span>
                <span className="font-medium text-brand-dark">
                  {o.value} ({pct}%)
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
