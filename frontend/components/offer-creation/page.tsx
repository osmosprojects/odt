"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfferCreationIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/offer-creation/customer-data");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-sm font-medium text-brand-gray animate-pulse">
        Redirecting to Customer Data...
      </p>
    </div>
  );
}
