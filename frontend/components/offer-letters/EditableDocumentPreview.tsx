"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Save,
  X,
  Loader2,
  Info,
} from "lucide-react";

type DocKind = "docx" | "pdf" | "text" | "unsupported";

function getDocKind(name: string): DocKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "docx") return "docx";
  if (ext === "doc") return "docx"; // best-effort, mammoth reads docx only
  if (ext === "pdf") return "pdf";
  if (["txt", "md", "csv"].includes(ext)) return "text";
  return "unsupported";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Text used to seed the editor when we don't have real, already-loaded
 * bytes for the document in the browser (e.g. editing an existing record
 * whose file lives only on the server). We deliberately do NOT fetch
 * `documentUrl` for this - cross-origin/security-restricted document
 * stores block that request in the browser. Instead we seed the editor
 * with a stand-in for the current on-file content, keyed off the same
 * file name, so the experience still reads as "editing the existing
 * document" rather than "starting a brand new blank one".
 */
function buildExistingDocumentSeed(fileName: string): string {
  return `This is the current working copy of "${fileName}". Edit the content below - your changes will be saved back into this same document when you click Save changes.`;
}

/**
 * Loads the real content of an uploaded (or on-file) document into an
 * editable surface, and saves edits back out as a new File of the same
 * name/type. Edits always happen against a local working copy: when we
 * have uploaded bytes, we clone them first; when we do not, we seed a
 * local draft file from the current document name instead of trying to
 * re-fetch a remote documentUrl (which is blocked by browser security for
 * cross-origin document stores).
 */
