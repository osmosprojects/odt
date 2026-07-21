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
exports.OffersController = void 0;
const common_1 = require("@nestjs/common");
const offers_service_1 = require("./offers.service");
const swagger_1 = require("@nestjs/swagger");
let OffersController = class OffersController {
    constructor(offersService) {
        this.offersService = offersService;
    }
    findAll(query) {
        return this.offersService.findAll(query);
    }
    getPipelineS2() {
        return this.offersService.getPipelineS2();
    }
    findOne(id) {
        return this.offersService.findOne(Number(id));
    }
    create(dto) {
        return this.offersService.create(dto);
    }
    submitForApproval(id) {
        return this.offersService.submitForApproval(Number(id));
    }
    approveOfferLevel(id, body) {
        return this.offersService.approveOfferLevel(Number(id), body.level, body.comments);
    }
    rejectOffer(id, body) {
        return this.offersService.rejectOffer(Number(id), body.reason);
    }
    cancelOffer(id, body) {
        return this.offersService.cancelOffer(Number(id), body.reason);
    }
    extendOffer(id, body) {
        return this.offersService.extendOffer(Number(id), body);
    }
    submitClosure(id, closureData) {
        return this.offersService.submitClosure(Number(id), closureData);
    }
};
exports.OffersController = OffersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all offers with filters (Status, Stream, Channel)' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Offer Approval Pipeline Stage 2 Summary (offer-pipeline-s2)' }),
    (0, common_1.Get)('pipeline-s2'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "getPipelineS2", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get offer by ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new Offer Draft (Step 1-3)' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Submit Offer for DOFA / Workflow Approval' }),
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "submitForApproval", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Approve specific level in workflow (rtm, l1, l2, l3, cm)' }),
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "approveOfferLevel", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reject offer' }),
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "rejectOffer", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cancel / Recall offer' }),
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "cancelOffer", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Extend offer validity period' }),
    (0, common_1.Post)(':id/extend'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "extendOffer", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Submit Offer Closure Settlement' }),
    (0, common_1.Post)(':id/closure'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "submitClosure", null);
exports.OffersController = OffersController = __decorate([
    (0, swagger_1.ApiTags)('Offer Management & Creation'),
    (0, common_1.Controller)('api/offers'),
    __metadata("design:paramtypes", [offers_service_1.OffersService])
], OffersController);
//# sourceMappingURL=offers.controller.js.map