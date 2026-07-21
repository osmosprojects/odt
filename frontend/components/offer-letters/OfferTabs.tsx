"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus2, Table2, PencilLine } from "lucide-react";

const tabs = [
  { label: "Create", href: "/offers/create", icon: FilePlus2 },
  { label: "View", href: "/offers/view", icon: Table2 },
  { label: "Edit", href: "/offers/edit", icon: PencilLine },
];

export default function OfferTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 w-fit">
      {tabs.map((tab) => {
        const isActive = pathname?.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
            ${
              isActive
                ? "bg-primary text-white"
                : "text-brand-gray hover:bg-gray-50 hover:text-brand-dark"
            }`}
          >
            <Icon size={15} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
