import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import DollarUpdateManagement from "@/components/dollar-update/DollarUpdateManagement";

export default function DollarUpdatePage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
            Dollar Update
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray">
            Add and review dollar conversion rates under Offer Management.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <Suspense fallback={null}>
          <DollarUpdateManagement />
        </Suspense>
      </div>
    </DashboardShell>
  );
}