import DashboardShell from "@/components/DashboardShell";
import OfferLetterManagement from "@/components/offer-letters/OfferLetterManagement";

export default function OfferLetterManagementPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
            Offer Letter Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray">
            Create, review, and manage offer letters across CASH Loan, CASN
            and IWS schemes.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <OfferLetterManagement />
      </div>
    </DashboardShell>
  );
}
