"use client";

import { useEffect, useState } from "react";
import { FilePenLine, Download, Paperclip, Send } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import {
  offerLetters,
  offerLetterTypes,
  getCurrentMasterForType,
} from "@/lib/offerLetters";
import MasterUploadControl from "./MasterUploadControl";
import DocumentPreviewPanel from "./DocumentPreviewPanel";
import FileUploadField from "./FileUploadField";
import RecipientsInput from "./RecipientsInput";
import SubmitPreviewModal from "./SubmitPreviewModal";

export default function EditOfferLetterForm({
  offerLetterId,
}: {
  offerLetterId: string;
}) {
  const record =
    offerLetters.find((o) => o.id === offerLetterId) ?? offerLetters[0];
  const [offerType, setOfferType] = useState(record.type);
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [masterObjectUrl, setMasterObjectUrl] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<string[]>(record.recipients ?? []);
  const [previewOpen, setPreviewOpen] = useState(false);

  const currentMaster = getCurrentMasterForType(offerType);

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
    if (!currentMaster) return;
    const blob = new Blob(
      [`This is a placeholder for the current master document on file:\n\n${currentMaster.documentName}\nOffer Type: ${currentMaster.type}\nLast updated: ${currentMaster.createdDate}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentMaster.documentName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmSubmit = () => {
    // In a real app this is where the updated record would be persisted.
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <FilePenLine size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Edit Offer Letter
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column - basic fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Offer Letter ID</FieldLabel>
              <input
                type="text"
                disabled
                value={record.id}
                className={`${inputClass} bg-gray-50 text-brand-gray cursor-not-allowed`}
              />
            </div>
            <div>
              <FieldLabel>Created Date</FieldLabel>
              <input
                type="text"
                disabled
                value={record.createdDate}
                className={`${inputClass} bg-gray-50 text-brand-gray cursor-not-allowed`}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Select Offer Type</FieldLabel>
            <select
              className={inputClass}
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
            >
              {offerLetterTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Upload Offer Letter Type Master</FieldLabel>
            <MasterUploadControl
              file={masterFile}
              fileName={record.documentName}
              hint="PDF or Word"
              onSelect={setMasterFile}
              onRemove={() => setMasterFile(null)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
            <span className="text-xs text-brand-gray">
              {currentMaster
                ? `Current master on file: ${currentMaster.documentName}`
                : `No master on file yet for ${offerType}`}
            </span>
            <button
              type="button"
              onClick={handleDownloadCurrentMaster}
              disabled={!currentMaster}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed shrink-0 ml-3"
            >
              <Download size={13} />
            </button>
          </div>

          <div>
            <FieldLabel>Add Approval Mail Copy</FieldLabel>
            <FileUploadField
              accept=".msg,.eml,.pdf"
              hint=".msg, .eml or .pdf"
              defaultFileName={record.approvalMail ? "Approval_Mail_142.msg" : undefined}
            />
          </div>

          <div>
            <FieldLabel>Define Recipients</FieldLabel>
            <RecipientsInput value={recipients} onChange={setRecipients} />
          </div>
        </div>

        {/* Right column - real, editable document preview */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between">
            <FieldLabel>
              <span className="text-brand-dark font-semibold">
                Document Preview
              </span>{" "}
              <span className="text-brand-gray">(edit anytime)</span>
            </FieldLabel>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Editable
            </span>
          </div>
          <div className="flex-1">
            <DocumentPreviewPanel
              file={masterFile}
              fileName={record.documentName}
              documentUrl={record.documentUrl}
              onSelect={setMasterFile}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray flex items-center gap-1.5">
          <Paperclip size={12} /> Offer Letter ID and Created Date cannot be
          changed
        </p>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary px-5 py-2 rounded-lg hover:bg-primary-dark"
        >
          <Send size={15} /> Submit
        </button>
      </div>

      {previewOpen && (
        <SubmitPreviewModal
          title="Preview Offer Letter"
          fileName={masterFile?.name ?? record.documentName}
          objectUrl={masterObjectUrl}
          onConfirm={handleConfirmSubmit}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}