import Link from "next/link";
import {
  GitBranch,
  ListChecks,
  FilePenLine,
  DollarSign,
  List,
  Plus,
} from "lucide-react";
import { mostUsedApps } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  "dofa-add": GitBranch,
  "dofa-view": ListChecks,
  "dofa-edit": FilePenLine,
  "dollar-new": DollarSign,
  "dollar-list": List,
};

const badgeStyles: Record<string, string> = {
  red: "bg-red-50 text-red-500",
  orange: "bg-orange-50 text-brand-orange",
  blue: "bg-blue-50 text-brand-blue",
  green: "bg-emerald-50 text-primary",
};

export default function MostUsedApps() {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-3 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-brand-dark">
          Offer Management — Admin Apps
        </h2>
        <button className="text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {mostUsedApps.map((app) => {
          const Icon = iconMap[app.icon] ?? GitBranch;
          const className =
            "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-100 hover:border-primary/40 hover:bg-primary/5 transition-colors p-2 sm:p-3 text-center min-h-[86px] sm:min-h-[96px]";
          const inner = (
            <>
              <span
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${badgeStyles[app.color]}`}
              >
                <Icon size={18} className="sm:hidden" />
                <Icon size={20} className="hidden sm:block" />
              </span>
              <span className="text-[10px] sm:text-[11px] leading-tight text-brand-dark font-medium line-clamp-2">
                {app.label}
              </span>
            </>
          );

          return app.href ? (
            <Link key={app.label} href={app.href} className={className}>
              {inner}
            </Link>
          ) : (
            <button key={app.label} className={className}>
              {inner}
            </button>
          );
        })}

        <button className="hidden sm:flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 hover:border-primary/40 hover:bg-primary/5 transition-colors p-3 text-center">
          <span className="w-10 h-10 rounded-lg bg-gray-100 text-brand-gray flex items-center justify-center">
            <Plus size={20} />
          </span>
          <span className="text-[11px] leading-tight text-brand-gray font-medium">
            Add / Customize
          </span>
        </button>
      </div>
    </div>
  );
}