import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('econ_customers_drm')
export class UserEntity {
  @PrimaryGeneratedColumn()
  userid!: number;

  @Column({ length: 50,default:'' })
  roleid!: string; // PHP: $_SESSION['user_rolecode_s']

  @Column({ length: 50, default: '' })
  loginid!: string; 

  @Column({ type: 'text', select: false })
  password!: string; 

  @Column({ length: 50 })
  fname!: string;

  @Column({ length: 50, nullable: true })
  lname!: string;

  @Column({ length: 150, default: '' })
  name!: string;

  @Column({ length: 100, default: '' })
  email!: string;

  @Column({ length: 16, nullable: true })
  zone!: string;

  @Column({
    type: 'enum',
    enum: ['A', 'B', 'E'],
  })
  account_status!: 'A' | 'B' | 'E'; // A=Active, B=Blocked, E=Expired

  @Column({ type: 'char', length: 1, default: 'N' })
  status!: string; 

  @Column({ length: 50, comment: 'NTid' })
  user_code!: string; 

  @Column({ nullable: true })
  lastlogin!: Date;

  @Column({ nullable: true })
  currentlogin!: Date;

  @Column({ type: 'int', default: 0 })
  logincount!: number;

  @Column({ type: 'int', default: 0 })
  invalid_login_attempts!: number;

  @Column({ length: 10, default: '' })
  app_type!: string;

  @Column({ type: 'char', length: 1, default: 'N' })
  '90days_status': string;

  @Column({ type: 'text', nullable: true, select: false })
  refreshToken!: string|null;
}
