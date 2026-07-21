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
exports.RoleUserMap = exports.Permission = exports.Module = exports.Role = void 0;
const typeorm_1 = require("typeorm");
let Role = class Role {
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'role_id' }),
    __metadata("design:type", Number)
], Role.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_code', length: 20, unique: true }),
    __metadata("design:type", String)
], Role.prototype, "roleCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_name', length: 100 }),
    __metadata("design:type", String)
], Role.prototype, "roleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_type', length: 20, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "roleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream', length: 50, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "stream", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel', length: 50, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'app_type', length: 20, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "appType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 1, default: 'Y' }),
    __metadata("design:type", String)
], Role.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)('odt_roles')
], Role);
let Module = class Module {
};
exports.Module = Module;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'module_id' }),
    __metadata("design:type", Number)
], Module.prototype, "moduleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'module_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Module.prototype, "moduleCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'module_name', length: 100 }),
    __metadata("design:type", String)
], Module.prototype, "moduleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_module', nullable: true }),
    __metadata("design:type", Number)
], Module.prototype, "parentModule", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'app_type', length: 20, nullable: true }),
    __metadata("design:type", String)
], Module.prototype, "appType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0 }),
    __metadata("design:type", Number)
], Module.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 1, default: 'Y' }),
    __metadata("design:type", String)
], Module.prototype, "status", void 0);
exports.Module = Module = __decorate([
    (0, typeorm_1.Entity)('odt_modules')
], Module);
let Permission = class Permission {
};
exports.Permission = Permission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'permission_id' }),
    __metadata("design:type", Number)
], Permission.prototype, "permissionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id' }),
    __metadata("design:type", Number)
], Permission.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'module_id' }),
    __metadata("design:type", Number)
], Permission.prototype, "moduleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Permission.prototype, "empCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_view', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], Permission.prototype, "canView", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_add', type: 'enum', enum: ['Y', 'N'], default: 'N' }),
    __metadata("design:type", String)
], Permission.prototype, "canAdd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_update', type: 'enum', enum: ['Y', 'N'], default: 'N' }),
    __metadata("design:type", String)
], Permission.prototype, "canUpdate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_delete', type: 'enum', enum: ['Y', 'N'], default: 'N' }),
    __metadata("design:type", String)
], Permission.prototype, "canDelete", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_approve', type: 'enum', enum: ['Y', 'N'], default: 'N' }),
    __metadata("design:type", String)
], Permission.prototype, "canApprove", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 1, default: 'Y' }),
    __metadata("design:type", String)
], Permission.prototype, "status", void 0);
exports.Permission = Permission = __decorate([
    (0, typeorm_1.Entity)('odt_permissions')
], Permission);
let RoleUserMap = class RoleUserMap {
};
exports.RoleUserMap = RoleUserMap;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'map_id' }),
    __metadata("design:type", Number)
], RoleUserMap.prototype, "mapId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], RoleUserMap.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id' }),
    __metadata("design:type", Number)
], RoleUserMap.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], RoleUserMap.prototype, "status", void 0);
exports.RoleUserMap = RoleUserMap = __decorate([
    (0, typeorm_1.Entity)('odt_role_user_map')
], RoleUserMap);
//# sourceMappingURL=role-permission.entities.js.map