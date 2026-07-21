import DashboardShell from "@/components/DashboardShell";
import OfferCreationWizard from "@/components/offer-creation/OfferCreationWizard";

export default function CreateOfferPage() {
  return (
    <DashboardShell>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
            Create New Offer
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray">
            Set up a new customer offer end-to-end — from configuration
            through approval and launch.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          Draft &middot; Offer ID OC-2026-0847
        </span>
      </div>

      <div className="mt-4 sm:mt-6">
        <OfferCreationWizard />
      </div>
    </DashboardShell>
  );
}
