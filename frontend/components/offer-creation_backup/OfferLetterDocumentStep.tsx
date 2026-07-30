"use client";

import { useState } from "react";
import { FileStack, Download, Sparkles } from "lucide-react";
import StepCard, { FieldLabel, inputClass } from "./StepCard";
import FileUploadField from "@/components/offer-letters/FileUploadField";
import OfferLetterPreviewPanel from "@/components/offer-letters/OfferLetterPreviewPanel";
import RecipientsInput from "@/components/offer-letters/RecipientsInput";
import { offerLetterTypes, getCurrentMasterForType } from "@/lib/offerLetters";

const sampleContent = `Dear [Customer Name],

We are pleased to offer you the following facility under our [Offer Type] scheme, subject to the terms and conditions outlined below...`;

export default function OfferLetterDocumentStep() {
  const [generated, setGenerated] = useState(false);
  const [content, setContent] = useState("");
  const [offerType, setOfferType] = useState("CASH Loan");
  const [recipients, setRecipients] = useState<string[]>([]);

  const currentMaster = getCurrentMasterForType(offerType);

  const handleGenerate = () => {
    setGenerated(true);
    setContent(sampleContent);
  };

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

  return (
    <StepCard step={13} title="Offer Letter Document" icon={FileStack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Left: upload fields */}
        <div className="space-y-3">
          <div>
            <FieldLabel>Select Offer Letter Type</FieldLabel>
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
            <FileUploadField hint="PDF or Word" showPreview />
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

        {/* Right: generate & preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel>
              <span className="text-brand-dark font-semibold">
                Generate Offer Letter
              </span>{" "}
              <span className="text-brand-gray">(Preview and edit)</span>
            </FieldLabel>
            {generated && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                Generated
              </span>
            )}
          </div>

          {!generated ? (
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-8 text-brand-gray hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Sparkles size={18} />
              <span className="text-xs font-medium">Generate Offer Letter</span>
            </button>
          ) : (
            <OfferLetterPreviewPanel content={content} onChange={setContent} />
          )}
        </div>
      </div>
    </StepCard>
  );
}