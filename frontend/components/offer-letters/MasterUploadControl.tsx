"use client";

import { useRef } from "react";
import { UploadCloud, FileText, X, Pencil } from "lucide-react";

/**
 * Compact, fully-controlled upload control. Unlike FileUploadField, this
 * does not manage its own file state or render an inline preview - it's
 * meant to be paired with <DocumentPreviewPanel /> which shows the big
 * preview on the other side of the form.
 */
export default function MasterUploadControl({
  file,
  fileName,
  hint,
  accept,
  onSelect,
  onRemove,
}: {
  file: File | null;
  /** Name of the document already on file when editing an existing record (no real File object available). */
  fileName?: string | null;
  hint?: string;
  accept?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayName = file?.name ?? fileName ?? null;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      {displayName ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2">
          <span className="flex items-center gap-2 min-w-0 text-xs text-brand-dark">
            <FileText size={14} className="text-primary shrink-0" />
            <span className="truncate">{displayName}</span>
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-brand-gray hover:text-primary"
              aria-label="Edit / replace file"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-brand-gray hover:text-red-500"
              aria-label="Remove file"
              title="Remove"
            >
              <X size={14} />
            </button>
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-3 text-xs font-medium text-brand-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <UploadCloud size={15} />
          Click to upload{hint ? ` (${hint})` : ""}
        </button>
      )}
    </div>
  );
}