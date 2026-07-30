import { LucideIcon } from "lucide-react";
export { FieldLabel, inputClass } from "@/components/ui/form";

export default function StepCard({
  step,
  title,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
          {step}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gray">
            Step {step}
          </p>
          <h3 className="text-sm font-semibold text-brand-dark truncate flex items-center gap-1.5">
            <Icon size={15} className="text-primary shrink-0" />
            {title}
          </h3>
        </div>
      </div>
      <div className="flex-1 space-y-3">{children}</div>
    </div>
  );
}


