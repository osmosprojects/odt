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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.InAppNotification = void 0;
const typeorm_1 = require("typeorm");
let InAppNotification = class InAppNotification {
};
exports.InAppNotification = InAppNotification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], InAppNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], InAppNotification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], InAppNotification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], InAppNotification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_type', length: 50, default: 'INFO' }),
    __metadata("design:type", String)
], InAppNotification.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_read', type: 'enum', enum: ['Y', 'N'], default: 'N' }),
    __metadata("design:type", String)
], InAppNotification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InAppNotification.prototype, "createdAt", void 0);
exports.InAppNotification = InAppNotification = __decorate([
    (0, typeorm_1.Entity)('odt_in_app_notifications')
], InAppNotification);
let AuditLog = class AuditLog {
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'audit_id', type: 'bigint' }),
    __metadata("design:type", Number)
], AuditLog.prototype, "auditId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'action_type', length: 100 }),
    __metadata("design:type", String)
], AuditLog.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_id', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actor_code', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "actorCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actor_email', length: 150, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "actorEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 50, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AuditLog.prototype, "createdAt", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)('odt_audit_logs')
], AuditLog);
//# sourceMappingURL=notification-audit.entities.js.map