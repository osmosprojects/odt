export declare class OfferLettersService {
    private letters;
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
    generateLetter(offerId: number): {
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
