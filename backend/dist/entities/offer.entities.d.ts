export declare class OfferDetail {
    offerId: number;
    offerCode: string;
    executiveCode: string;
    customerCode: string;
    customerName: string;
    stream: string;
    channel: string;
    territoryCode: string;
    zoneCode: string;
    regionCode: string;
    startDate: string;
    endDate: string;
    storedExchangeRateLcUsd: number;
    salesTaxVatRate: number;
    totalVolumeCommitment: string;
    totalTradeLoan: string;
    creditTermDays: string;
    tradingCreditLimit: string;
    offerStatus: string;
    closureStatus: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class OfferApprovalTransaction {
    txnId: number;
    offerId: number;
    stream: string;
    channel: string;
    rtmStatus: string;
    rtmCode: string;
    rtmComments: string;
    l1Status: string;
    l1Code: string;
    l1Comments: string;
    l2Status: string;
    l2Code: string;
    l2Comments: string;
    l3Status: string;
    l3Code: string;
    l3Comments: string;
    cmStatus: string;
    cmCode: string;
    createdAt: Date;
}
export declare class OfferClosureTransaction {
    closureId: number;
    offerId: number;
    addedDate: string;
    addedBy: string;
    volumeStatus: string;
    recoveryStatus: string;
    createdAt: Date;
}
export declare class OfferLetterDetail {
    letterId: number;
    offerId: number;
    executiveCode: string;
    offerFilePath: string;
    offerLetterStatus: string;
    serialNo: string;
    createdAt: Date;
}
export declare class OfferSkuDetail {
    skuDetailId: number;
    offerId: number;
    skuCode: string;
    skuName: string;
    volumeLitres: number;
    rebatePerLitre: number;
    status: string;
}
