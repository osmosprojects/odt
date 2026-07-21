"use client";

import { useEffect, useState } from "react";
import { Landmark, Download, Paperclip, Send } from "lucide-react";
import { FieldLabel } from "@/components/ui/form";
import MasterUploadControl from "@/components/offer-letters/MasterUploadControl";
import FileUploadField from "@/components/offer-letters/FileUploadField";
import SubmitPreviewModal from "@/components/offer-letters/SubmitPreviewModal";
import { mailerConditionMaster } from "@/lib/mailer";

export default function MailerMasterUpload() {
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [masterObjectUrl, setMasterObjectUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!masterFile) {
      setMasterObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(masterFile);
    setMasterObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [masterFile]);

  const handleDownloadCurrentMaster = () => {
    const blob = new Blob(
      [
        `This is a placeholder for the current mailer condition master on file:\n\n${mailerConditionMaster.documentName}\nLast updated: ${mailerConditionMaster.updatedDate} by ${mailerConditionMaster.updatedBy}`,
      ],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mailerConditionMaster.documentName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmSubmit = () => {
    setMasterFile(null);
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Landmark size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Mailer Master Upload
        </h2>
      </div>
      <p className="text-xs text-brand-gray mb-5">
        Manage the master file that defines all available mailer conditions.
      </p>

      <div className="w-full space-y-4">
        <div>
          <FieldLabel>Upload Condition Master</FieldLabel>
          <MasterUploadControl
            file={masterFile}
            hint="Excel or CSV"
            accept=".xlsx,.xls,.csv"
            onSelect={setMasterFile}
            onRemove={() => setMasterFile(null)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
          <span className="text-xs text-brand-gray">
            Current master on file: {mailerConditionMaster.documentName}
          </span>
          <button
            type="button"
            onClick={handleDownloadCurrentMaster}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0 ml-3"
          >
            <Download size={13} /> Download Current Mailer Condition Master
          </button>
        </div>

        <div>
          <FieldLabel>Add Approval Mail Copy</FieldLabel>
          <FileUploadField accept=".msg,.eml,.pdf" hint=".msg, .eml or .pdf" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray flex items-center gap-1.5">
          <Paperclip size={12} /> Only the condition master upload is
          required
        </p>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          disabled={!masterFile}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary px-5 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={15} /> Submit
        </button>
      </div>

      {previewOpen && (
        <SubmitPreviewModal
          title="Preview Mailer Condition Master"
          fileName={masterFile?.name ?? null}
          objectUrl={masterObjectUrl}
          onConfirm={handleConfirmSubmit}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}