export type OfferLetterStatus = "Active" | "Paused";

export interface OfferLetter {
  id: string;
  type: string;
  approvalMail: boolean;
  createdDate: string;
  status: OfferLetterStatus;
  documentUrl?: string;
  documentName: string;
  recipients?: string[];
}

export const offerLetterTypes = ["None", "CASH Loan", "CASN", "IWS"];

export const offerLetters: OfferLetter[] = [
  {
    id: "OL-2026-0142",
    type: "CASH Loan",
    approvalMail: true,
    createdDate: "12/06/2026",
    status: "Active",
    documentName: "CashLoan_Offer_Template_v3.pdf",
    recipients: ["credit.ops@castrol.com", "loans.desk@castrol.com"],
  },
  {
    id: "OL-2026-0139",
    type: "CASN",
    approvalMail: true,
    createdDate: "05/06/2026",
    status: "Active",
    documentName: "CASN_Offer_Template.pdf",
    recipients: ["casn.team@castrol.com"],
  },
  {
    id: "OL-2026-0133",
    type: "IWS",
    approvalMail: false,
    createdDate: "28/05/2026",
    status: "Paused",
    documentName: "IWS_Offer_Template_v2.docx",
    recipients: [],
  },
  {
    id: "OL-2026-0128",
    type: "CASH Loan",
    approvalMail: true,
    createdDate: "19/05/2026",
    status: "Active",
    documentName: "CashLoan_Offer_Template_v2.pdf",
    recipients: ["credit.ops@castrol.com"],
  },
  {
    id: "OL-2026-0121",
    type: "CASN",
    approvalMail: false,
    createdDate: "02/05/2026",
    status: "Paused",
    documentName: "CASN_Offer_Template_draft.docx",
    recipients: [],
  },
];

/**
 * Returns the current (most recently active) master document on file
 * for a given offer type, so the UI can offer it up for download before
 * a user overwrites it with a new upload.
 */
export function getCurrentMasterForType(
  type: string
): OfferLetter | undefined {
  if (type === "None") return undefined;
  return offerLetters
    .filter((o) => o.type === type)
    .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1))[0];
}


/* ------------------------------------------------------------------ */
/* Offer Master (per-type template) management                        */
/* ------------------------------------------------------------------ */

export interface OfferMaster {
  id: string;
  type: string;
  documentName: string;
  approvalMailName?: string;
  updatedDate: string;
  updatedBy: string;
  recipients: string[];
}

export const offerMasters: OfferMaster[] = [
  {
    id: "OM-CASHLOAN",
    type: "CASH Loan",
    documentName: "CashLoan_Offer_Template_v3.pdf",
    approvalMailName: "Approval_Mail_CashLoan.msg",
    updatedDate: "12/06/2026",
    updatedBy: "Castrol B2B Admin",
    recipients: ["credit.ops@castrol.com", "loans.desk@castrol.com"],
  },
  {
    id: "OM-CASN",
    type: "CASN",
    documentName: "CASN_Offer_Template.pdf",
    approvalMailName: "Approval_Mail_CASN.msg",
    updatedDate: "05/06/2026",
    updatedBy: "Castrol B2B Admin",
    recipients: ["casn.team@castrol.com"],
  },
  {
    id: "OM-IWS",
    type: "IWS",
    documentName: "IWS_Offer_Template_v2.docx",
    updatedDate: "28/05/2026",
    updatedBy: "Castrol B2B Admin",
    recipients: [],
  },
];

/** Returns the saved master record (if any) for a given offer type. */
export function getMasterForType(type: string): OfferMaster | undefined {
  return offerMasters.find((m) => m.type === type);
}