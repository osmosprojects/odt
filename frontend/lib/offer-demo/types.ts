export interface Customer {
  id: string;
  name: string;
  businessStream?: string;
  customerCode?: string;
  customerType: string;
  distributorName: string;
  distributorCode?: string;
  jdeCode: string;
  state: string;
  segment: string;
  subSegment: string;
  salesRep: string;
  executive?: string;
  executiveCode?: string; // used to look up previous offer history
  salesArea: string;
  address: string;
  previousWbc: string;
  previousWbcOffer: string;
  gstNumber: string;
  creditDays?: string;
  keyAccount?: string;
}

export interface SkuMasterItem {
  itemId: number;
  stream: string;
  skuCode: string;
  description: string;
  brandName: string;
  packSize: string;
  uom: string;
  baseTO: number;
  mrp: number;
  cogs: number;
  nhf: number;
  gmLevel: string;
  recMixIncentive: number;
  mixIncentive: number;
  skuRebate: number;
  productTargetIncentive: number;
  lbm?: string;
  pv?: string;
}

export interface PreviousOffer {
  found: true;
  offerId: number;
  offerCode: string;
  offerType: string;
  offerStatus: string;
  startDate: string | null;
  endDate: string | null;
  contractTenure: string;
  contractVolume: number;
  volumeCommitment: number;
  totalGrossMargin: number;
  investment: number;
  gmpl: number;
  gmplDofa: string;
  totalCustLvlInput: number;
  totalNetPrice: number;
  customerName: string;
  executiveCode: string;
  remark?: string;
  AR_SEOL_current?: number;
  total_investment_current?: number;
  rs_l_investment_current?: number;
  gmpl_current?: number;
  arSeol?: number;
  totalInvestment?: number;
  rsLtrInvestment?: number;
  investmentRate?: number;
  skus?: any[];
  previousSkus?: any[];
  previousSkuDetails?: any[];
  historicalPackage?: any;
  customerPerformance?: any;
  previousContract?: any;
  previousOfferSummary?: any;
  data?: any;
  history: PreviousOffer[];
}

export interface NoPreviousOffer {
  found: false;
  message: string;
  offerId?: undefined;
  offerCode?: undefined;
  contractVolume?: undefined;
  contractTenure?: undefined;
  history?: undefined;
}

export type PreviousOfferResult = PreviousOffer | NoPreviousOffer;

export type PreviousOfferStatus = 'idle' | 'loading' | 'loaded' | 'not_found' | 'error';

export interface PreviousOfferState {
  status: PreviousOfferStatus;
  customerCode: string | null;
  requestId: number;
  data: PreviousOffer | null;
  error: string | null;
}

export interface Sku {
  skuCode: string;
  skuName: string;
  skuDataOption: string;
  cogs: number;
  lbmName: string;
  pvName: string;
  recMixIncentive: number;
  mixIncentive: number;
  skuRebate: number;
  productTargetIncentive: number;
  baseTO?: number;
  baseCOGS?: number;
  lbm?: string;
  pv?: string;
}

export interface SkuRow extends Sku {
  id: string;
  contractVolume: number;
  focVolume: number;
  totalInput: number;
  surcharge: number;
  nhf: number;
  productTargetIncentiveDisbVol?: number;
  productTargetIncentiveDisbMonths?: number;
  productTargetIncentiveDisbAmt?: number;
  lbm?: string;
  pv?: string;
}

export interface Offer {
  id: string;
  name: string;
  customerName: string;
  offerCode: string;
  offerStream: string;
  status: string;
  createdDate: string;
  volume: number;
  value: number;
  gmpl: number;
  dofaLevel: string;
}

export interface YearlyPlan {
  year: number;
  volume: number;
  monthlyVolume: number;
  volumePct: number;
  advanceRebate: number;
  advanceRebatePct: number;
}

export interface FormData {
  // Offer Basics
  offerStream: string;
  offerCreationType: string;
  dollarValue: number;

  // Selected Customer
  selectedCustomer: Customer | null;

  // Previous offer (loaded from odt_offer_details after customer selection)
  previousOffer: PreviousOfferResult | null;
  previousOfferState?: PreviousOfferState;

  // Past Actual Performance (editable overrides)
  prevOfferCommitment: number;
  prevOfferActual: number;
  months: number;
  periodFrom: string;
  periodTo: string;
  volumePM: number;
  actualPM: number;
  synthShare: number;
  synthShareActual: number;
  commitment: number;
  actual: number;
  arSeol: string;
  targetIncentive: number;
  additionalInput: number;
  signOnBonus: number;
  others: number;
  totalInvestment: number;
  rsLtrInvestment: number;
  skuLevelRebate: number;
  totalFocValue: number;
  prevGmpl: number;
  remark: string;

  // KERIS / TVD
  kerisCode: string;
  tvdParentId: string;

  // Competitor Offer
  competitorDetails: string;

  // Sales Remarks
  whyInvest: string;
  associatedWithCastrol: string;
  significanceWithCastrol: string;
  upTradingOpportunities: string;
  risksToVolume: string;
  mitigationToRisk: string;
  groupBelongsTo: string;
  otherQualitativeInfo: string;

  // Section 2: Investment Details
  investmentType: string;
  investmentRationale: string;
  bpBankFunded: string;
  planningStatus: string;
  investmentTerm: string;
  startDate: string;
  endDate: string;
  existingLoanBalance: number;
  existingLoanEndDate: string;
  existingLoanVolumeRemaining: number;
  additionalCashLoan: number;
  additionalEquipmentLoan: number;
  totalAdditionalLoan: number;
  totalTradeLoan: number;
  totalVolumeCommitment: number;
  amortizationRatePerLitre: number;

  // Yearly Plans
  yearlyPlans: YearlyPlan[];

  // Bank Guarantee
  bgEndDate: string;
  bgTenure: string;
  bgAmount: number;
  bgAmountPctOfAr: number;
  bankName: string;
  bankAddress: string;
  gstNumberBg: string;
  gstNameBg: string;
  bgTenureCheck: boolean;

  // Credit Input
  creditTerm: number;
  primaryCustomerCreditTerm: number;
  tradingCreditLimit: number;
  existingSecurity: number;
  additionalSecurityRequired: number;
  totalCreditExposure: number;

  // Customer Level Inputs (disbursements)
  targetIncentiveDisbVol: number;
  targetIncentiveDisbMonths: number;
  targetIncentiveDisbAmt: number;
  secondaryTransportCost: number;

  // Selected SKUs
  selectedSkus: SkuRow[];
}
