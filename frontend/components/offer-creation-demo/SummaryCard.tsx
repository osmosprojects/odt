import React from "react";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: string | number;
  subText?: string;
  icon?: LucideIcon;
  color?: string; // e.g. "text-primary bg-emerald-50 border-emerald-100"
  badgeText?: string;
  badgeColor?: string;
}

export default function SummaryCard({
  label,
  value,
  subText,
  icon: Icon,
  color = "text-primary bg-emerald-50 border-emerald-100",
  badgeText,
  badgeColor = "bg-primary text-white",
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-[14px] border border-slate-200 p-[20px] shadow-sm flex flex-col justify-between gap-2.5 relative overflow-hidden transition-all duration-200 hover:shadow-md h-full">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-slate-600 truncate">
          {label}
        </span>
        {Icon && (
          <span className={`w-8 h-8 rounded-[10px] flex items-center justify-center border shrink-0 ${color}`}>
            <Icon size={16} />
          </span>
        )}
      </div>

      <div className="my-1 flex items-baseline justify-between gap-2 flex-wrap">
        <span className="text-[30px] font-bold text-slate-900 tracking-tight leading-none">
          {value}
        </span>
        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subText && (
        <p className="text-[12px] text-slate-500 font-normal leading-tight">
          {subText}
        </p>
      )}
    </div>
  );
}

