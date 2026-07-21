"use client";

import { useState } from "react";
import { FileUp, Download, Send } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import MasterUploadControl from "@/components/offer-letters/MasterUploadControl";
import FileUploadField from "@/components/offer-letters/FileUploadField";
import { masterTypeOptions, getCurrentMasterForType } from "@/lib/inputManagement";

export default function UploadMasterTypeFileForm() {
  const [masterName, setMasterName] = useState("");
  const [masterTypeFile, setMasterTypeFile] = useState<File | null>(null);
  const [referenceType, setReferenceType] = useState(masterTypeOptions[0]);
  const [approvalMail, setApprovalMail] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentMaster = getCurrentMasterForType(referenceType);

  const handleDownloadCurrentMaster = () => {
    if (!currentMaster) return;
    const blob = new Blob(
      [`Placeholder for current master on file: ${currentMaster.masterFileName}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentMaster.masterFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!masterName.trim()) return;
    setSubmitted(true);
    setMasterName("");
    setMasterTypeFile(null);
    setApprovalMail(null);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileUp size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Upload Master Type File
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <FieldLabel>Upload Master Name</FieldLabel>
          <input
            type="text"
            className={`${inputClass} py-3 text-sm`}
            placeholder="Enter master type file name"
            value={masterName}
            onChange={(e) => setMasterName(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>Master Type File</FieldLabel>
          <MasterUploadControl
            file={masterTypeFile}
            hint="Excel or CSV"
            onSelect={setMasterTypeFile}
            onRemove={() => setMasterTypeFile(null)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3.5">
          <span className="text-xs sm:text-sm text-brand-gray">
            {currentMaster
              ? `Current master on file: ${currentMaster.masterFileName}`
              : "No master on file yet"}
          </span>
          <button
            type="button"
            onClick={handleDownloadCurrentMaster}
            disabled={!currentMaster}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed shrink-0 ml-3"
          >
            <Download size={14} /> Download Current Master
          </button>
        </div>

        <div>
          <FieldLabel>Add Approval Mail Copy</FieldLabel>
          <FileUploadField
            accept=".msg,.eml,.pdf"
            hint=".msg, .eml or .pdf"
            onFileChange={setApprovalMail}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray">
          {submitted ? "Master type file submitted successfully." : "Master name is required."}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!masterName.trim()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary px-5 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={15} /> Submit
        </button>
      </div>
    </div>
  );
}