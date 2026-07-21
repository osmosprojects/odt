import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { reportStatCards } from "@/lib/reportsAnalytics";

export default function ReportStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {reportStatCards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-card shadow-card border border-gray-100 p-4"
        >
          <p className="text-xs text-brand-gray mb-1">{card.label}</p>
          <div className="flex items-end gap-2">
            <span className="text-xl sm:text-2xl font-bold text-brand-dark leading-tight">
              {card.value}
            </span>
            {card.change && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium mb-0.5 ${
                  card.changeType === "down" ? "text-red-500" : "text-primary"
                }`}
              >
                {card.changeType === "down" ? (
                  <ArrowDownRight size={13} />
                ) : (
                  <ArrowUpRight size={13} />
                )}
                {card.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
