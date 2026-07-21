import { OfferManagementService } from './offer-management.service';
export declare class OfferManagementController {
    private readonly offerManagementService;
    constructor(offerManagementService: OfferManagementService);
    getDofaMatrices(): {
        id: string;
        matrixName: string;
        offerToolType: string;
        levels: {
            level: number;
            limit: string;
            fromApproval: string;
            toApproval: string;
        }[];
        finalDofa: string;
        approvalMailName: string;
        lastModified: string;
        status: string;
    }[];
    createDofaMatrix(matrix: any): any;
    getDollarRates(): {
        id: string;
        value: number;
        validFrom: string;
        validTill: string;
        addedDate: string;
        approvalMailName: string;
        status: string;
    }[];
    createDollarRate(rateData: any): {
        id: string;
        value: number;
        validFrom: any;
        validTill: any;
        addedDate: string;
        approvalMailName: any;
        status: string;
    };
}
