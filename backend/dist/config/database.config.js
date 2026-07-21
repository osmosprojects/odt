"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditDbConfig = exports.notificationDbConfig = exports.masterDbConfig = exports.offerDbConfig = exports.roleDbConfig = exports.userDbConfig = void 0;
const user_entities_1 = require("../entities/user.entities");
const role_permission_entities_1 = require("../entities/role-permission.entities");
const offer_entities_1 = require("../entities/offer.entities");
const master_data_entities_1 = require("../entities/master-data.entities");
const notification_audit_entities_1 = require("../entities/notification-audit.entities");
const commonMysqlConfig = {
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    synchronize: false,
    logging: false,
};
exports.userDbConfig = {
    ...commonMysqlConfig,
    name: 'userDbConnection',
    database: 'odt_user_db',
    entities: [user_entities_1.User, user_entities_1.UserSession, user_entities_1.UserStreamChannelMap, user_entities_1.UserDocument],
};
exports.roleDbConfig = {
    ...commonMysqlConfig,
    name: 'roleDbConnection',
    database: 'odt_role_permission_db',
    entities: [role_permission_entities_1.Role, role_permission_entities_1.Module, role_permission_entities_1.Permission, role_permission_entities_1.RoleUserMap],
};
exports.offerDbConfig = {
    ...commonMysqlConfig,
    name: 'offerDbConnection',
    database: 'odt_offer_db',
    entities: [offer_entities_1.OfferDetail, offer_entities_1.OfferApprovalTransaction, offer_entities_1.OfferClosureTransaction, offer_entities_1.OfferLetterDetail, offer_entities_1.OfferSkuDetail],
};
exports.masterDbConfig = {
    ...commonMysqlConfig,
    name: 'masterDbConnection',
    database: 'odt_master_data_db',
    entities: [master_data_entities_1.Stream, master_data_entities_1.Channel, master_data_entities_1.Zone, master_data_entities_1.Region, master_data_entities_1.Territory, master_data_entities_1.SkuMaster, master_data_entities_1.CustomerMaster],
};
exports.notificationDbConfig = {
    ...commonMysqlConfig,
    name: 'notifDbConnection',
    database: 'odt_notification_db',
    entities: [notification_audit_entities_1.InAppNotification],
};
exports.auditDbConfig = {
    ...commonMysqlConfig,
    name: 'auditDbConnection',
    database: 'odt_audit_log_db',
    entities: [notification_audit_entities_1.AuditLog],
};
//# sourceMappingURL=database.config.js.map