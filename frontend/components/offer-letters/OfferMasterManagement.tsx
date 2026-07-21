"use client";

import { useState } from "react";
import { FilePlus2, ListChecks, FilePenLine } from "lucide-react";
import OfferMasterUpload from "./OfferMasterUpload";
import ViewOfferMastersTable from "./ViewOfferMastersTable";
import EditOfferMasterForm from "./EditOfferMasterForm";
import { offerMasters } from "@/lib/offerLetters";

type SubTab = "add" | "view" | "edit";

const subTabs: { id: SubTab; label: string; icon: typeof FilePlus2 }[] = [
  { id: "add", label: "Add Offer Master", icon: FilePlus2 },
  { id: "view", label: "View Offer Masters", icon: ListChecks },
  { id: "edit", label: "Edit Offer Master", icon: FilePenLine },
];

export default function OfferMasterManagement() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("view");
  const [editingId, setEditingId] = useState(offerMasters[0]?.id ?? "");

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-1.5 flex gap-1.5 overflow-x-auto w-fit">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-white text-primary shadow-sm"
                  : "text-brand-gray hover:text-brand-dark"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeSubTab === "add" && <OfferMasterUpload />}
      {activeSubTab === "view" && (
        <ViewOfferMastersTable
          onAddNew={() => setActiveSubTab("add")}
          onEdit={(id) => {
            setEditingId(id);
            setActiveSubTab("edit");
          }}
        />
      )}
      {activeSubTab === "edit" && (
        <EditOfferMasterForm offerMasterId={editingId} />
      )}
    </div>
  );
}