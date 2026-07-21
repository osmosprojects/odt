"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DollarSign, List } from "lucide-react";
import NewDollarForm from "./NewDollarForm";
import DollarListTable from "./DollarListTable";

type Tab = "new" | "list";

const tabs: { id: Tab; label: string; icon: typeof DollarSign }[] = [
  { id: "new", label: "New Dollar", icon: DollarSign },
  { id: "list", label: "Dollar List", icon: List },
];

function isTab(value: string | null): value is Tab {
  return value === "new" || value === "list";
}

export default function DollarUpdateManagement() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tab>(
    isTab(initialTab) ? initialTab : "list"
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-card shadow-card border border-gray-100 p-1.5 sm:p-2 flex gap-1.5 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-brand-gray hover:bg-gray-50 hover:text-brand-dark"
              }`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "new" && <NewDollarForm />}
      {activeTab === "list" && (
        <DollarListTable onAddNew={() => setActiveTab("new")} />
      )}
    </div>
  );
}