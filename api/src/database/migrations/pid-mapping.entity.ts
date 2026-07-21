import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('wow_wo_pid_mapping')
export class PidMappingEntity {
  @PrimaryGeneratedColumn()
  pid_id!: number;

  @Column({ type: 'int' })
  offer_id!: number;

  @Column({ length: 50 })
  parent_id!: string;

  @Column({ length: 50 })
  customer_code!: string;

  @Column({ length: 20, nullable: true, default: 'ACTIVE' })
  status!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date!: Date;
}