import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('odt_activity_log')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: true })
  offer_id!: number;

  @Column({ length: 64, nullable: true })
  offer_code!: string;

  @Column({ length: 50 })
  action!: string; // CREATE, EDIT, EXTEND, APPROVE, REJECT, SUBMIT

  @Column({ length: 100, nullable: true })
  user_name!: string;

  @Column({ length: 50, nullable: true })
  user_role!: string;

  @Column({ type: 'longtext', nullable: true })
  details!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
