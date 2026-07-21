"use client";

import { useState } from "react";
import { UploadCloud, FileUp, ListChecks } from "lucide-react";
import UploadMasterForm from "./UploadMasterForm";
import UploadMasterTypeFileForm from "./UploadMasterTypeFileForm";
import ViewMasterListTable from "./ViewMasterListTable";

type Tab = "uploadMaster" | "uploadMasterTypeFile" | "viewMasterList";

const tabs: { id: Tab; label: string; icon: typeof UploadCloud }[] = [
  { id: "uploadMaster", label: "Upload Master", icon: UploadCloud },
  { id: "uploadMasterTypeFile", label: "Upload Master Type File", icon: FileUp },
  { id: "viewMasterList", label: "View Master List", icon: ListChecks },
];

export default function InputManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("uploadMaster");

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

      {activeTab === "uploadMaster" && <UploadMasterForm />}
      {activeTab === "uploadMasterTypeFile" && <UploadMasterTypeFileForm />}
      {activeTab === "viewMasterList" && (
        <ViewMasterListTable
          onEdit={() => setActiveTab("uploadMasterTypeFile")}
        />
      )}
    </div>
  );
}