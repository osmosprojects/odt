"use client";

import { useState } from "react";
import { GitBranch, Plus, Trash2, Send } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import FileUploadField from "@/components/offer-letters/FileUploadField";
import { offerToolTypes, DofaLevel, approvals } from "@/lib/offerManagement";

export default function AddDofaFlowForm() {
  const [dofaApproval, setDofaApproval] = useState(true);
  const [offerToolType, setOfferToolType] = useState(offerToolTypes[0]);
  const [approval, setApproval] = useState(approvals[0]);
const [levels, setLevels] = useState<DofaLevel[]>([
  { level: 1, limit: "", fromApproval: approvals[0], toApproval: approvals[1] ?? approvals[0] },
  { level: 2, limit: "", fromApproval: approvals[1] ?? approvals[0], toApproval: approvals[2] ?? approvals[0] },
]);
  const [finalDofa, setFinalDofa] = useState("");
  const [mailFile, setMailFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);

  const updateFromApproval = (level: number, value: string) => {
    setLevels((prev) =>
      prev.map((l) => (l.level === level ? { ...l, fromApproval: value } : l))
    );
  };

  const updateToApproval = (level: number, value: string) => {
    setLevels((prev) =>
      prev.map((l) => (l.level === level ? { ...l, toApproval: value } : l))
    );
  };

const addLevel = () => {
  setLevels((prev) => {
    const last = prev[prev.length - 1];
    return [
      ...prev,
      {
        level: prev.length + 1,
        limit: "",
        fromApproval: last?.toApproval ?? approvals[0],
        toApproval: approvals[0],
      },
    ];
  });
};

  const removeLevel = (level: number) => {
    setLevels((prev) =>
      prev
        .filter((l) => l.level !== level)
        .map((l, idx) => ({ ...l, level: idx + 1 }))
    );
  };

  const isValid =
    offerToolType.trim().length > 0 &&
    finalDofa.trim().length > 0 &&
    levels.every((l) => l.fromApproval && l.toApproval);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await api.createDofaMatrix({
        matrixName: `${offerToolType} Custom Matrix`,
        offerToolType,
        levels,
        finalDofa,
        approvalMailName: mailFile ? mailFile.name : null,
      });

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setDofaApproval(true);
        setOfferToolType(offerToolTypes[0]);
        setLevels([
          { level: 1, limit: "", fromApproval: approvals[0], toApproval: approvals[1] ?? approvals[0] },
          { level: 2, limit: "", fromApproval: approvals[1] ?? approvals[0], toApproval: approvals[2] ?? approvals[0] },
        ]);
        setFinalDofa("");
        setMailFile(null);
      }, 1600);
    } catch (err) {
      console.error("DOFA Matrix creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <GitBranch size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Add DOFA Flow
        </h2>
      </div>
      <p className="text-xs text-brand-gray mb-5">
        Define the delegation-of-financial-authority (DOFA) matrix for an
        offer tool, including per-level approval limits.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <FieldLabel>DOFA Approval</FieldLabel>
            <button
              type="button"
              role="switch"
              aria-checked={dofaApproval}
              onClick={() => setDofaApproval((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                dofaApproval ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  dofaApproval ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="ml-2 align-middle text-xs text-brand-gray">
              {dofaApproval ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div>
            <FieldLabel>Offer Tool Type</FieldLabel>
            <select
              className={inputClass}
              value={offerToolType}
              onChange={(e) => setOfferToolType(e.target.value)}
            >
              {offerToolTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Approval Level</FieldLabel>
            <select
              className={inputClass}
              value={approval}
              onChange={(e) => setApproval(e.target.value)}
            >
              {approvals.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {levels.map((l) => (
            <div key={l.level} className="space-y-2">
              <FieldLabel>{`Level ${l.level}`}</FieldLabel>
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <FieldLabel>From Approval</FieldLabel>
                  <select
                    className={inputClass}
                    value={l.fromApproval}
                    onChange={(e) => updateFromApproval(l.level, e.target.value)}
                  >
                    {approvals.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <FieldLabel>To Approval</FieldLabel>
                    <select
                      className={inputClass}
                      value={l.toApproval}
                      onChange={(e) => updateToApproval(l.level, e.target.value)}
                    >
                      {approvals.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  {levels.length > 1 && l.level === levels.length && (
                    <button
                      type="button"
                      onClick={() => removeLevel(l.level)}
                      aria-label="Remove level"
                      title="Remove level"
                      className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-brand-gray hover:text-red-500 hover:bg-red-50 mb-0.5"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLevel}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Plus size={14} /> Add More Level
          </button>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div>
            <FieldLabel>Final DOFA</FieldLabel>
            <input
              type="text"
              inputMode="decimal"
              className={inputClass}
              placeholder="Enter final DOFA amount..."
              value={finalDofa}
              onChange={(e) => setFinalDofa(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Approval Mail Copy</FieldLabel>
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
          Offer Tool Type, all level approvals, and Final DOFA are required.
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary px-5 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-4"
        >
          <Send size={15} /> Submit
        </button>
      </div>

      {saved && (
        <div className="mt-4 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium px-3 py-2.5 text-center">
          DOFA flow saved successfully.
        </div>
      )}
    </div>
  );
}