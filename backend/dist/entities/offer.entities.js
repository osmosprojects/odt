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
exports.OfferSkuDetail = exports.OfferLetterDetail = exports.OfferClosureTransaction = exports.OfferApprovalTransaction = exports.OfferDetail = void 0;
const typeorm_1 = require("typeorm");
let OfferDetail = class OfferDetail {
};
exports.OfferDetail = OfferDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'offer_id' }),
    __metadata("design:type", Number)
], OfferDetail.prototype, "offerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offer_code', length: 32, unique: true, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "offerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'executive_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "executiveCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "customerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream', length: 50, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "stream", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel', length: 50, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'territory_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "territoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_code', length: 25, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "zoneCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "regionCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date', nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date', nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stored_exchange_rate_lc_usd', type: 'float', default: 83.42 }),
    __metadata("design:type", Number)
], OfferDetail.prototype, "storedExchangeRateLcUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_tax_vat_rate', type: 'float', default: 18 }),
    __metadata("design:type", Number)
], OfferDetail.prototype, "salesTaxVatRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_volume_commitment', length: 64, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "totalVolumeCommitment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_trade_loan', length: 64, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "totalTradeLoan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_term_days', length: 64, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "creditTermDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trading_credit_limit', length: 64, nullable: true }),
    __metadata("design:type", String)
], OfferDetail.prototype, "tradingCreditLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offer_status', length: 4, default: 'D' }),
    __metadata("design:type", String)
], OfferDetail.prototype, "offerStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closure_status', type: 'enum', enum: ['P', 'Y', 'N', 'E', 'NA'], default: 'NA' }),
    __metadata("design:type", String)
], OfferDetail.prototype, "closureStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OfferDetail.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', nullable: true }),
    __metadata("design:type", Date)
], OfferDetail.prototype, "updatedAt", void 0);
exports.OfferDetail = OfferDetail = __decorate([
    (0, typeorm_1.Entity)('odt_offer_details')
], OfferDetail);
let OfferApprovalTransaction = class OfferApprovalTransaction {
};
exports.OfferApprovalTransaction = OfferApprovalTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'txn_id' }),
    __metadata("design:type", Number)
], OfferApprovalTransaction.prototype, "txnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offer_id' }),
    __metadata("design:type", Number)
], OfferApprovalTransaction.prototype, "offerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stream', length: 50, nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "stream", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'channel', length: 50, nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rtm_status', length: 1, default: 'P' }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "rtmStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rtm_code', length: 16, nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "rtmCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rtm_comments', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "rtmComments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l1_status', length: 1, default: 'P' }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l1Status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l1_code', length: 16, nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l1Code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l1_comments', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l1Comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l2_status', length: 1, default: 'P' }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l2Status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l2_code', length: 16, nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l2Code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l2_comments', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l2Comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l3_status', length: 1, default: 'P' }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l3Status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l3_code', length: 16, nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l3Code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'l3_comments', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "l3Comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cm_status', length: 1, default: 'P' }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "cmStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cm_code', length: 16, nullable: true }),
    __metadata("design:type", String)
], OfferApprovalTransaction.prototype, "cmCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OfferApprovalTransaction.prototype, "createdAt", void 0);
exports.OfferApprovalTransaction = OfferApprovalTransaction = __decorate([
    (0, typeorm_1.Entity)('odt_offer_approval_transaction')
], OfferApprovalTransaction);
let OfferClosureTransaction = class OfferClosureTransaction {
};
exports.OfferClosureTransaction = OfferClosureTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'closure_id' }),
    __metadata("design:type", Number)
], OfferClosureTransaction.prototype, "closureId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offer_id' }),
    __metadata("design:type", Number)
], OfferClosureTransaction.prototype, "offerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'added_date', type: 'date' }),
    __metadata("design:type", String)
], OfferClosureTransaction.prototype, "addedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'added_by', length: 25, nullable: true }),
    __metadata("design:type", String)
], OfferClosureTransaction.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'volume_status', length: 2, default: 'P' }),
    __metadata("design:type", String)
], OfferClosureTransaction.prototype, "volumeStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recovery_status', length: 2, default: 'N' }),
    __metadata("design:type", String)
], OfferClosureTransaction.prototype, "recoveryStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OfferClosureTransaction.prototype, "createdAt", void 0);
exports.OfferClosureTransaction = OfferClosureTransaction = __decorate([
    (0, typeorm_1.Entity)('odt_offer_closure_transaction')
], OfferClosureTransaction);
let OfferLetterDetail = class OfferLetterDetail {
};
exports.OfferLetterDetail = OfferLetterDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'letter_id' }),
    __metadata("design:type", Number)
], OfferLetterDetail.prototype, "letterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offer_id' }),
    __metadata("design:type", Number)
], OfferLetterDetail.prototype, "offerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'executive_code', length: 50 }),
    __metadata("design:type", String)
], OfferLetterDetail.prototype, "executiveCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offer_file_path', length: 255 }),
    __metadata("design:type", String)
], OfferLetterDetail.prototype, "offerFilePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offer_letter_status', length: 1, default: 'E' }),
    __metadata("design:type", String)
], OfferLetterDetail.prototype, "offerLetterStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'serial_no', length: 32 }),
    __metadata("design:type", String)
], OfferLetterDetail.prototype, "serialNo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OfferLetterDetail.prototype, "createdAt", void 0);
exports.OfferLetterDetail = OfferLetterDetail = __decorate([
    (0, typeorm_1.Entity)('odt_offer_letter_details')
], OfferLetterDetail);
let OfferSkuDetail = class OfferSkuDetail {
};
exports.OfferSkuDetail = OfferSkuDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'sku_detail_id' }),
    __metadata("design:type", Number)
], OfferSkuDetail.prototype, "skuDetailId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'offer_id' }),
    __metadata("design:type", Number)
], OfferSkuDetail.prototype, "offerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku_code', length: 50 }),
    __metadata("design:type", String)
], OfferSkuDetail.prototype, "skuCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], OfferSkuDetail.prototype, "skuName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'volume_litres', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], OfferSkuDetail.prototype, "volumeLitres", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rebate_per_litre', type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], OfferSkuDetail.prototype, "rebatePerLitre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' }),
    __metadata("design:type", String)
], OfferSkuDetail.prototype, "status", void 0);
exports.OfferSkuDetail = OfferSkuDetail = __decorate([
    (0, typeorm_1.Entity)('odt_offer_sku_details')
], OfferSkuDetail);
//# sourceMappingURL=offer.entities.js.map