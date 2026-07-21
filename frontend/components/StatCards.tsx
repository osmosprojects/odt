import { ClipboardList, ShieldCheck, BellRing, Users2 } from "lucide-react";
import { statCards } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  todo: ClipboardList,
  approvals: ShieldCheck,
  alerts: BellRing,
  team: Users2,
};

// Solid, saturated badge colors + matching glow — one distinct color per card
const badgeStyles: Record<string, string> = {
  todo: "bg-emerald-500 shadow-emerald-500/30",
  approvals: "bg-orange-500 shadow-orange-500/30",
  alerts: "bg-sky-500 shadow-sky-500/30",
  team: "bg-violet-500 shadow-violet-500/30",
};

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((card) => {
        const Icon = iconMap[card.icon] ?? Users2;
        return (
          <div
            key={card.label}
            className="bg-white rounded-card shadow-card border border-gray-100 p-4 flex items-center gap-3"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg ${
                badgeStyles[card.icon] ?? "bg-primary shadow-primary/30"
              }`}
            >
              <Icon size={22} strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-brand-dark leading-tight">
                {card.value}
              </p>
              <p className="text-xs text-brand-gray truncate-1">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
