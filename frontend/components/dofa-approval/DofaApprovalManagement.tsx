"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { GitBranch, ListChecks, FilePenLine } from "lucide-react";
import AddDofaFlowForm from "./AddDofaFlowForm";
import ViewDofaApprovalListTable from "./ViewDofaApprovalListTable";
import EditDofaMatrixForm from "./EditDofaMatrixForm";
import { dofaMatrices } from "@/lib/offerManagement";

type Tab = "add" | "view" | "edit";

const tabs: { id: Tab; label: string; icon: typeof GitBranch }[] = [
  { id: "add", label: "Add DOFA Flow", icon: GitBranch },
  { id: "view", label: "View DOFA Approval List", icon: ListChecks },
  { id: "edit", label: "Edit DOFA Matrix", icon: FilePenLine },
];

function isTab(value: string | null): value is Tab {
  return value === "add" || value === "view" || value === "edit";
}

export default function DofaApprovalManagement() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tab>(
    isTab(initialTab) ? initialTab : "view"
  );
  const [editingId, setEditingId] = useState(dofaMatrices[0]?.id ?? "");

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

      {activeTab === "add" && <AddDofaFlowForm />}
      {activeTab === "view" && (
        <ViewDofaApprovalListTable
          onAddNew={() => setActiveTab("add")}
          onEdit={(id) => {
            setEditingId(id);
            setActiveTab("edit");
          }}
        />
      )}
      {activeTab === "edit" && <EditDofaMatrixForm matrixId={editingId} />}
    </div>
  );
}