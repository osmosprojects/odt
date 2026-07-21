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
exports.MasterDataController = void 0;
const common_1 = require("@nestjs/common");
const master_data_service_1 = require("./master-data.service");
const swagger_1 = require("@nestjs/swagger");
let MasterDataController = class MasterDataController {
    constructor(masterDataService) {
        this.masterDataService = masterDataService;
    }
    getStreams() {
        return this.masterDataService.getStreams();
    }
    getChannels(streamCode) {
        return this.masterDataService.getChannels(streamCode);
    }
    getZones() {
        return this.masterDataService.getZones();
    }
    getRegions(zoneCode) {
        return this.masterDataService.getRegions(zoneCode);
    }
    getCustomers(query) {
        return this.masterDataService.getCustomers(query);
    }
    getSkus() {
        return this.masterDataService.getSkus();
    }
};
exports.MasterDataController = MasterDataController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Streams (B2B/B2C)' }),
    (0, common_1.Get)('streams'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getStreams", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Channels (PCO, MCO, CVO, FWS, HD, RETAIL)' }),
    (0, common_1.Get)('channels'),
    __param(0, (0, common_1.Query)('streamCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getChannels", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Zones' }),
    (0, common_1.Get)('zones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getZones", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Regions' }),
    (0, common_1.Get)('regions'),
    __param(0, (0, common_1.Query)('zoneCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getRegions", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Customer Master Records' }),
    (0, common_1.Get)('customers'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getCustomers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get SKU Master Records' }),
    (0, common_1.Get)('skus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getSkus", null);
exports.MasterDataController = MasterDataController = __decorate([
    (0, swagger_1.ApiTags)('Master Data'),
    (0, common_1.Controller)('api/master-data'),
    __metadata("design:paramtypes", [master_data_service_1.MasterDataService])
], MasterDataController);
//# sourceMappingURL=master-data.controller.js.map