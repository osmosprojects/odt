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
exports.CustomerMaster = exports.SkuMaster = exports.Territory = exports.Region = exports.Zone = exports.Channel = exports.Stream = void 0;
const typeorm_1 = require("typeorm");
let Stream = class Stream {
};
exports.Stream = Stream;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'stream_id' }),
    __metadata("design:type", Number)
], Stream.prototype, "streamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream_code', length: 20, unique: true }),
    __metadata("design:type", String)
], Stream.prototype, "streamCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream_name', length: 100 }),
    __metadata("design:type", String)
], Stream.prototype, "streamName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], Stream.prototype, "status", void 0);
exports.Stream = Stream = __decorate([
    (0, typeorm_1.Entity)('odt_streams')
], Stream);
let Channel = class Channel {
};
exports.Channel = Channel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'channel_id' }),
    __metadata("design:type", Number)
], Channel.prototype, "channelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel_code', length: 25, unique: true }),
    __metadata("design:type", String)
], Channel.prototype, "channelCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel_name', length: 100 }),
    __metadata("design:type", String)
], Channel.prototype, "channelName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Channel.prototype, "streamCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], Channel.prototype, "status", void 0);
exports.Channel = Channel = __decorate([
    (0, typeorm_1.Entity)('odt_channels')
], Channel);
let Zone = class Zone {
};
exports.Zone = Zone;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'zone_id' }),
    __metadata("design:type", Number)
], Zone.prototype, "zoneId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_code', length: 25, unique: true }),
    __metadata("design:type", String)
], Zone.prototype, "zoneCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_name', length: 100 }),
    __metadata("design:type", String)
], Zone.prototype, "zoneName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], Zone.prototype, "status", void 0);
exports.Zone = Zone = __decorate([
    (0, typeorm_1.Entity)('odt_zones')
], Zone);
let Region = class Region {
};
exports.Region = Region;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'region_id' }),
    __metadata("design:type", Number)
], Region.prototype, "regionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_code', length: 20, unique: true }),
    __metadata("design:type", String)
], Region.prototype, "regionCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_name', length: 100 }),
    __metadata("design:type", String)
], Region.prototype, "regionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], Region.prototype, "zoneCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], Region.prototype, "status", void 0);
exports.Region = Region = __decorate([
    (0, typeorm_1.Entity)('odt_regions')
], Region);
let Territory = class Territory {
};
exports.Territory = Territory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'territory_id' }),
    __metadata("design:type", Number)
], Territory.prototype, "territoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory_code', length: 25, unique: true }),
    __metadata("design:type", String)
], Territory.prototype, "territoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory_name', length: 100 }),
    __metadata("design:type", String)
], Territory.prototype, "territoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Territory.prototype, "regionCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], Territory.prototype, "zoneCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Territory.prototype, "streamCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], Territory.prototype, "channelCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], Territory.prototype, "status", void 0);
exports.Territory = Territory = __decorate([
    (0, typeorm_1.Entity)('odt_territories')
], Territory);
let SkuMaster = class SkuMaster {
};
exports.SkuMaster = SkuMaster;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'sku_id' }),
    __metadata("design:type", Number)
], SkuMaster.prototype, "skuId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku_code', length: 50, unique: true }),
    __metadata("design:type", String)
], SkuMaster.prototype, "skuCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku_name', length: 200 }),
    __metadata("design:type", String)
], SkuMaster.prototype, "skuName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'brand', length: 100, nullable: true }),
    __metadata("design:type", String)
], SkuMaster.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category', length: 100, nullable: true }),
    __metadata("design:type", String)
], SkuMaster.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pack_size', length: 50, nullable: true }),
    __metadata("design:type", String)
], SkuMaster.prototype, "packSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uom', length: 20, nullable: true }),
    __metadata("design:type", String)
], SkuMaster.prototype, "uom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], SkuMaster.prototype, "status", void 0);
exports.SkuMaster = SkuMaster = __decorate([
    (0, typeorm_1.Entity)('odt_sku_master')
], SkuMaster);
let CustomerMaster = class CustomerMaster {
};
exports.CustomerMaster = CustomerMaster;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'customer_id' }),
    __metadata("design:type", Number)
], CustomerMaster.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_code', length: 50, unique: true }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "customerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', length: 200 }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream', length: 50, nullable: true }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "stream", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel', length: 50, nullable: true }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "territoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "zoneCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "regionCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', length: 100, nullable: true }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile', length: 20, nullable: true }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], CustomerMaster.prototype, "status", void 0);
exports.CustomerMaster = CustomerMaster = __decorate([
    (0, typeorm_1.Entity)('odt_customer_master')
], CustomerMaster);
//# sourceMappingURL=master-data.entities.js.map