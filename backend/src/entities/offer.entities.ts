import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('odt_offer_details')
export class OfferDetail {
  @PrimaryGeneratedColumn({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'offer_code', length: 32, unique: true, nullable: true })
  offerCode: string;

  @Column({ name: 'executive_code', length: 25, nullable: true })
  executiveCode: string;

  @Column({ name: 'customer_code', length: 50, nullable: true })
  customerCode: string;

  @Column({ name: 'customer_name', length: 200, nullable: true })
  customerName: string;

  @Column({ name: 'stream', length: 50, nullable: true })
  stream: string;

  @Column({ name: 'channel', length: 50, nullable: true })
  channel: string;

  @Column({ name: 'territory_code', length: 25, nullable: true })
  territoryCode: string;

  @Column({ name: 'zone_code', length: 25, nullable: true })
  zoneCode: string;

  @Column({ name: 'region_code', length: 20, nullable: true })
  regionCode: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: string;

  @Column({ name: 'stored_exchange_rate_lc_usd', type: 'float', default: 83.42 })
  storedExchangeRateLcUsd: number;

  @Column({ name: 'sales_tax_vat_rate', type: 'float', default: 18 })
  salesTaxVatRate: number;

  @Column({ name: 'total_volume_commitment', length: 64, nullable: true })
  totalVolumeCommitment: string;

  @Column({ name: 'total_trade_loan', length: 64, nullable: true })
  totalTradeLoan: string;

  @Column({ name: 'credit_term_days', length: 64, nullable: true })
  creditTermDays: string;

  @Column({ name: 'trading_credit_limit', length: 64, nullable: true })
  tradingCreditLimit: string;

  @Column({ name: 'offer_status', length: 4, default: 'D' })
  offerStatus: string; // D=Draft, P=Pending, A=Approved, R=Rejected, E=Expired

  @Column({ name: 'closure_status', type: 'enum', enum: ['P', 'Y', 'N', 'E', 'NA'], default: 'NA' })
  closureStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}

@Entity('odt_offer_approval_transaction')
export class OfferApprovalTransaction {
  @PrimaryGeneratedColumn({ name: 'txn_id' })
  txnId: number;

  @Column({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'stream', length: 50, nullable: true })
  stream: string;

  @Column({ name: 'channel', length: 50, nullable: true })
  channel: string;

  @Column({ name: 'rtm_status', length: 1, default: 'P' })
  rtmStatus: string;
  @Column({ name: 'rtm_code', length: 16, nullable: true })
  rtmCode: string;
  @Column({ name: 'rtm_comments', type: 'text', nullable: true })
  rtmComments: string;

  @Column({ name: 'l1_status', length: 1, default: 'P' })
  l1Status: string;
  @Column({ name: 'l1_code', length: 16, nullable: true })
  l1Code: string;
  @Column({ name: 'l1_comments', type: 'text', nullable: true })
  l1Comments: string;

  @Column({ name: 'l2_status', length: 1, default: 'P' })
  l2Status: string;
  @Column({ name: 'l2_code', length: 16, nullable: true })
  l2Code: string;
  @Column({ name: 'l2_comments', type: 'text', nullable: true })
  l2Comments: string;

  @Column({ name: 'l3_status', length: 1, default: 'P' })
  l3Status: string;
  @Column({ name: 'l3_code', length: 16, nullable: true })
  l3Code: string;
  @Column({ name: 'l3_comments', type: 'text', nullable: true })
  l3Comments: string;

  @Column({ name: 'cm_status', length: 1, default: 'P' })
  cmStatus: string;
  @Column({ name: 'cm_code', length: 16, nullable: true })
  cmCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('odt_offer_closure_transaction')
export class OfferClosureTransaction {
  @PrimaryGeneratedColumn({ name: 'closure_id' })
  closureId: number;

  @Column({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'added_date', type: 'date' })
  addedDate: string;

  @Column({ name: 'added_by', length: 25, nullable: true })
  addedBy: string;

  @Column({ name: 'volume_status', length: 2, default: 'P' })
  volumeStatus: string;

  @Column({ name: 'recovery_status', length: 2, default: 'N' })
  recoveryStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('odt_offer_letter_details')
export class OfferLetterDetail {
  @PrimaryGeneratedColumn({ name: 'letter_id' })
  letterId: number;

  @Column({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'executive_code', length: 50 })
  executiveCode: string;

  @Column({ name: 'offer_file_path', length: 255 })
  offerFilePath: string;

  @Column({ name: 'offer_letter_status', length: 1, default: 'E' })
  offerLetterStatus: string; // E=Pending P=Published R=Recalled

  @Column({ name: 'serial_no', length: 32 })
  serialNo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('odt_offer_sku_details')
export class OfferSkuDetail {
  @PrimaryGeneratedColumn({ name: 'sku_detail_id' })
  skuDetailId: number;

  @Column({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'sku_code', length: 50 })
  skuCode: string;

  @Column({ name: 'sku_name', length: 200, nullable: true })
  skuName: string;

  @Column({ name: 'volume_litres', type: 'decimal', precision: 15, scale: 4, nullable: true })
  volumeLitres: number;

  @Column({ name: 'rebate_per_litre', type: 'decimal', precision: 10, scale: 4, nullable: true })
  rebatePerLitre: number;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}
