import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import EditOfferLetterForm from "@/components/offer-letters/EditOfferLetterForm";
import OfferTabs from "@/components/offer-letters/OfferTabs";
import { offerLetters } from "@/lib/offerLetters";

export default function EditOfferPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const offerLetterId = searchParams.id ?? offerLetters[0].id;

  return (
    <DashboardShell>
      <OfferTabs />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Link
            href="/offers/view"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-gray hover:text-primary mb-1"
          >
            <ArrowLeft size={13} /> Back to Offers
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
            Edit Offer
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray">
            Update offer letter details, documents, and approval mail copy.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <EditOfferLetterForm offerLetterId={offerLetterId} />
      </div>
    </DashboardShell>
  );
}
