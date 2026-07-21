import { Check, ClipboardCheck } from "lucide-react";

export default function MyToDoList() {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-brand-dark">My To Do List</h2>
        <button className="text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 py-2 sm:flex-col sm:justify-center sm:text-center sm:py-6">
        <div className="min-w-0 sm:order-2">
          <p className="text-sm text-brand-gray sm:max-w-[16rem]">
            No work pending in your TO DO list.
          </p>
        </div>

        <div className="relative shrink-0 w-20 h-20 sm:order-1">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm">
            <ClipboardCheck className="text-primary" size={30} />
          </div>
          <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
            <Check size={13} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
