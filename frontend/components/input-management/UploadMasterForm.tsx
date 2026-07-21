"use client";

import { useState } from "react";
import { UploadCloud, Download, Send } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import MasterUploadControl from "@/components/offer-letters/MasterUploadControl";
import FileUploadField from "@/components/offer-letters/FileUploadField";
import { masterTypeOptions, getCurrentMasterForType } from "@/lib/inputManagement";

export default function UploadMasterForm() {
  const [masterType, setMasterType] = useState(masterTypeOptions[0]);
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [approvalMail, setApprovalMail] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentMaster = getCurrentMasterForType(masterType);

  const handleSampleDownload = () => {
    const blob = new Blob(
      [`Sample master template for: ${masterType}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${masterType.replace(/\s+/g, "_").toLowerCase()}_sample.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!masterFile) return;
    setSubmitted(true);
    setMasterFile(null);
    setApprovalMail(null);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <UploadCloud size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Upload Master
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <FieldLabel>Master Upload</FieldLabel>
          <MasterUploadControl
            file={masterFile}
            hint="Excel or CSV"
            onSelect={setMasterFile}
            onRemove={() => setMasterFile(null)}
          />
        </div>

        <div>
          <FieldLabel>Master Type</FieldLabel>
          <select
            className={`${inputClass} py-3 text-sm`}
            value={masterType}
            onChange={(e) => setMasterType(e.target.value)}
          >
            {masterTypeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3.5">
          <span className="text-xs sm:text-sm text-brand-gray">Sample Download:</span>
          <button
            type="button"
            onClick={handleSampleDownload}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline shrink-0 ml-3"
          >
            <Download size={14} /> Download Sample
          </button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3.5">
          <span className="text-xs sm:text-sm text-brand-gray">Master Last Updated on:</span>
          <span className="text-xs sm:text-sm font-medium text-brand-dark ml-3">
            {currentMaster ? currentMaster.lastUpdatedOn : "Not uploaded yet"}
          </span>
        </div>

        <div className="lg:col-span-2">
          <FieldLabel>Approval Mail Copy</FieldLabel>
          <FileUploadField
            accept=".msg,.eml,.pdf"
            hint=".msg, .eml or .pdf"
            onFileChange={setApprovalMail}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray">
          {submitted ? "Master uploaded successfully." : "Master upload and type are required."}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!masterFile}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary px-5 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={15} /> Submit
        </button>
      </div>
    </div>
  );
}