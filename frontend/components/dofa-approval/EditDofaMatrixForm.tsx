"use client";

import { useEffect, useState } from "react";
import { FilePenLine, Plus, Trash2, Send } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import FileUploadField from "@/components/offer-letters/FileUploadField";
import { dofaMatrices, offerToolTypes, DofaLevel, approvals } from "@/lib/offerManagement";

const readonlyClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 text-sm px-3 py-2 text-brand-gray";

export default function EditDofaMatrixForm({ matrixId }: { matrixId: string }) {
  const record = dofaMatrices.find((m) => m.id === matrixId) ?? dofaMatrices[0];

  const [offerToolType, setOfferToolType] = useState(record.offerToolType);
  const [levels, setLevels] = useState<DofaLevel[]>(record.levels);
  const [finalDofa, setFinalDofa] = useState(record.finalDofa);
  const [mailFile, setMailFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOfferToolType(record.offerToolType);
    setLevels(record.levels);
    setFinalDofa(record.finalDofa);
    setMailFile(null);
  }, [record]);

  const approvalLevel = levels.length;
  const finalLevel = levels[levels.length - 1]?.level ?? 0;

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
          fromApproval: last?.toApproval || approvals[0],
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

  const handleSubmit = () => {
    if (!isValid) return;
    // In a real implementation this would PATCH the matrix, then
    // navigate back to the DOFA approval list.
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <FilePenLine size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Edit DOFA Matrix
        </h2>
      </div>
      <p className="text-xs text-brand-gray mb-5">
        Update approval levels and limits for an existing DOFA matrix.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <FieldLabel>DOFA ID / Matrix Name</FieldLabel>
            <input className={readonlyClass} value={`${record.id} — ${record.matrixName}`} readOnly disabled />
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
            <input className={inputClass} value={approvalLevel} readOnly disabled />
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
              value={finalDofa}
              onChange={(e) => setFinalDofa(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Approval Mail Copy</FieldLabel>
            <FileUploadField
              accept=".pdf,.doc,.docx,.eml,.msg"
              hint="PDF, DOC or EML"
              defaultFileName={record.approvalMailName}
              showPreview
              onFileChange={setMailFile}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray">
          DOFA ID / Matrix Name cannot be changed once created.
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
          DOFA matrix updated successfully.
        </div>
      )}
    </div>
  );
}