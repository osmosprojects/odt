import Link from "next/link";
import {
  Tag,
  GitBranch,
  DollarSign,
  UploadCloud,
  FileText,
} from "lucide-react";
import { quickActions } from "@/lib/data";

const iconFor = (label: string) => {
  if (label.includes("WBC")) return Tag;
  if (label.includes("DOFA")) return GitBranch;
  if (label.includes("Dollar")) return DollarSign;
  if (label.includes("Upload") || label.includes("Master")) return UploadCloud;
  return FileText;
};

export default function QuickActions() {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-5">
      <h2 className="font-semibold text-brand-dark mb-4">Quick Actions</h2>

      <div className="sm:hidden grid grid-cols-2 gap-2">
        {quickActions.map((action) => {
          const Icon = iconFor(action.label);
          const className =
            "min-h-[64px] flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-2.5 text-left text-xs font-medium text-brand-gray hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors";
          const inner = (
            <>
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-brand-dark flex items-center justify-center shrink-0">
                <Icon size={15} />
              </span>
              <span className="leading-tight">{action.label}</span>
            </>
          );
          return action.href ? (
            <Link key={action.label} href={action.href} className={className}>
              {inner}
            </Link>
          ) : (
            <button key={action.label} className={className}>
              {inner}
            </button>
          );
        })}
      </div>

      <ul className="hidden sm:space-y-1.5">
        {quickActions.map((action) => {
          const Icon = iconFor(action.label);
          const className =
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-brand-gray hover:bg-gray-50 hover:text-primary transition-colors border border-transparent hover:border-gray-100";
          const inner = (
            <>
              <Icon size={16} className="text-primary" />
              {action.label}
            </>
          );
          return (
            <li key={action.label}>
              {action.href ? (
                <Link href={action.href} className={className}>
                  {inner}
                </Link>
              ) : (
                <button className={className}>{inner}</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
