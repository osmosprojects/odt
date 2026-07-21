"use client";
import DashboardShell from "@/components/DashboardShell";
import ViewOfferLettersTable from "@/components/offer-letters/ViewOfferLettersTable";
import OfferTabs from "@/components/offer-letters/OfferTabs";

export default function ViewOffersPage() {
  const handleEdit = (id: string) => {
    // Handle edit logic
  };

  const handleAddNew = () => {
    // Handle add new logic
  };

  return (
    <DashboardShell>
      <OfferTabs />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
            View Offers
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray">
            Browse, filter, and manage all offer letters across CASH Loan,
            CASN and IWS schemes.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <ViewOfferLettersTable onEdit={handleEdit} onAddNew={handleAddNew} />
      </div>
    </DashboardShell>
  );
}
