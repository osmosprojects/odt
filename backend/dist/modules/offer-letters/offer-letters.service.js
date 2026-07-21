"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferLettersService = void 0;
const common_1 = require("@nestjs/common");
let OfferLettersService = class OfferLettersService {
    constructor() {
        this.letters = [
            {
                letterId: 1,
                offerId: 101,
                offerCode: 'OFF-WBC-2026-001',
                customerName: 'Apex Motors Ltd',
                executiveCode: 'EMP1001',
                offerLetterStatus: 'P',
                serialNo: 'OL-2026-0982',
                filePath: '/downloads/letters/OL-2026-0982.pdf',
                createdAt: '2026-07-16T11:00:00Z',
            },
            {
                letterId: 2,
                offerId: 102,
                offerCode: 'OFF-WBC-2026-002',
                customerName: 'Metro Logistics Corp',
                executiveCode: 'EMP1002',
                offerLetterStatus: 'E',
                serialNo: 'OL-2026-0983',
                filePath: '/downloads/letters/OL-2026-0983.pdf',
                createdAt: '2026-07-18T14:30:00Z',
            },
        ];
    }
    findAll() {
        return this.letters;
    }
    generateLetter(offerId) {
        const newLetter = {
            letterId: this.letters.length + 1,
            offerId,
            offerCode: `OFF-WBC-2026-${String(offerId).padStart(3, '0')}`,
            customerName: 'Generated Customer',
            executiveCode: 'EMP1001',
            offerLetterStatus: 'P',
            serialNo: `OL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            filePath: `/downloads/letters/OL-2026-${offerId}.pdf`,
            createdAt: new Date().toISOString(),
        };
        this.letters.unshift(newLetter);
        return {
            message: 'Offer letter PDF generated successfully',
            letter: newLetter,
        };
    }
};
exports.OfferLettersService = OfferLettersService;
exports.OfferLettersService = OfferLettersService = __decorate([
    (0, common_1.Injectable)()
], OfferLettersService);
//# sourceMappingURL=offer-letters.service.js.map