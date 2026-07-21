import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { OfferStatus, OfferCategory } from '../../enums/offer-status.enum';

@Entity('offer')
export class OfferEntity {
  @PrimaryGeneratedColumn()
  offer_id!: number;

  @Column({ type: 'int' })
  executive_code!: number;

  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.D })
  account_status!: OfferStatus;

  @Column({ type: 'enum', enum: OfferCategory, default: OfferCategory.STANDARD })
  offer_category!: OfferCategory;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date!: Date;

  @Column({ type: 'date' })
  expiration_date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  money_offered!: number;

  @Column({ length: 50, nullable: true })
  offer_code!: string; // generated WBC number, e.g. "WBC-2026-000123"
}