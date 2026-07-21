"use client";

import { Bold, Italic, Underline, List, ListOrdered, Link2, Maximize2 } from "lucide-react";

const toolbarIcons = [Bold, Italic, Underline, List, ListOrdered, Link2, Maximize2];

export default function OfferLetterPreviewPanel({
  content,
  onChange,
}: {
  content: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-1 bg-gray-50 border-b border-gray-200 px-2 py-1.5">
        {toolbarIcons.map((Icon, i) => (
          <button
            key={i}
            type="button"
            className="w-6 h-6 rounded flex items-center justify-center text-brand-gray hover:bg-gray-200 hover:text-brand-dark"
          >
            <Icon size={13} />
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="w-full text-sm text-brand-dark px-3 py-2.5 outline-none resize-none placeholder:text-gray-400"
        placeholder="Generated offer letter content will appear here for preview and editing..."
      />
    </div>
  );
}
