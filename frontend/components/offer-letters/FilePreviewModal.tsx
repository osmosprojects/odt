// components/offer-letters/FilePreviewModal.tsx
"use client";

import { useRef } from "react";
import { X, UploadCloud, FileText, Download } from "lucide-react";
import PdfJsViewer from "./PdfJsViewer";

export type PreviewKind = "image" | "pdf" | "other";

export function getPreviewKind(name: string): PreviewKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
}

export default function FilePreviewModal({
  fileName,
  objectUrl,
  onClose,
  onReplace,
}: {
  fileName: string;
  objectUrl: string | null;
  onClose: () => void;
  onReplace: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const kind = getPreviewKind(fileName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-card bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-primary shrink-0" />
            <span className="text-sm font-medium text-brand-dark truncate">
              {fileName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-brand-gray hover:text-red-500 shrink-0"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          {kind === "image" && objectUrl && (
            <img
              src={objectUrl}
              alt={fileName}
              className="max-w-full mx-auto rounded-lg border border-gray-200 bg-white"
            />
          )}

          {kind === "pdf" && objectUrl && (
            <PdfJsViewer
              url={objectUrl}
              fileName={fileName}
              className="h-[60vh] rounded-lg border border-gray-200"
            />
          )}

          {(kind === "other" || !objectUrl) && (
            <div className="flex flex-col items-center justify-center gap-3 h-[40vh] text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText size={24} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-brand-dark">{fileName}</p>
              <p className="text-xs text-brand-gray max-w-xs">
                {objectUrl
                  ? "Inline preview isn't supported for this file type. Download it to view the full content."
                  : "This is the document currently on file. Upload a new version below if you'd like to replace it."}
              </p>
              {objectUrl && (
  <a
    href={objectUrl}
    download={fileName}
    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
  >
    <Download size={13} />
    Download to view
  </a>
)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
          <p className="text-[11px] text-brand-gray">
            Replacing this file will update the document used going forward.
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onReplace(file);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-primary px-3.5 py-2 rounded-lg hover:bg-primary-dark shrink-0"
          >
            <UploadCloud size={14} /> Replace Document
          </button>
        </div>
      </div>
    </div>
  );
}