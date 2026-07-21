import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('odt_in_app_notifications')
export class InAppNotification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'notification_type', length: 50, default: 'INFO' })
  notificationType: string;

  @Column({ name: 'is_read', type: 'enum', enum: ['Y', 'N'], default: 'N' })
  isRead: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('odt_audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn({ name: 'audit_id', type: 'bigint' })
  auditId: number;

  @Column({ name: 'action_type', length: 100 })
  actionType: string;

  @Column({ name: 'entity_type', length: 50, nullable: true })
  entityType: string;

  @Column({ name: 'entity_id', length: 100, nullable: true })
  entityId: string;

  @Column({ name: 'actor_code', length: 100, nullable: true })
  actorCode: string;

  @Column({ name: 'actor_email', length: 150, nullable: true })
  actorEmail: string;

  @Column({ name: 'ip_address', length: 50, nullable: true })
  ipAddress: string;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
