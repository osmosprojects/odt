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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const credit_pending_filter_dto_1 = require("./dtos/credit-pending-filter.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../enums/roles.enum");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getCreditPending(filters) {
        return this.reportsService.getCreditPending(filters);
    }
    async exportCreditPendingExcel(filters, res) {
        const buffer = await this.reportsService.exportCreditPendingExcel(filters);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=credit-pending-report.xlsx',
        });
        res.send(buffer);
    }
    async exportCreditPendingPdf(filters, res) {
        const buffer = await this.reportsService.exportCreditPendingPdf(filters);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=credit-pending-report.pdf',
        });
        res.send(buffer);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('credit-pending'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.CM, roles_enum_1.Role.ADMIN, roles_enum_1.Role.WSK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [credit_pending_filter_dto_1.CreditPendingFilterDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCreditPending", null);
__decorate([
    (0, common_1.Get)('credit-pending/export/excel'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.CM, roles_enum_1.Role.ADMIN, roles_enum_1.Role.WSK),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [credit_pending_filter_dto_1.CreditPendingFilterDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportCreditPendingExcel", null);
__decorate([
    (0, common_1.Get)('credit-pending/export/pdf'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.CM, roles_enum_1.Role.ADMIN, roles_enum_1.Role.WSK),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [credit_pending_filter_dto_1.CreditPendingFilterDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportCreditPendingPdf", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map