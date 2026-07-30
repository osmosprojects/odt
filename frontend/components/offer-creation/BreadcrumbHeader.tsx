"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbHeaderProps {
  items: BreadcrumbItem[];
  showDate?: boolean;
}

export default function BreadcrumbHeader({ items, showDate = true }: BreadcrumbHeaderProps) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Generate the date dynamically on mount to avoid hydration mismatch
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    setFormattedDate(`${day}/${month}/${year}`);
  }, []);

  return (
    <div className="bg-white border border-gray-150 min-h-[80px] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none rounded-[20px] shadow-sm">
      {/* Left Side: Breadcrumb Links */}
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-brand-gray">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={13} className="text-gray-300 mx-0.5" />}
                
                <li className="flex items-center">
                  {item.active || isLast ? (
                    <span className="font-extrabold text-[#0a2540] cursor-default">
                      {idx === 0 && <Home size={14} className="inline mr-1.5 -mt-0.5 text-[#0a2540]" />}
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="hover:text-primary transition-colors flex items-center"
                    >
                      {idx === 0 && <Home size={14} className="inline mr-1.5 -mt-0.5 text-brand-gray hover:text-primary" />}
                      {item.label}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>

      {/* Right Side: Dynamic System Date */}
      {showDate && formattedDate && (
        <div className="text-xs font-black text-brand-gray bg-gray-50 border border-gray-150 px-3 py-1.5 rounded-lg shrink-0">
          Date: {formattedDate}
        </div>
      )}
    </div>
  );
}
