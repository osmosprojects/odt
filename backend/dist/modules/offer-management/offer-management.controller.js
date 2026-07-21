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
exports.OfferManagementController = void 0;
const common_1 = require("@nestjs/common");
const offer_management_service_1 = require("./offer-management.service");
const swagger_1 = require("@nestjs/swagger");
let OfferManagementController = class OfferManagementController {
    constructor(offerManagementService) {
        this.offerManagementService = offerManagementService;
    }
    getDofaMatrices() {
        return this.offerManagementService.getDofaMatrices();
    }
    createDofaMatrix(matrix) {
        return this.offerManagementService.createDofaMatrix(matrix);
    }
    getDollarRates() {
        return this.offerManagementService.getDollarRates();
    }
    createDollarRate(rateData) {
        return this.offerManagementService.createDollarRate(rateData);
    }
};
exports.OfferManagementController = OfferManagementController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get DOFA Approval Flow Matrices' }),
    (0, common_1.Get)('dofa-approval-flow'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OfferManagementController.prototype, "getDofaMatrices", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new DOFA Approval Matrix' }),
    (0, common_1.Post)('dofa-approval-flow'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OfferManagementController.prototype, "createDofaMatrix", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Dollar Exchange Rate History' }),
    (0, common_1.Get)('dollar-update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OfferManagementController.prototype, "getDollarRates", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add/Update USD Exchange Rate' }),
    (0, common_1.Post)('dollar-update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OfferManagementController.prototype, "createDollarRate", null);
exports.OfferManagementController = OfferManagementController = __decorate([
    (0, swagger_1.ApiTags)('Admin Offer Configuration (DOFA & Dollar Update)'),
    (0, common_1.Controller)('api/offer-management'),
    __metadata("design:paramtypes", [offer_management_service_1.OfferManagementService])
], OfferManagementController);
//# sourceMappingURL=offer-management.controller.js.map