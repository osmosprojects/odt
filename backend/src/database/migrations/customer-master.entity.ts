import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Maps to the real MySQL table: odt_customer_master (49,817 records)
@Entity('odt_customer_master')
export class CustomerMasterEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 10 })
  stream!: string; // Business stream: WBC, MCO, HD, IWS, etc.

  @Column({ type: 'int', nullable: true })
  cust_id!: number; // Numeric JDE / ERP customer ID

  @Column({ length: 50, nullable: true })
  customer_code!: string; // Alphanumeric customer code

  @Column({ length: 250, nullable: true })
  customer_name!: string;

  @Column({ length: 250, nullable: true })
  db_name!: string; // Distributor name

  @Column({ length: 50, nullable: true })
  db_code!: string; // Distributor code

  @Column({ length: 50, nullable: true })
  customer_type!: string; // Direct, Indirect, etc.

  @Column({ length: 50, nullable: true })
  executive_code!: string;

  @Column({ length: 250, nullable: true })
  executive_name!: string;

  @Column({ length: 50, nullable: true })
  segment!: string;

  @Column({ length: 250, nullable: true })
  sub_segment!: string;

  @Column({ length: 50, nullable: true })
  state!: string;

  @Column({ length: 100, nullable: true })
  email!: string;

  @Column({ length: 50, nullable: true })
  contact_no!: string;

  @Column({ length: 50, nullable: true })
  gst_no!: string;

  @Column({ type: 'text', nullable: true })
  customer_address!: string;

  @Column({ length: 10, nullable: true })
  credit_days!: string;

  @Column({ length: 50, nullable: true })
  primary_secondary_customer!: string;

  @Column({ length: 50, nullable: true })
  key_account!: string;

  @Column({ length: 5, nullable: true, default: 'N' })
  is_new!: string;
}
