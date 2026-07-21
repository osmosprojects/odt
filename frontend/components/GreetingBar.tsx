import { CalendarDays } from "lucide-react";

export default function GreetingBar() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
          Good Morning, Castrol B2B Admin! <span aria-hidden="true">👋</span>
        </h1>
        <p className="text-sm text-brand-gray mt-0.5">
          Here&apos;s what&apos;s happening today.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-brand-gray bg-white border border-gray-200 rounded-lg px-3 py-2 w-fit shadow-card max-w-full">
        <CalendarDays size={16} className="text-primary shrink-0" />
        <span className="whitespace-nowrap">Tue, 21 May 2024</span>
        <span className="text-gray-300 hidden sm:inline">|</span>
        <span className="whitespace-nowrap">09:30 AM</span>
      </div>
    </div>
  );
}
