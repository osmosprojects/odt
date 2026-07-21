"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const master_data_module_1 = require("./modules/master-data/master-data.module");
const offers_module_1 = require("./modules/offers/offers.module");
const offer_management_module_1 = require("./modules/offer-management/offer-management.module");
const input_management_module_1 = require("./modules/input-management/input-management.module");
const offer_letters_module_1 = require("./modules/offer-letters/offer-letters.module");
const reports_module_1 = require("./modules/reports/reports.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const database_config_1 = require("./config/database.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot(database_config_1.userDbConfig),
            typeorm_1.TypeOrmModule.forRoot(database_config_1.roleDbConfig),
            typeorm_1.TypeOrmModule.forRoot(database_config_1.offerDbConfig),
            typeorm_1.TypeOrmModule.forRoot(database_config_1.masterDbConfig),
            typeorm_1.TypeOrmModule.forRoot(database_config_1.notificationDbConfig),
            typeorm_1.TypeOrmModule.forRoot(database_config_1.auditDbConfig),
            auth_module_1.AuthModule,
            master_data_module_1.MasterDataModule,
            offers_module_1.OffersModule,
            offer_management_module_1.OfferManagementModule,
            input_management_module_1.InputManagementModule,
            offer_letters_module_1.OfferLettersModule,
            reports_module_1.ReportsModule,
            notifications_module_1.NotificationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map