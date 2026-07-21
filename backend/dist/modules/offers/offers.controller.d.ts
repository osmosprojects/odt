import { OffersService, CreateOfferDto } from './offers.service';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    findAll(query: any): {
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
    findOne(id: string): {
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
    submitForApproval(id: string): {
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
    approveOfferLevel(id: string, body: {
        level: string;
        comments?: string;
    }): {
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
    rejectOffer(id: string, body: {
        reason: string;
    }): {
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
    cancelOffer(id: string, body: {
        reason: string;
    }): {
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
    extendOffer(id: string, body: {
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
    submitClosure(id: string, closureData: any): {
        message: string;
        closureDetails: any;
    };
}
