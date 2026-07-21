export interface CreateOfferDto {
    customerCode: string;
    customerName: string;
    stream: string;
    channel: string;
    territoryCode?: string;
    startDate: string;
    endDate: string;
    totalVolumeCommitment: string;
    totalTradeLoan: string;
    creditTermDays: string;
    tradingCreditLimit: string;
    skuItems?: Array<{
        skuCode: string;
        skuName: string;
        volumeLitres: number;
        rebatePerLitre: number;
    }>;
}
export declare class OffersService {
    private offersMock;
    findAll(query?: any): {
        total: number;
        data: {
            offerId: number;
            offerCode: string;
            customerCode: string;
            customerName: string;
            stream: string;
            channel: string;
            territoryCode: string;
            startDate: string;
            endDate: string;
            totalVolumeCommitment: string;
            totalTradeLoan: string;
            creditTermDays: string;
            tradingCreditLimit: string;
            offerStatus: string;
            closureStatus: string;
            approvalFlow: {
                currentLevel: string;
                rtmStatus: string;
                l1Status: string;
                l2Status: string;
                l3Status: string;
                cmStatus: string;
            };
            createdAt: string;
        }[];
    };
    getPipelineS2(): {
        stage: string;
        activeOffersCount: number;
        offers: {
            offerId: number;
            offerCode: string;
            customerName: string;
            currentApprover: string;
            totalVolume: string;
            totalLoan: string;
            status: string;
        }[];
    };
    findOne(id: number): {
        offerId: number;
        offerCode: string;
        customerCode: string;
        customerName: string;
        stream: string;
        channel: string;
        territoryCode: string;
        startDate: string;
        endDate: string;
        totalVolumeCommitment: string;
        totalTradeLoan: string;
        creditTermDays: string;
        tradingCreditLimit: string;
        offerStatus: string;
        closureStatus: string;
        approvalFlow: {
            currentLevel: string;
            rtmStatus: string;
            l1Status: string;
            l2Status: string;
            l3Status: string;
            cmStatus: string;
        };
        createdAt: string;
    };
    create(dto: CreateOfferDto): {
        message: string;
        offer: {
            offerId: number;
            offerCode: string;
            customerCode: string;
            customerName: string;
            stream: string;
            channel: string;
            territoryCode: string;
            startDate: string;
            endDate: string;
            totalVolumeCommitment: string;
            totalTradeLoan: string;
            creditTermDays: string;
            tradingCreditLimit: string;
            offerStatus: string;
            closureStatus: string;
            approvalFlow: {
                currentLevel: string;
                rtmStatus: string;
                l1Status: string;
                l2Status: string;
                l3Status: string;
                cmStatus: string;
            };
            createdAt: string;
        };
    };
    submitForApproval(id: number): {
        message: string;
        offer: {
            offerId: number;
            offerCode: string;
            customerCode: string;
            customerName: string;
            stream: string;
            channel: string;
            territoryCode: string;
            startDate: string;
            endDate: string;
            totalVolumeCommitment: string;
            totalTradeLoan: string;
            creditTermDays: string;
            tradingCreditLimit: string;
            offerStatus: string;
            closureStatus: string;
            approvalFlow: {
                currentLevel: string;
                rtmStatus: string;
                l1Status: string;
                l2Status: string;
                l3Status: string;
                cmStatus: string;
            };
            createdAt: string;
        };
    };
    approveOfferLevel(id: number, level: string, comments?: string): {
        message: string;
        offer: {
            offerId: number;
            offerCode: string;
            customerCode: string;
            customerName: string;
            stream: string;
            channel: string;
            territoryCode: string;
            startDate: string;
            endDate: string;
            totalVolumeCommitment: string;
            totalTradeLoan: string;
            creditTermDays: string;
            tradingCreditLimit: string;
            offerStatus: string;
            closureStatus: string;
            approvalFlow: {
                currentLevel: string;
                rtmStatus: string;
                l1Status: string;
                l2Status: string;
                l3Status: string;
                cmStatus: string;
            };
            createdAt: string;
        };
    };
    rejectOffer(id: number, reason: string): {
        message: string;
        reason: string;
        offer: {
            offerId: number;
            offerCode: string;
            customerCode: string;
            customerName: string;
            stream: string;
            channel: string;
            territoryCode: string;
            startDate: string;
            endDate: string;
            totalVolumeCommitment: string;
            totalTradeLoan: string;
            creditTermDays: string;
            tradingCreditLimit: string;
            offerStatus: string;
            closureStatus: string;
            approvalFlow: {
                currentLevel: string;
                rtmStatus: string;
                l1Status: string;
                l2Status: string;
                l3Status: string;
                cmStatus: string;
            };
            createdAt: string;
        };
    };
    cancelOffer(id: number, reason: string): {
        message: string;
        reason: string;
        offer: {
            offerId: number;
            offerCode: string;
            customerCode: string;
            customerName: string;
            stream: string;
            channel: string;
            territoryCode: string;
            startDate: string;
            endDate: string;
            totalVolumeCommitment: string;
            totalTradeLoan: string;
            creditTermDays: string;
            tradingCreditLimit: string;
            offerStatus: string;
            closureStatus: string;
            approvalFlow: {
                currentLevel: string;
                rtmStatus: string;
                l1Status: string;
                l2Status: string;
                l3Status: string;
                cmStatus: string;
            };
            createdAt: string;
        };
    };
    extendOffer(id: number, extensionData: {
        extensionMonths: number;
        newEndDate: string;
        remarks?: string;
    }): {
        message: string;
        extensionDetails: {
            extensionMonths: number;
            newEndDate: string;
            remarks?: string;
        };
        offer: {
            offerId: number;
            offerCode: string;
            customerCode: string;
            customerName: string;
            stream: string;
            channel: string;
            territoryCode: string;
            startDate: string;
            endDate: string;
            totalVolumeCommitment: string;
            totalTradeLoan: string;
            creditTermDays: string;
            tradingCreditLimit: string;
            offerStatus: string;
            closureStatus: string;
            approvalFlow: {
                currentLevel: string;
                rtmStatus: string;
                l1Status: string;
                l2Status: string;
                l3Status: string;
                cmStatus: string;
            };
            createdAt: string;
        };
    };
    submitClosure(id: number, closureData: any): {
        message: string;
        closureDetails: any;
    };
}