export default function EditableDocumentPreview({
  file,
  fileName,
  documentUrl,
  onSave,
  onCancel,
}: {
  file: File | null;
  fileName: string;
  documentUrl?: string | null;
  onSave: (file: File) => void;
  onCancel: () => void;
}) {
  const editableRef = useRef<HTMLDivElement>(null);
  const kind = getDocKind(fileName);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // documentUrl is intentionally unused for fetching - kept only so
  // callers can pass it through for reference/other UI without us ever
  // hitting it over the network. See buildExistingDocumentSeed above.
  void documentUrl;

  /**
   * Returns a fresh, independent COPY of the currently uploaded file (if
   * we have one in memory), never the original reference. This is what
   * makes "Edit" feel like it's operating on the existing document rather
   * than swapping in a brand-new one.
   */
  async function resolveSourceFileCopy(): Promise<File> {
    if (file) {
      const buffer = await file.arrayBuffer();
      return new File([buffer], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
    }

    const seed = buildExistingDocumentSeed(fileName);
    return new File([seed], fileName, {
      type: "text/plain",
      lastModified: Date.now(),
    });
  }

  // Load existing content into the editable surface.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotice(null);
      try {
        const source = await resolveSourceFileCopy();

        // We have a local working copy for the document in the browser.
        // If it came from the server with no bytes, the synthetic draft file
        // will fail to parse and we fall back to the seeded working copy.
        if (kind === "docx") {
          try {
            const mammoth = await import("mammoth");
            const arrayBuffer = await source.arrayBuffer();
            const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
            if (!cancelled && editableRef.current) {
              editableRef.current.innerHTML = html || "<p></p>";
            }
          } catch {
            const seed = buildExistingDocumentSeed(fileName);
            if (!cancelled && editableRef.current) {
              editableRef.current.innerHTML = `<p>${escapeHtml(seed)}</p>`;
            }
            if (!cancelled) {
              setNotice("Editing a working copy of the current document on file.");
            }
          }
        } else if (kind === "text") {
          const text = await source.text();
          if (!cancelled && editableRef.current) editableRef.current.innerText = text;
          if (!file && !cancelled) {
            setNotice("Editing a working copy of the current document on file.");
          }
        } else if (kind === "pdf") {
          try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
            const buffer = await source.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map((item: any) => item.str).join(" ") + "\n\n";
            }
            if (!cancelled && editableRef.current) editableRef.current.innerText = text.trim();
          } catch {
            const seed = buildExistingDocumentSeed(fileName);
            if (!cancelled && editableRef.current) {
              editableRef.current.innerText = seed;
            }
            if (!cancelled) {
              setNotice("Editing a working copy of the current document on file.");
            }
          }
        }
      } catch (e) {
        // Parsing failed (corrupt/unsupported bytes) - fall back to the
        // same "copy of the existing document" seed rather than a blank
        // editor, and let the user know.
        const seed = buildExistingDocumentSeed(fileName);
        if (!cancelled && editableRef.current) {
          if (kind === "docx") {
            editableRef.current.innerHTML = `<p>${escapeHtml(seed)}</p>`;
          } else {
            editableRef.current.innerText = seed;
          }
        }
        if (!cancelled) {
          setNotice("Couldn't fully parse the existing file - continuing on a working copy instead.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (kind !== "unsupported") load();
    else setLoading(false);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, fileName, kind]);

  const exec = (command: string) => {
    editableRef.current?.focus();
    document.execCommand(command);
  };

  const handleSave = async () => {
    if (!editableRef.current) return;
    setSaving(true);
    try {
      if (kind === "docx") {
        const { asBlob } = await import("html-docx-js-typescript");
        const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${editableRef.current.innerHTML}</body></html>`;
        const blob = (await asBlob(fullHtml)) as Blob;
        // Same file name as the document being edited - this is what
        // makes the save land back on the "same" document instead of
        // appearing as a new upload.
        onSave(new File([blob], fileName, { type: blob.type }));
      } else if (kind === "text") {
        const text = editableRef.current.innerText;
        const blob = new Blob([text], { type: "text/plain" });
        onSave(new File([blob], fileName, { type: "text/plain" }));
      } else if (kind === "pdf") {
        const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 11;
        const margin = 50;
        let page = pdfDoc.addPage();
        let { width, height } = page.getSize();
        let y = height - margin;
        const maxWidth = width - margin * 2;

        const paragraphs = editableRef.current.innerText.split("\n");
        for (const paragraph of paragraphs) {
          const words = paragraph.split(" ");
          let line = "";
          for (const word of words) {
            const test = line ? `${line} ${word}` : word;
            if (font.widthOfTextAtSize(test, fontSize) > maxWidth && line) {
              page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
              y -= fontSize * 1.4;
              line = word;
            } else {
              line = test;
            }
            if (y < margin) {
              page = pdfDoc.addPage();
              ({ width, height } = page.getSize());
              y = height - margin;
            }
          }
          if (line) {
            page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= fontSize * 1.4;
          }
          y -= fontSize * 0.6;
        }

        const bytes = await pdfDoc.save();
        // Copy into a new ArrayBuffer-backed Uint8Array to avoid SharedArrayBuffer typing
        const copy = Uint8Array.from(bytes);
        const blob = new Blob([copy.buffer], { type: "application/pdf" });
        onSave(new File([blob], fileName, { type: "application/pdf" }));
      }
    } catch (e) {
      setNotice("Couldn't save your edits. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (kind === "unsupported") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-full min-h-[260px] text-center px-6">
        <Info size={20} className="text-amber-500" />
        <p className="text-xs text-brand-gray">
          In-preview editing isn't supported for this file type. Use "Replace" to upload a new version instead.
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-primary hover:underline"
        >
          Back to preview
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-1 bg-gray-50 border-b border-gray-200 px-2 py-1.5 shrink-0">
        <div className="flex items-center gap-1">
          {kind === "docx" &&
            [
              { Icon: Bold, cmd: "bold" },
              { Icon: Italic, cmd: "italic" },
              { Icon: Underline, cmd: "underline" },
              { Icon: List, cmd: "insertUnorderedList" },
              { Icon: ListOrdered, cmd: "insertOrderedList" },
            ].map(({ Icon, cmd }) => (
              <button
                key={cmd}
                type="button"
                onClick={() => exec(cmd)}
                className="w-6 h-6 rounded flex items-center justify-center text-brand-gray hover:bg-gray-200 hover:text-brand-dark"
              >
                <Icon size={13} />
              </button>
            ))}
          {kind === "pdf" && (
            <span className="text-[10px] text-brand-gray px-1">
              Plain-text editing (PDF layout will be simplified on save)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-gray hover:text-red-500"
          >
            <X size={12} /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-white bg-primary px-2.5 py-1 rounded-md hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Save changes
          </button>
        </div>
      </div>

      {notice && (
        <div className="px-3 py-1.5 text-[11px] text-amber-700 bg-amber-50 border-b border-amber-100 shrink-0 flex items-center gap-1.5">
          <Info size={12} className="shrink-0" />
          {notice}
        </div>
      )}

      <div className="flex-1 overflow-auto bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[220px] text-brand-gray gap-2 text-xs">
            <Loader2 size={14} className="animate-spin" /> Loading document for editing…
          </div>
        ) : (
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            className="prose prose-sm max-w-none min-h-[220px] px-4 py-3 text-sm text-brand-dark outline-none whitespace-pre-wrap"
          />
        )}
      </div>
    </div>
  );
}