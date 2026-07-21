import { Megaphone } from "lucide-react";
import { announcements } from "@/lib/data";

export default function Announcements() {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-brand-dark">Announcements</h2>
        <button className="text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <ul className="space-y-4">
        {announcements.map((a, i) => (
          <li key={i} className="flex gap-3">
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
              <Megaphone size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-brand-dark leading-snug">
                {a.title}
              </p>
              <p className="text-[11px] text-brand-gray mt-1">{a.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
