// Data models + mock data for the "Offer Management - admin apps" area:
//   1. DOFA Approval Flow  (Add / View / Edit)
//   2. Dollar Update       (New / List)

export type DofaStatus = "Active" | "Inactive";

export interface DofaLevel {
  level: number;
  limit:string;
  fromApproval: string;
  toApproval: string;  
}

export interface DofaMatrix {
  id: string; // DOFA ID
  matrixName: string;
  offerToolType: string;
  levels: DofaLevel[];
  finalDofa: string;
  approvalMailName?: string;
  lastModified: string; // DD/MM/YYYY
  status: DofaStatus;
}

export const offerToolTypes = [
  "CASN",
  "IWS",
  "WBC",
  "HLS"
];

export const approvals = [
  "Admin",
  "Customer Master",
  "SKU Master",
  "Distributor Master",
  "Item Master",
  "Terms Master",
  "Offer Master",
];


export const dofaMatrices: DofaMatrix[] = [
  {
    id: "DOFA-1001",
    matrixName: "WBC Standard Matrix",
    offerToolType: "WBC",
    levels: [
      { level: 1, limit: "50,000", fromApproval: "SKU Master", toApproval: "Distributor Master" },
      { level: 2, limit: "1,50,000", fromApproval: "Distributor Master", toApproval: "Terms Master" },
    ],
    finalDofa: "2,00,000",
    approvalMailName: "wbc-approval-chain.pdf",
    lastModified: "12/06/2026",
    status: "Active",
  },
  {
    id: "DOFA-1002",
    matrixName: "IWS Regional Matrix",
    offerToolType: "IWS",
    levels: [
      { level: 1, limit: "25,000", fromApproval: "Customer Master", toApproval: "SKU Master" },
      { level: 2, limit: "75,000", fromApproval: "SKU Master", toApproval: "Item Master" },
      { level: 3, limit: "1,25,000", fromApproval: "Item Master", toApproval: "Offer Master" },
    ],
    finalDofa: "1,50,000",
    approvalMailName: "ws-planner-approval.pdf",
    lastModified: "28/05/2026",
    status: "Active",
  },
  {
    id: "DOFA-1003",
    matrixName: "CASN Legacy Matrix",
    offerToolType: "CASN",
    levels: [
      { level: 1, limit: "40,000", fromApproval: "Admin", toApproval: "Terms Master" },
    ],
    finalDofa: "40,000",
    lastModified: "02/03/2026",
    status: "Inactive",
  },
];

export type DollarStatus = "Active" | "Expired" | "Upcoming";

export interface DollarRate {
  id: string; // ID / Code
  value: number;
  validFrom: string; // DD/MM/YYYY
  validTill?: string; // DD/MM/YYYY, optional
  addedDate: string; // DD/MM/YYYY
  approvalMailName?: string;
  status: DollarStatus;
}

export const dollarRates: DollarRate[] = [
  {
    id: "USD-2607",
    value: 83.42,
    validFrom: "01/07/2026",
    validTill: "31/07/2026",
    addedDate: "28/06/2026",
    approvalMailName: "dollar-rate-jul26.pdf",
    status: "Active",
  },
  {
    id: "USD-2606",
    value: 83.1,
    validFrom: "01/06/2026",
    validTill: "30/06/2026",
    addedDate: "29/05/2026",
    approvalMailName: "dollar-rate-jun26.pdf",
    status: "Expired",
  },
  {
    id: "USD-2608",
    value: 83.65,
    validFrom: "01/08/2026",
    addedDate: "10/07/2026",
    status: "Upcoming",
  },
];