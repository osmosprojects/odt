"use client";

import { useState } from "react";
import { MailPlus, ListChecks, FilePenLine, Landmark } from "lucide-react";
import AddMailerForm from "./AddMailerForm";
import ViewMailerListTable from "./ViewMailerListTable";
import EditMailerForm from "./EditMailerForm";
import MailerMasterUpload from "./MailerMasterUpload";
import { mailers } from "@/lib/mailer";

type Tab = "add" | "view" | "edit" | "master";

const tabs: { id: Tab; label: string; icon: typeof MailPlus }[] = [
  { id: "add", label: "Add New Mailer", icon: MailPlus },
  { id: "view", label: "View Mailer List", icon: ListChecks },
  { id: "edit", label: "Edit Mailer List", icon: FilePenLine },
  { id: "master", label: "Mailer Master Upload", icon: Landmark },
];

export default function MailerManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("view");
  const [editingId, setEditingId] = useState(mailers[0]?.id ?? "");

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

      {activeTab === "add" && <AddMailerForm />}
      {activeTab === "view" && (
        <ViewMailerListTable
          onAddNew={() => setActiveTab("add")}
          onEdit={(id) => {
            setEditingId(id);
            setActiveTab("edit");
          }}
        />
      )}
      {activeTab === "edit" && <EditMailerForm mailerId={editingId} />}
      {activeTab === "master" && <MailerMasterUpload />}
    </div>
  );
}