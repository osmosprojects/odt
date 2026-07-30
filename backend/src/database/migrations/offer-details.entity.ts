import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('odt_offer_details')
export class OfferDetailsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 10 })
  stream!: string;

  @Column({ type: 'int' })
  offer_id!: number;

  @Column({ length: 64, nullable: true })
  offer_code!: string;

  @Column({ length: 50, nullable: true })
  executive_code!: string;

  @Column({ type: 'date', nullable: true })
  start_date!: Date;

  @Column({ type: 'date', nullable: true })
  end_date!: Date;

  @Column({ length: 10, nullable: true })
  contract_tenure!: string;

  @Column({ type: 'date', nullable: true })
  effective_end_date!: Date;

  @Column({ length: 10, nullable: true })
  offer_type!: string;

  @Column({ length: 64, nullable: true })
  tot_volume_commitment!: string;

  @Column({ type: 'longtext', nullable: true })
  previous_sku_details!: string;

  @Column({ type: 'longtext', nullable: true })
  customer_level_input_text!: string;

  @Column({ type: 'longtext', nullable: true })
  sku_text!: string;

  @Column({ type: 'longtext', nullable: true })
  current_proposed_text!: string;

  @Column({ type: 'date', nullable: true })
  offer_details_updated_date!: Date;

  @Column({ length: 50, nullable: true })
  approver!: string;

  @Column({ length: 10, nullable: true })
  offer_status!: string;

  @Column({ length: 32, nullable: true })
  total_gross_margin!: string;

  @Column({ length: 32, nullable: true })
  net_gross_margin_dofa!: string;

  @Column({ length: 32, nullable: true })
  gmpl_dofa!: string;

  @Column({ length: 32, nullable: true })
  final_approver!: string;

  @Column({ type: 'longtext', nullable: true })
  remark!: string;

  @Column({ length: 10, nullable: true })
  offer_closure_status!: string;

  @Column({ length: 50, nullable: true })
  total_cust_lvl_input!: string;

  @Column({ type: 'int', nullable: true })
  total_net_price!: number;

  @Column({ length: 20, nullable: true })
  proposal_id!: string;
}
