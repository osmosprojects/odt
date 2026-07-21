// components/offer-letters/PdfJsViewer.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_GAP = 16; // px of breathing room around the rendered page

export default function PdfJsViewer({
  url,
  fileName,
  className = "",
}: {
  url: string;
  fileName?: string;
  className?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);

  // Renders only the current page onto the canvas.
  const renderPage = useCallback(async (pdf: any, num: number) => {
    const outer = outerRef.current;
    const canvas = canvasRef.current;
    if (!outer || !canvas || !pdf) return;

    const page = await pdf.getPage(num);

    const availableWidth = Math.max(outer.clientWidth - PAGE_GAP * 2, 100);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.max(availableWidth / baseViewport.width, 0.1);
    const viewport = page.getViewport({ scale });

    // Render at device pixel resolution so it stays sharp on high-DPI
    // (retina/mobile) screens, then downscale visually with CSS.
    const dpr = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.maxWidth = `${viewport.width}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  }, []);

  // Load the document once per url.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      pdfRef.current = null;
      setNumPages(0);
      setPageNum(1);

      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        if (cancelled) return;

        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        await renderPage(pdf, 1);
      } catch (err) {
        console.error("PDF.js render error", err);
        if (!cancelled) setError("Couldn't render this PDF.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      pdfRef.current = null;
    };
  }, [url, renderPage]);

  // Re-render just the current page whenever it changes.
  useEffect(() => {
    if (pdfRef.current) renderPage(pdfRef.current, pageNum);
  }, [pageNum, renderPage]);

  // Re-render the current page on resize (debounced), without touching other pages.
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    let timeout: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (pdfRef.current) renderPage(pdfRef.current, pageNum);
      }, 150);
    });

    observer.observe(outer);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [renderPage, pageNum]);

  const goPrev = () => setPageNum((p) => Math.max(1, p - 1));
  const goNext = () => setPageNum((p) => Math.min(numPages, p + 1));

  return (
    <div
      ref={outerRef}
      className={`relative w-full h-full flex flex-col bg-gray-100 ${className}`}
    >
      <div className="relative flex-1 overflow-auto flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-brand-gray z-10 bg-gray-100">
            <Loader2 size={14} className="animate-spin" />
            Loading {fileName ?? "preview"}…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-red-500 px-4 text-center z-10 bg-gray-100">
            {error}
          </div>
        )}
        <div
          className="w-full flex items-center justify-center"
          style={{ padding: PAGE_GAP }}
        >
          <canvas
            ref={canvasRef}
            className="block shadow-sm border border-gray-200 bg-white"
          />
        </div>
      </div>

      {!loading && !error && numPages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t border-gray-200 bg-white px-3 py-1.5 shrink-0">
          <button
            type="button"
            onClick={goPrev}
            disabled={pageNum <= 1}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-gray hover:text-primary disabled:opacity-40 disabled:hover:text-brand-gray disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-[11px] font-medium text-brand-dark tabular-nums">
            Page {pageNum} of {numPages}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={pageNum >= numPages}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-gray hover:text-primary disabled:opacity-40 disabled:hover:text-brand-gray disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}