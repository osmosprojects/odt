import { Entity, PrimaryColumn, Column } from 'typeorm';

// Maps to real MySQL table: wow_wo_cust_details
@Entity('wow_wo_cust_details')
export class CustDetailsEntity {
  @PrimaryColumn({ type: 'int' })
  offer_id!: number;

  @Column({ length: 50, nullable: true })
  country_name_text!: string;

  @Column({ length: 50, nullable: true })
  currency_text!: string;

  @Column({ length: 250, nullable: true })
  investment_type_text!: string;

  @Column({ length: 250, nullable: true })
  investment_rationale_text!: string;

  @Column({ length: 250, nullable: true })
  bp_bank_funded_text!: string;

  @Column({ length: 250, nullable: true })
  planning_status_text!: string;

  @Column({ length: 250, nullable: true })
  customer_status_text!: string;

  @Column({ type: 'text', nullable: true })
  customer_name_text!: string;

  @Column({ length: 250, nullable: true })
  primary_secondary_customer_text!: string;

  @Column({ length: 250, nullable: true })
  customer_turfview_no_text!: string;

  @Column({ type: 'text', nullable: true })
  customer_type_text!: string;

  @Column({ type: 'text', nullable: true })
  current_customer_type_text!: string;

  @Column({ type: 'text', nullable: true })
  distributor_name_text!: string;

  @Column({ type: 'text', nullable: true })
  segment_text!: string;

  @Column({ type: 'text', nullable: true })
  sub_segment_text!: string;

  @Column({ type: 'text', nullable: true })
  customer_distributor_jde_ab_no_text!: string;

  @Column({ type: 'text', nullable: true })
  key_account_text!: string;

  @Column({ length: 60, nullable: true })
  cust_state!: string;

  @Column({ type: 'text', nullable: true })
  customers_address_text!: string;

  @Column({ length: 250, nullable: true })
  bp_sales_rep_text!: string;

  @Column({ type: 'text', nullable: true })
  sales_area_text!: string;

  @Column({ type: 'text', nullable: true })
  sales_remarks_text!: string;

  @Column({ length: 15, nullable: true })
  gst_no_text!: string;

  @Column({ type: 'text', nullable: true })
  gst_address_text!: string;
}