"use client";

import React, { useRef } from "react";
import { Plus, Trash2, Copy, MoveUp, MoveDown, Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

interface TermsEditorProps {
  clauses: string[];
  onChangeClauses: (updated: string[]) => void;
  sectionHeading: string;
  onChangeHeading: (heading: string) => void;
}

export default function TermsEditor({
  clauses,
  onChangeClauses,
  sectionHeading,
  onChangeHeading,
}: TermsEditorProps) {
  // Reordering handlers
  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= clauses.length) return;

    const nextClauses = [...clauses];
    const temp = nextClauses[index];
    nextClauses[index] = nextClauses[targetIndex];
    nextClauses[targetIndex] = temp;
    onChangeClauses(nextClauses);
  };

  // Adding clauses
  const handleAdd = () => {
    onChangeClauses([...clauses, ""]);
  };

  // Duplicating clauses
  const handleDuplicate = (index: number) => {
    const nextClauses = [...clauses];
    nextClauses.splice(index + 1, 0, clauses[index]);
    onChangeClauses(nextClauses);
  };

  // Deleting clauses
  const handleDelete = (index: number) => {
    if (clauses.length <= 1) {
      alert("At least one terms & conditions clause is required.");
      return;
    }
    onChangeClauses(clauses.filter((_, idx) => idx !== index));
  };

  const handleTextChange = (index: number, val: string) => {
    const next = [...clauses];
    next[index] = val;
    onChangeClauses(next);
  };

  // Utility to format selected text in textarea
  const formatText = (index: number, tagOpen: string, tagClose: string, textareaId: string) => {
    const txtArea = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!txtArea) return;

    const start = txtArea.selectionStart;
    const end = txtArea.selectionEnd;
    const text = txtArea.value;

    const selectedText = text.substring(start, end);
    const replacement = tagOpen + selectedText + tagClose;

    const nextText = text.substring(0, start) + replacement + text.substring(end);
    handleTextChange(index, nextText);

    // Refocus and place selection
    setTimeout(() => {
      txtArea.focus();
      txtArea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
    }, 50);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
      {/* Heading input */}
      <div className="space-y-1.5 pb-2.5 border-b border-gray-150">
        <label className="text-[10px] font-black text-brand-gray uppercase tracking-wider block">
          Section Header Heading
        </label>
        <div className="relative">
          <input
            type="text"
            value={sectionHeading}
            onChange={(e) => onChangeHeading(e.target.value)}
            className="w-full text-sm font-black text-brand-dark bg-white border-b-2 border-primary focus:border-primary-dark outline-none py-1 transition-all"
            placeholder="e.g. 2. TERMS &amp; CONDITIONS"
          />
        </div>
      </div>

      {/* Clauses container */}
      <div className="space-y-3">
        {clauses.map((clause, index) => {
          const textareaId = `clause-textarea-${index}`;
          return (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex gap-3 shadow-xs items-start group hover:border-primary/20 transition-all duration-200"
            >
              {/* Auto numbering */}
              <span className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-black text-brand-dark shrink-0 select-none">
                {index + 1}
              </span>

              {/* Textarea and Toolbar container */}
              <div className="flex-1 space-y-2">
                {/* Toolbar */}
                <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition duration-150">
                  <button
                    type="button"
                    onClick={() => formatText(index, "<strong>", "</strong>", textareaId)}
                    className="p-1 rounded hover:bg-gray-200 text-brand-gray hover:text-brand-dark"
                    title="Bold"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText(index, "<em>", "</em>", textareaId)}
                    className="p-1 rounded hover:bg-gray-200 text-brand-gray hover:text-brand-dark"
                    title="Italic"
                  >
                    <Italic size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText(index, "<u>", "</u>", textareaId)}
                    className="p-1 rounded hover:bg-gray-200 text-brand-gray hover:text-brand-dark"
                    title="Underline"
                  >
                    <Underline size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText(index, "<ul><li>", "</li></ul>", textareaId)}
                    className="p-1 rounded hover:bg-gray-200 text-brand-gray hover:text-brand-dark"
                    title="Bullet List"
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText(index, "<ol><li>", "</li></ol>", textareaId)}
                    className="p-1 rounded hover:bg-gray-200 text-brand-gray hover:text-brand-dark"
                    title="Numbered List"
                  >
                    <ListOrdered size={13} />
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  id={textareaId}
                  rows={2}
                  value={clause}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="w-full rounded-lg border border-gray-200 text-xs px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-brand-dark bg-white font-medium shadow-xs resize-y"
                  placeholder="Enter clause text..."
                />
              </div>

              {/* Action and reordering column */}
              <div className="flex flex-col gap-1 shrink-0">
                {/* Reordering */}
                <div className="flex items-center gap-1 border-b border-gray-200 pb-1 mb-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 hover:bg-white rounded hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Up"
                  >
                    <MoveUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, "down")}
                    disabled={index === clauses.length - 1}
                    className="p-1 hover:bg-white rounded hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Down"
                  >
                    <MoveDown size={13} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleDuplicate(index)}
                    className="p-1.5 hover:bg-white rounded text-brand-gray hover:text-amber-500 transition"
                    title="Duplicate Clause"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="p-1.5 hover:bg-white rounded text-brand-gray hover:text-red-500 transition"
                    title="Delete Clause"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Condition button */}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-brand-dark text-xs font-bold py-2.5 rounded-xl transition shadow-xs"
      >
        <Plus size={14} /> Add Condition
      </button>
    </div>
  );
}
