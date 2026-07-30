"use client";

import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-150 rounded-2xl shadow-xs">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3 border border-gray-200">
        <Inbox size={20} />
      </div>
      <h3 className="text-sm font-bold text-brand-dark">No offers found</h3>
      <p className="text-xs text-brand-gray mt-1 max-w-xs font-semibold">
        Try adjusting your query or status tabs to view other B2B agreement pipeline offers.
      </p>
    </div>
  );
}
