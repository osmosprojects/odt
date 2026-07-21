import { OfferLettersService } from './offer-letters.service';
export declare class OfferLettersController {
    private readonly offerLettersService;
    constructor(offerLettersService: OfferLettersService);
    findAll(): {
        letterId: number;
        offerId: number;
        offerCode: string;
        customerName: string;
        executiveCode: string;
        offerLetterStatus: string;
        serialNo: string;
        filePath: string;
        createdAt: string;
    }[];
    generateLetter(offerId: string): {
        message: string;
        letter: {
            letterId: number;
            offerId: number;
            offerCode: string;
            customerName: string;
            executiveCode: string;
            offerLetterStatus: string;
            serialNo: string;
            filePath: string;
            createdAt: string;
        };
    };
}
