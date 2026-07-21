import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User, UserSession, UserStreamChannelMap, UserDocument } from '../entities/user.entities';
import { Role, Module as ModuleEntity, Permission, RoleUserMap } from '../entities/role-permission.entities';
import { OfferDetail, OfferApprovalTransaction, OfferClosureTransaction, OfferLetterDetail, OfferSkuDetail } from '../entities/offer.entities';
import { Stream, Channel, Zone, Region, Territory, SkuMaster, CustomerMaster } from '../entities/master-data.entities';
import { InAppNotification, AuditLog } from '../entities/notification-audit.entities';

const commonMysqlConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  synchronize: false, // Schema already created via ODT_Complete_6DB_Schema.sql
  logging: false,
};

export const userDbConfig: TypeOrmModuleOptions = {
  ...commonMysqlConfig,
  name: 'userDbConnection',
  database: 'odt_user_db',
  entities: [User, UserSession, UserStreamChannelMap, UserDocument],
};

export const roleDbConfig: TypeOrmModuleOptions = {
  ...commonMysqlConfig,
  name: 'roleDbConnection',
  database: 'odt_role_permission_db',
  entities: [Role, ModuleEntity, Permission, RoleUserMap],
};

export const offerDbConfig: TypeOrmModuleOptions = {
  ...commonMysqlConfig,
  name: 'offerDbConnection',
  database: 'odt_offer_db',
  entities: [OfferDetail, OfferApprovalTransaction, OfferClosureTransaction, OfferLetterDetail, OfferSkuDetail],
};

export const masterDbConfig: TypeOrmModuleOptions = {
  ...commonMysqlConfig,
  name: 'masterDbConnection',
  database: 'odt_master_data_db',
  entities: [Stream, Channel, Zone, Region, Territory, SkuMaster, CustomerMaster],
};

export const notificationDbConfig: TypeOrmModuleOptions = {
  ...commonMysqlConfig,
  name: 'notifDbConnection',
  database: 'odt_notification_db',
  entities: [InAppNotification],
};

export const auditDbConfig: TypeOrmModuleOptions = {
  ...commonMysqlConfig,
  name: 'auditDbConnection',
  database: 'odt_audit_log_db',
  entities: [AuditLog],
};
