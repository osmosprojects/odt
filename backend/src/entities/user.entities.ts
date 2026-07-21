import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('odt_users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'group_id', default: 0 })
  groupId: number;

  @Column({ name: 'role_id', length: 10, default: '1' })
  roleId: string;

  @Column({ name: 'old_role_id', length: 10, nullable: true })
  oldRoleId: string;

  @Column({ name: 'login_id', length: 50, unique: true })
  loginId: string;

  @Column({ name: 'user_code', length: 50, unique: true })
  userCode: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50, nullable: true })
  lastName: string;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ name: 'email', length: 100, unique: true })
  email: string;

  @Column({ name: 'profile_pic', length: 500, nullable: true, default: 'images/Default.jpg' })
  profilePic: string;

  @Column({ name: 'stream', length: 50, nullable: true })
  stream: string;

  @Column({ name: 'stream_code', length: 20, nullable: true })
  streamCode: string;

  @Column({ name: 'channel', length: 50, nullable: true })
  channel: string;

  @Column({ name: 'channel_code', length: 25, nullable: true })
  channelCode: string;

  @Column({ name: 'territory_code', length: 25, nullable: true })
  territoryCode: string;

  @Column({ name: 'territory_name', length: 100, nullable: true })
  territoryName: string;

  @Column({ name: 'zone_code', length: 25, nullable: true })
  zoneCode: string;

  @Column({ name: 'zone_name', length: 100, nullable: true })
  zoneName: string;

  @Column({ name: 'region_code', length: 20, nullable: true })
  regionCode: string;

  @Column({ name: 'region_name', length: 50, nullable: true })
  regionName: string;

  @Column({ name: 'customer_type', length: 20, nullable: true })
  customerType: string;

  @Column({ name: 'user_type', length: 20, default: 'U' })
  userType: string;

  @Column({ name: 'app_type', length: 10, default: '' })
  appType: string;

  @Column({ name: 'status', length: 1, default: 'A' })
  status: string;

  @Column({ name: 'account_status', type: 'enum', enum: ['A', 'B', 'E'], default: 'A' })
  accountStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}

@Entity('odt_user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn({ name: 'session_id', type: 'bigint' })
  sessionId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'session_token', length: 255 })
  sessionToken: string;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', length: 500, nullable: true })
  userAgent: string;

  @Column({ name: 'login_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  loginAt: Date;

  @Column({ name: 'logout_at', type: 'datetime', nullable: true })
  logoutAt: Date;

  @Column({ name: 'is_active', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  isActive: string;
}

@Entity('odt_user_stream_channel_map')
export class UserStreamChannelMap {
  @PrimaryGeneratedColumn({ name: 'map_id' })
  mapId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'stream', length: 50 })
  stream: string;

  @Column({ name: 'channel', length: 50 })
  channel: string;

  @Column({ name: 'territory_code', length: 25, nullable: true })
  territoryCode: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}

@Entity('odt_user_documents')
export class UserDocument {
  @PrimaryGeneratedColumn({ name: 'doc_id' })
  docId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'doc_type', length: 50 })
  docType: string;

  @Column({ name: 'doc_number', length: 100, nullable: true })
  docNumber: string;

  @Column({ name: 'doc_path', length: 500, nullable: true })
  docPath: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}
