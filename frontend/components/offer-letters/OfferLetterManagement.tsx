"use client";

import { useState } from "react";
import { FilePlus2, ListChecks, FilePenLine, Landmark } from "lucide-react";
import AddOfferLetterForm from "./AddOfferLetterForm";
import ViewOfferLettersTable from "./ViewOfferLettersTable";
import EditOfferLetterForm from "./EditOfferLetterForm";
import OfferMasterManagement from "./OfferMasterManagement";

type Tab = "add" | "view" | "edit" | "master";

const tabs: { id: Tab; label: string; icon: typeof FilePlus2 }[] = [
  { id: "add", label: "Add Offer Letter", icon: FilePlus2 },
  { id: "view", label: "View Offer Letters", icon: ListChecks },
  { id: "edit", label: "Edit Offer Letter", icon: FilePenLine },
  { id: "master", label: "Offer Master", icon: Landmark },
];

export default function OfferLetterManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("view");
  const [editingId, setEditingId] = useState("OL-2026-0142");

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

      {activeTab === "add" && <AddOfferLetterForm />}
      {activeTab === "view" && (
        <ViewOfferLettersTable
          onAddNew={() => setActiveTab("add")}
          onEdit={(id) => {
            setEditingId(id);
            setActiveTab("edit");
          }}
        />
      )}
      {activeTab === "edit" && <EditOfferLetterForm offerLetterId={editingId} />}
      {activeTab === "master" && <OfferMasterManagement />}
    </div>
  );
}