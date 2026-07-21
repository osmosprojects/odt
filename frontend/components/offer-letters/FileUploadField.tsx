"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileText, X, Maximize2, Pencil, FileWarning } from "lucide-react";
import FilePreviewModal, { getPreviewKind } from "./FilePreviewModal";

export default function FileUploadField({
  accept,
  hint,
  defaultFileName,
  showPreview = false,
  onFileChange,
}: {
  accept?: string;
  hint?: string;
  defaultFileName?: string;
  /** Show an inline preview (image/PDF) plus Expand/Edit controls for the selected file. */
  showPreview?: boolean;
  onFileChange?: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(defaultFileName ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSelect = (selected: File | null) => {
    setFile(selected);
    setFileName(selected?.name ?? null);
    onFileChange?.(selected);
  };

  const handleRemove = () => {
    handleSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const kind = fileName ? getPreviewKind(fileName) : "other";
  const hasInlinePreview = showPreview && objectUrl && (kind === "image" || kind === "pdf");

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
      />

      {fileName ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          {/* File info row */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50/60">
            <span className="flex items-center gap-2 min-w-0 text-xs text-brand-dark">
              <FileText size={14} className="text-primary shrink-0" />
              <span className="truncate">{fileName}</span>
            </span>
            <span className="flex items-center gap-2 shrink-0">
              {showPreview && (
                <>
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="text-brand-gray hover:text-primary"
                    aria-label="Expand preview"
                    title="Expand"
                  >
                    <Maximize2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-brand-gray hover:text-primary"
                    aria-label="Edit / replace file"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="text-brand-gray hover:text-red-500"
                aria-label="Remove file"
                title="Remove"
              >
                <X size={14} />
              </button>
            </span>
          </div>

          {/* Inline preview - shown automatically, no click needed */}
          {showPreview && (
            <div className="border-t border-gray-200 bg-white">
              {kind === "image" && objectUrl && (
                <img
                  src={objectUrl}
                  alt={fileName}
                  className="w-full max-h-56 object-contain bg-gray-50 cursor-zoom-in"
                  onClick={() => setPreviewOpen(true)}
                />
              )}
              {kind === "pdf" && objectUrl && (
                <iframe
                  src={objectUrl}
                  title={fileName}
                  className="w-full h-56"
                />
              )}
              {!hasInlinePreview && (
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-3 text-left hover:bg-gray-50"
                >
                  <FileWarning size={16} className="text-brand-gray shrink-0" />
                  <span className="text-[11px] text-brand-gray">
                    {objectUrl
                      ? "No inline preview for this file type. Click to view options."
                      : "This is the document currently on file. Click to view or replace it."}
                  </span>
                </button>
              )}
            </div>
          )}
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

      {showPreview && previewOpen && fileName && (
        <FilePreviewModal
          fileName={fileName}
          objectUrl={objectUrl}
          onClose={() => setPreviewOpen(false)}
          onReplace={(newFile) => {
            handleSelect(newFile);
            setPreviewOpen(false);
          }}
        />
      )}
    </div>
  );
}