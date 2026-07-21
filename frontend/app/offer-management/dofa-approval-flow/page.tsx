import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import DofaApprovalManagement from "@/components/dofa-approval/DofaApprovalManagement";

export default function DofaApprovalFlowPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
            DOFA Approval Flow
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray">
            Set up, review, and edit delegation-of-financial-authority
            matrices under Offer Management.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <Suspense fallback={null}>
          <DofaApprovalManagement />
        </Suspense>
      </div>
    </DashboardShell>
  );
}