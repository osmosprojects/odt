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
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const offer_module_1 = require("./modules/offer/offer.module");
const common_module_1 = require("./common/common.module");
const approval_module_1 = require("./modules/approval/approval.module");
const sku_module_1 = require("./modules/sku/sku.module");
const customer_module_1 = require("./modules/customer/customer.module");
const pid_module_1 = require("./modules/pid/pid.module");
const reports_module_1 = require("./modules/reports/reports.module");
const schedule_1 = require("@nestjs/schedule");
const mail_module_1 = require("./modules/mail/mail.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const database_service_1 = require("./database/database.service");
const item_module_1 = require("./modules/item/item.module");
const offer_history_module_1 = require("./modules/offer-history/offer-history.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    (0, path_1.join)(process.cwd(), '.env'),
                    (0, path_1.join)(process.cwd(), 'apps/api/.env'),
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 3307),
                    username: config.get('DB_USERNAME', 'root'),
                    password: config.get('DB_PASSWORD', 'V!n@y7997'),
                    database: config.get('DB_NAME', 'cilcc_odt_fresh_test'),
                    autoLoadEntities: true,
                    synchronize: false,
                    charset: 'utf8mb4',
                    logging: true,
                    logger: 'advanced-console',
                }),
            }),
            auth_module_1.AuthModule,
            offer_module_1.OfferModule,
            common_module_1.CommonModule,
            approval_module_1.ApprovalModule,
            sku_module_1.SkuModule,
            customer_module_1.CustomerModule,
            pid_module_1.PidModule,
            reports_module_1.ReportsModule,
            schedule_1.ScheduleModule.forRoot(),
            mail_module_1.MailModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            item_module_1.ItemModule,
            offer_history_module_1.OfferHistoryModule,
        ],
        controllers: [app_controller_1.AppController, app_controller_1.TestCryptoController],
        providers: [
            app_service_1.AppService,
            database_service_1.DatabaseService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map