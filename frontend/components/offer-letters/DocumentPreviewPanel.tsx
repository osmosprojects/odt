// components/offer-letters/DocumentPreviewPanel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Pencil, UploadCloud, RefreshCw } from "lucide-react";
import { getPreviewKind } from "./FilePreviewModal";
import EditableDocumentPreview from "./EditableDocumentPreview";
import PdfJsViewer from "./PdfJsViewer";

export default function DocumentPreviewPanel({
  file,
  fileName,
  documentUrl,
  onSelect,
  emptyHint = "Upload a document to see its preview here",
}: {
  file: File | null;
  fileName?: string | null;
  documentUrl?: string;
  onSelect: (file: File) => void;
  emptyHint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayName = file?.name ?? fileName ?? null;
  const kind = displayName ? getPreviewKind(displayName) : "other";

  const handleSaveEdits = (edited: File) => {
    onSelect(edited);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col min-h-[280px]">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      <div className="flex items-center justify-between gap-2 bg-gray-50 border-b border-gray-200 px-3 py-1.5 shrink-0">
        <span className="flex items-center gap-1.5 min-w-0 text-xs font-medium text-brand-dark">
          <FileText size={13} className="text-primary shrink-0" />
          <span className="truncate">{displayName ?? "No document yet"}</span>
        </span>
        {displayName && !isEditing && (
          <span className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-gray hover:text-primary"
            >
              <RefreshCw size={12} /> Replace
            </button>
          </span>
        )}
      </div>

      <div className="flex-1 bg-gray-50 overflow-auto min-h-0">
        {isEditing && displayName && (
          <EditableDocumentPreview
            file={file}
            fileName={displayName}
            documentUrl={documentUrl}
            onSave={handleSaveEdits}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {!isEditing && !displayName && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full min-h-[260px] flex flex-col items-center justify-center gap-2 text-brand-gray hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <UploadCloud size={20} />
            <span className="text-xs font-medium px-6 text-center">
              {emptyHint}
            </span>
          </button>
        )}

        {!isEditing && displayName && kind === "image" && objectUrl && (
          <img
            src={objectUrl}
            alt={displayName}
            className="w-full h-full object-contain"
          />
        )}

        {!isEditing && displayName && kind === "pdf" && objectUrl && (
          <PdfJsViewer
            url={objectUrl}
            fileName={displayName}
            className="min-h-[420px] sm:min-h-[480px]"
          />
        )}

        {!isEditing && displayName && (kind === "other" || !objectUrl) && (
          <div className="flex flex-col items-center justify-center gap-2 h-full min-h-[260px] text-center px-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <p className="text-xs font-medium text-brand-dark">{displayName}</p>
            <p className="text-[11px] text-brand-gray">
              {objectUrl
                ? "Click Edit above to edit this document's content, or Replace to upload a different file."
                : "This is the document currently on file. Click Edit to start editing its content."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}