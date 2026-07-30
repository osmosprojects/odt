import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('wow_wo_keris')
export class KerisSubmissionEntity {
  @PrimaryGeneratedColumn()
  id!: number; // keris_id → id

  @Column({ name: 'offer_id' })
  offerId!: number;

  @Column({ name: 'keris_code', nullable: true })
  kerisCode!: string;

  @Column({ name: 'submit_date', nullable: true })
  submitDate!: Date;

  @Column({ name: 'status', default: 'PENDING' })
  status!: string; // PENDING | SUBMITTED | UPDATED | FAILED | ACKNOWLEDGED

  @Column({ name: 'response', type: 'text', nullable: true })
  response!: string; // raw response from Keris API (JSON string)

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}