import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('odt_roles')
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'role_code', length: 20, unique: true })
  roleCode: string;

  @Column({ name: 'role_name', length: 100 })
  roleName: string;

  @Column({ name: 'role_type', length: 20, nullable: true })
  roleType: string;

  @Column({ name: 'stream', length: 50, nullable: true })
  stream: string;

  @Column({ name: 'channel', length: 50, nullable: true })
  channel: string;

  @Column({ name: 'app_type', length: 20, nullable: true })
  appType: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', length: 1, default: 'Y' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('odt_modules')
export class Module {
  @PrimaryGeneratedColumn({ name: 'module_id' })
  moduleId: number;

  @Column({ name: 'module_code', length: 50, unique: true })
  moduleCode: string;

  @Column({ name: 'module_name', length: 100 })
  moduleName: string;

  @Column({ name: 'parent_module', nullable: true })
  parentModule: number;

  @Column({ name: 'app_type', length: 20, nullable: true })
  appType: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'status', length: 1, default: 'Y' })
  status: string;
}

@Entity('odt_permissions')
export class Permission {
  @PrimaryGeneratedColumn({ name: 'permission_id' })
  permissionId: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'module_id' })
  moduleId: number;

  @Column({ name: 'emp_code', length: 20, nullable: true })
  empCode: string;

  @Column({ name: 'can_view', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  canView: string;

  @Column({ name: 'can_add', type: 'enum', enum: ['Y', 'N'], default: 'N' })
  canAdd: string;

  @Column({ name: 'can_update', type: 'enum', enum: ['Y', 'N'], default: 'N' })
  canUpdate: string;

  @Column({ name: 'can_delete', type: 'enum', enum: ['Y', 'N'], default: 'N' })
  canDelete: string;

  @Column({ name: 'can_approve', type: 'enum', enum: ['Y', 'N'], default: 'N' })
  canApprove: string;

  @Column({ name: 'status', length: 1, default: 'Y' })
  status: string;
}

@Entity('odt_role_user_map')
export class RoleUserMap {
  @PrimaryGeneratedColumn({ name: 'map_id' })
  mapId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}
