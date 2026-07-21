// src/enums/offer-status.enum.ts
// PHP equivalent: scattered string checks like if ($status == 'A') / if ($status == 'D')
export enum OfferStatus {
  D = 'D', // Draft
  P = 'P', // Pending Approval
  A = 'A', // Approved
  E = 'E', // Expired
  C = 'C', // Closed
  I = 'I', // Inactive
}

// PHP equivalent: $offer_type == 'STANDARD' / 'PITSTOP' / 'IWS' / 'TATAPCD'
export enum OfferCategory {
  STANDARD = 'STANDARD',
  PITSTOP = 'PITSTOP',
  IWS = 'IWS',
  TATAPCD = 'TATAPCD',
}

// PHP equivalent: $is_amendment / $is_extension flags
export enum OfferType {
  ORIGINAL = 'ORIGINAL',
  AMENDMENT = 'AMENDMENT',
  EXTENDED = 'EXTENDED',
}