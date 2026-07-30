export interface WbcPeriod {
  startMonth: string;
  durationMonths: number;
  endMonth: string;
}

export type OfferStatus = 
  | "Draft"
  | "Pending Approval"
  | "Published"
  | "Closed / Closure"
  | "Cancelled";

export interface PipelineOffer {
  offerCode: string;
  customerName: string;
  customerBadges: string[]; // e.g. ["DIRECT", "Existing Customer"]
  segment: string;
  wbcPeriod: WbcPeriod;
  committedVol: number;
  totalInvestment: number;
  avgGmpl: number;
  dofaApproval: string; // e.g. "Area Sales Manager", "Sales Director"
  status: OfferStatus;
}
