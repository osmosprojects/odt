"use client";

import { useEffect, useState } from "react";
import { FilePlus2, Download, Paperclip, Send } from "lucide-react";
import { FieldLabel, inputClass } from "@/components/ui/form";
import { offerLetterTypes, getCurrentMasterForType } from "@/lib/offerLetters";
import MasterUploadControl from "./MasterUploadControl";
import DocumentPreviewPanel from "./DocumentPreviewPanel";
import FileUploadField from "./FileUploadField";
import RecipientsInput from "./RecipientsInput";
import SubmitPreviewModal from "./SubmitPreviewModal";

export default function AddOfferLetterForm() {
  const [offerType, setOfferType] = useState("CASH Loan");
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [masterObjectUrl, setMasterObjectUrl] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const currentMaster = getCurrentMasterForType(offerType);

  // Keep a live object URL for the uploaded master so both the compact
  // upload control and the full document preview (inline + full-screen)
  // stay in sync with the same file.
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
    // Reset the form once the person confirms submission in the
    // full-screen preview and sees the success state.
    setMasterFile(null);
    setRecipients([]);
  };

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <FilePlus2 size={17} className="text-primary" />
        <h2 className="text-sm sm:text-base font-semibold text-brand-dark">
          Add Offer Letter
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column - basic fields */}
        <div className="space-y-4">
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
            <FileUploadField accept=".msg,.eml,.pdf" hint=".msg, .eml or .pdf" />
          </div>

          <div>
            <FieldLabel>Define Recipients</FieldLabel>
            <RecipientsInput value={recipients} onChange={setRecipients} />
          </div>
        </div>

        {/* Right column - real, editable document preview */}
        <div className="space-y-2 flex flex-col">
          <FieldLabel>
            <span className="text-brand-dark font-semibold">
              Document Preview
            </span>{" "}
            <span className="text-brand-gray">(edit anytime)</span>
          </FieldLabel>
          <div className="flex-1">
            <DocumentPreviewPanel
              file={masterFile}
              onSelect={setMasterFile}
              emptyHint="Upload the offer letter type master to see its preview here"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-brand-gray flex items-center gap-1.5">
          <Paperclip size={12} /> All fields except approval mail copy and
          recipients are required
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
          title="Preview Offer Letter"
          fileName={masterFile?.name ?? null}
          objectUrl={masterObjectUrl}
          onConfirm={handleConfirmSubmit}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}