"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferLettersController = void 0;
const common_1 = require("@nestjs/common");
const offer_letters_service_1 = require("./offer-letters.service");
const swagger_1 = require("@nestjs/swagger");
let OfferLettersController = class OfferLettersController {
    constructor(offerLettersService) {
        this.offerLettersService = offerLettersService;
    }
    findAll() {
        return this.offerLettersService.findAll();
    }
    generateLetter(offerId) {
        return this.offerLettersService.generateLetter(Number(offerId));
    }
};
exports.OfferLettersController = OfferLettersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all generated offer letters' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OfferLettersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Generate commercial offer letter PDF' }),
    (0, common_1.Post)('generate/:offerId'),
    __param(0, (0, common_1.Param)('offerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OfferLettersController.prototype, "generateLetter", null);
exports.OfferLettersController = OfferLettersController = __decorate([
    (0, swagger_1.ApiTags)('Offer Letters (PDF Generation & Management)'),
    (0, common_1.Controller)('api/offer-letters'),
    __metadata("design:paramtypes", [offer_letters_service_1.OfferLettersService])
], OfferLettersController);
//# sourceMappingURL=offer-letters.controller.js.map