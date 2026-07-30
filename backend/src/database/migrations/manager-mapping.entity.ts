import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Used by ApprovalWorkflowService to determine next approver in DOFA chain
@Entity('emp_mgr_map')
export class ManagerMappingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  employeeCode!: string; 

  @Column()
  managerCode!: string;

  @Column({ nullable: true })
  level!: number; // hierarchy level in approval chain
}
