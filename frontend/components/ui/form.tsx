export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium text-brand-gray mb-1 block">
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-gray-200 text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-brand-dark placeholder:text-gray-400 bg-white";
