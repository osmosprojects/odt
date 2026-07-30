"use client";

import React from "react";
import { Eye, Edit, Ban, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView: () => void;
  onEdit: () => void;
  onReject: () => void;
  onDelete: () => void;
  status: string;
}

export default function ActionButtons({
  onView,
  onEdit,
  onReject,
  onDelete,
  status,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {/* View (Eye) */}
      <div className="relative group">
        <button
          type="button"
          onClick={onView}
          className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-brand-gray hover:bg-primary hover:text-white hover:border-primary transition duration-150 shadow-xs"
        >
          <Eye size={13} />
        </button>
        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md z-10">
          View Offer
        </span>
      </div>

      {/* Edit (Pencil) */}
      <div className="relative group">
        <button
          type="button"
          onClick={onEdit}
          disabled={status === "Closed / Closure"}
          className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-brand-gray hover:bg-amber-500 hover:text-white hover:border-amber-500 disabled:opacity-40 disabled:hover:bg-gray-50 disabled:hover:text-brand-gray disabled:hover:border-gray-200 transition duration-150 shadow-xs"
        >
          <Edit size={13} />
        </button>
        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md z-10">
          Edit terms
        </span>
      </div>

      {/* Reject/Cancel (Ban) */}
      {status === "Pending Approval" && (
        <div className="relative group">
          <button
            type="button"
            onClick={onReject}
            className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-brand-gray hover:bg-orange-500 hover:text-white hover:border-orange-500 transition duration-150 shadow-xs"
          >
            <Ban size={13} />
          </button>
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md z-10">
            Reject Approval
          </span>
        </div>
      )}

      {/* Delete (Trash) */}
      {status === "Draft" && (
        <div className="relative group">
          <button
            type="button"
            onClick={onDelete}
            className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-brand-gray hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-150 shadow-xs"
          >
            <Trash2 size={13} />
          </button>
          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md z-10">
            Delete Draft
          </span>
        </div>
      )}
    </div>
  );
}
