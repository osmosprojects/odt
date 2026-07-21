// components/offer-letters/SubmitPreviewModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, FileText, Send, CheckCircle2, ArrowLeft } from "lucide-react";
import { getPreviewKind } from "./FilePreviewModal";
import PdfJsViewer from "./PdfJsViewer";

export default function SubmitPreviewModal({
  title = "Preview",
  fileName,
  objectUrl,
  onConfirm,
  onClose,
}: {
  title?: string;
  fileName: string | null;
  objectUrl: string | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const kind = fileName ? getPreviewKind(fileName) : "other";

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      onConfirm();
      onClose();
    }, 1600);
    return () => clearTimeout(timer);
  }, [submitted, onConfirm, onClose]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={16} className="text-primary shrink-0" />
          <span className="text-sm font-medium text-brand-dark truncate">
            {title}
            {fileName ? ` · ${fileName}` : ""}
          </span>
        </div>
        {!submitted && (
          <button
            type="button"
            onClick={onClose}
            className="text-brand-gray hover:text-red-500 shrink-0"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-8">
        {submitted ? (
          <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <p className="text-base font-semibold text-brand-dark">
              Uploaded successfully
            </p>
            <p className="text-xs text-brand-gray">
              This window will close automatically...
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto h-full">
            {kind === "image" && objectUrl && (
              <img
                src={objectUrl}
                alt={fileName ?? ""}
                className="max-w-full mx-auto rounded-lg border border-gray-200 bg-white shadow-sm"
              />
            )}

            {kind === "pdf" && objectUrl && (
              <PdfJsViewer
                url={objectUrl}
                fileName={fileName ?? "preview"}
                className="h-[75vh] rounded-lg border border-gray-200 shadow-sm"
              />
            )}

            {(kind === "other" || !objectUrl) && (
              <div className="flex flex-col items-center justify-center gap-3 h-[60vh] text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText size={24} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-brand-dark">
                  {fileName ?? "No document attached"}
                </p>
                <p className="text-xs text-brand-gray max-w-xs">
                  {objectUrl
                    ? "Inline preview isn't supported for this file type, but it will be included when you submit."
                    : "Review the details, then confirm submission below."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {!submitted && (
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 sm:px-6 py-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={15} /> Back to edit
          </button>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary px-5 py-2 rounded-lg hover:bg-primary-dark"
          >
            <Send size={15} /> Submit
          </button>
        </div>
      )}
    </div>
  );
}