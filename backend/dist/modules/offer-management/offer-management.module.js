"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferManagementModule = void 0;
const common_1 = require("@nestjs/common");
const offer_management_service_1 = require("./offer-management.service");
const offer_management_controller_1 = require("./offer-management.controller");
let OfferManagementModule = class OfferManagementModule {
};
exports.OfferManagementModule = OfferManagementModule;
exports.OfferManagementModule = OfferManagementModule = __decorate([
    (0, common_1.Module)({
        controllers: [offer_management_controller_1.OfferManagementController],
        providers: [offer_management_service_1.OfferManagementService],
        exports: [offer_management_service_1.OfferManagementService],
    })
], OfferManagementModule);
//# sourceMappingURL=offer-management.module.js.map