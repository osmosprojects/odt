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
exports.UserDocument = exports.UserStreamChannelMap = exports.UserSession = exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'user_id' }),
    __metadata("design:type", Number)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_id', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', length: 10, default: '1' }),
    __metadata("design:type", String)
], User.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'old_role_id', length: 10, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "oldRoleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'login_id', length: 50, unique: true }),
    __metadata("design:type", String)
], User.prototype, "loginId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_code', length: 50, unique: true }),
    __metadata("design:type", String)
], User.prototype, "userCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', length: 50 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', length: 150 }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', length: 100, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_pic', length: 500, nullable: true, default: 'images/Default.jpg' }),
    __metadata("design:type", String)
], User.prototype, "profilePic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "stream", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "streamCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "channelCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "territoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "territoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "zoneCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "zoneName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "regionCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_name', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "regionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_type', length: 20, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "customerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_type', length: 20, default: 'U' }),
    __metadata("design:type", String)
], User.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'app_type', length: 10, default: '' }),
    __metadata("design:type", String)
], User.prototype, "appType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 1, default: 'A' }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_status', type: 'enum', enum: ['A', 'B', 'E'], default: 'A' }),
    __metadata("design:type", String)
], User.prototype, "accountStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('odt_users')
], User);
let UserSession = class UserSession {
};
exports.UserSession = UserSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'session_id', type: 'bigint' }),
    __metadata("design:type", Number)
], UserSession.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], UserSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_token', length: 255 }),
    __metadata("design:type", String)
], UserSession.prototype, "sessionToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 45, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', length: 500, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'login_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UserSession.prototype, "loginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logout_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], UserSession.prototype, "logoutAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], UserSession.prototype, "isActive", void 0);
exports.UserSession = UserSession = __decorate([
    (0, typeorm_1.Entity)('odt_user_sessions')
], UserSession);
let UserStreamChannelMap = class UserStreamChannelMap {
};
exports.UserStreamChannelMap = UserStreamChannelMap;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'map_id' }),
    __metadata("design:type", Number)
], UserStreamChannelMap.prototype, "mapId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], UserStreamChannelMap.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream', length: 50 }),
    __metadata("design:type", String)
], UserStreamChannelMap.prototype, "stream", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel', length: 50 }),
    __metadata("design:type", String)
], UserStreamChannelMap.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], UserStreamChannelMap.prototype, "territoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], UserStreamChannelMap.prototype, "status", void 0);
exports.UserStreamChannelMap = UserStreamChannelMap = __decorate([
    (0, typeorm_1.Entity)('odt_user_stream_channel_map')
], UserStreamChannelMap);
let UserDocument = class UserDocument {
};
exports.UserDocument = UserDocument;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'doc_id' }),
    __metadata("design:type", Number)
], UserDocument.prototype, "docId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], UserDocument.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_type', length: 50 }),
    __metadata("design:type", String)
], UserDocument.prototype, "docType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "docNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_path', length: 500, nullable: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "docPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], UserDocument.prototype, "status", void 0);
exports.UserDocument = UserDocument = __decorate([
    (0, typeorm_1.Entity)('odt_user_documents')
], UserDocument);
//# sourceMappingURL=user.entities.js.map