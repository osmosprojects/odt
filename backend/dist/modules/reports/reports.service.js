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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const offer_entity_1 = require("../../database/migrations/offer.entity");
const offer_status_enum_1 = require("../../enums/offer-status.enum");
const excel_report_utils_1 = require("../../common/utils/excel-report.utils");
const pdf_report_utils_1 = require("../../common/utils/pdf-report.utils");
const money_format_utils_1 = require("../../common/utils/money-format.utils");
let ReportsService = class ReportsService {
    offerRepo;
    constructor(offerRepo) {
        this.offerRepo = offerRepo;
    }
    async getCreditPending(filters) {
        const where = {
            account_status: offer_status_enum_1.OfferStatus.P,
        };
        if (filters.from && filters.to) {
            where.created_date = (0, typeorm_2.Between)(new Date(filters.from), new Date(filters.to));
        }
        const offers = await this.offerRepo.find({
            where,
            order: { created_date: 'ASC' },
        });
        const now = new Date();
        return offers.map((offer) => ({
            offer_id: offer.offer_id,
            executive_code: offer.executive_code,
            money_offered: offer.money_offered,
            money_offered_formatted: (0, money_format_utils_1.moneyFormatIndia)(Number(offer.money_offered || 0)),
            created_date: offer.created_date,
            days_pending: Math.floor((now.getTime() - new Date(offer.created_date).getTime()) / (1000 * 60 * 60 * 24)),
        }));
    }
    async exportCreditPendingExcel(filters) {
        const rows = await this.getCreditPending(filters);
        const columns = [
            { header: 'Offer ID', key: 'offer_id', width: 15 },
            { header: 'Executive Code', key: 'executive_code', width: 20 },
            { header: 'Amount', key: 'money_offered_formatted', width: 20 },
            { header: 'Created Date', key: 'created_date', width: 25 },
            { header: 'Days Pending', key: 'days_pending', width: 15 },
        ];
        return (0, excel_report_utils_1.generateExcelReport)('Credit Pending Report', columns, rows);
    }
    async exportCreditPendingPdf(filters) {
        const rows = await this.getCreditPending(filters);
        const columns = [
            { header: 'ID', key: 'offer_id', width: 60 },
            { header: 'Exec Code', key: 'executive_code', width: 100 },
            { header: 'Amount', key: 'money_offered_formatted', width: 120 },
            { header: 'Days Pending', key: 'days_pending', width: 100 },
        ];
        return (0, pdf_report_utils_1.generatePdfReport)('Credit Level Pending Report', columns, rows);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(offer_entity_1.OfferEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map