import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// PHP equivalent: wow_wo_cust_details table
@Entity('wow_wo_cust_details')
export class CustDetailsEntity {
  @PrimaryGeneratedColumn()
  cid!: number;

  @Column({ type: 'int' })
  offer_id!: number; 

  @Column({ length: 150, nullable: true })
  customer_name_text!: string;

  @Column({ length: 100, nullable: true })
  customer_type_text!: string;

  @Column({ length: 100, nullable: true })
  segment_text!: string;

  @Column({ length: 50, nullable: true })
  customer_status_text!: string;

  @Column({ length: 50, nullable: true })
  cust_state!: string;

  @Column({ length: 100, nullable: true })
  country_name_text!: string;

  @Column({ type: 'date', nullable: true })
  commericial_input_compeleted_by_date!: Date; 
}