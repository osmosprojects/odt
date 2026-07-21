"use client";

import { useState, KeyboardEvent } from "react";
import { X, Mail } from "lucide-react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecipientsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (emails: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const commit = () => {
    const candidate = draft.trim().replace(/,$/, "");
    if (!candidate) return;
    if (!emailPattern.test(candidate)) {
      setError("Enter a valid email address");
      return;
    }
    if (value.includes(candidate)) {
      setDraft("");
      return;
    }
    onChange([...value, candidate]);
    setDraft("");
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const remove = (email: string) => onChange(value.filter((e) => e !== email));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 px-2 py-1.5 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
        {value.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs font-medium px-2 py-1"
          >
            <Mail size={11} />
            {email}
            <button
              type="button"
              onClick={() => remove(email)}
              className="hover:text-red-500"
              aria-label={`Remove ${email}`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="email"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={value.length ? "" : "Add recipient email(s)..."}
          className="flex-1 min-w-[140px] text-sm outline-none px-1 py-0.5 text-brand-dark placeholder:text-gray-400"
        />
      </div>
      {error ? (
        <p className="text-[11px] text-red-500 mt-1">{error}</p>
      ) : (
        <p className="text-[11px] text-brand-gray mt-1">
          Press Enter or comma after each address. These recipients get notified when this offer letter type is used.
        </p>
      )}
    </div>
  );
}
