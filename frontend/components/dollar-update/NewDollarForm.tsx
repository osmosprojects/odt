"use client";

import { useState } from "react";
import { DollarSign, Send, Loader2 } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import FileUploadField from "@/components/offer-letters/FileUploadField";
import { api } from "@/lib/api";

export default function NewDollarForm({ onSuccess }: { onSuccess?: () => void }) {
  const [dollarValue, setDollarValue] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");
  const [addedDate, setAddedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [mailFile, setMailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = dollarValue.trim().length > 0 && validFrom.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setErrorMsg("");

    try {
      await api.createDollarRate({
        value: parseFloat(dollarValue),
        validFrom,
        validTill: validTill || null,
        addedDate,
        approvalMailName: mailFile ? mailFile.name : null,
      });

      setSaved(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSaved(false);
        setDollarValue("");
        setValidFrom("");
        setValidTill("");
        setAddedDate(new Date().toISOString().slice(0, 10));
        setMailFile(null);
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save dollar exchange rate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <DollarSign size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          New Dollar Rate Configuration
        </h2>
      </div>
      <p className="text-xs text-brand-gray mb-5">
        Add a new dollar conversion rate along with its validity window and approval mail copy.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <FieldLabel>1 Dollar ($) = Rupees (INR) *</FieldLabel>
            <input
              type="number"
              step="0.01"
              className={inputClass}
              placeholder="e.g. 83.42"
              value={dollarValue}
              onChange={(e) => setDollarValue(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Dollar Valid From *</FieldLabel>
            <input
              type="date"
              className={inputClass}
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Dollar Valid Till (Optional)</FieldLabel>
            <input
              type="date"
              className={inputClass}
              value={validTill}
              onChange={(e) => setValidTill(e.target.value)}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div>
            <FieldLabel>Dollar Added Date *</FieldLabel>
            <input
              type="date"
              className={inputClass}
              value={addedDate}
              onChange={(e) => setAddedDate(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Attach Mail Copy / PDF</FieldLabel>
            <FileUploadField
              accept=".pdf,.doc,.docx,.eml,.msg"
              hint="PDF, DOC or EML"
              onFileChange={setMailFile}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray">
          1 Dollar ($) = Rupees (INR), Dollar Valid From, and Dollar Added Date are required.
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary px-5 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-4 shadow-sm"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          <span>{loading ? "Saving..." : "Submit Rate"}</span>
        </button>
      </div>

      {saved && (
        <div className="mt-4 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-4 py-3 text-center">
          ✅ New Dollar Rate successfully saved & synced live!
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-4 py-3 text-center">
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}