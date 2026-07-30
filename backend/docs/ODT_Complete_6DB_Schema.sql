-- ============================================================
--  ODT COMPLETE 6-DATABASE ARCHITECTURE
--  Reference: cilcc_cdr (2).sql / cilcc_wow_fresh.sql (production)
--  Generated: 2026-07-21
-- ============================================================
--  DATABASES:
--  1. odt_user_db            -- User DB
--  2. odt_role_permission_db -- Role & Permission DB
--  3. odt_offer_db           -- Offer DB
--  4. odt_master_data_db     -- Master Data DB
--  5. odt_notification_db    -- Notification DB
--  6. odt_audit_log_db       -- Audit Logs DB
-- ============================================================


-- ##########################################################
--  DATABASE 1: odt_user_db
--  Reference : econ_customers_drm (cilcc_cdr (2).sql)
--  Extended  : + stream, channel, territory, zone, region
-- ##########################################################

CREATE DATABASE IF NOT EXISTS odt_user_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE odt_user_db;

-- 1.1 odt_users (extends econ_customers_drm)
CREATE TABLE IF NOT EXISTS odt_users (
  user_id                       INT           NOT NULL AUTO_INCREMENT,
  group_id                      INT           NOT NULL DEFAULT 0             COMMENT 'User group / department ID',
  role_id                       VARCHAR(10)   NOT NULL DEFAULT '1'           COMMENT 'FK odt_role_permission_db.odt_roles',
  old_role_id                   VARCHAR(10)   DEFAULT NULL,
  login_id                      VARCHAR(50)   NOT NULL DEFAULT ''            COMMENT 'Unique login username / NT-ID',
  old_login_id                  VARCHAR(50)   NOT NULL DEFAULT '',
  user_code                     VARCHAR(50)   NOT NULL                       COMMENT 'NT-ID / Employee Code',
  password_hash                 TEXT          NOT NULL                       COMMENT 'BCrypt hashed password',
  password_history              TEXT          DEFAULT NULL                   COMMENT 'JSON array of last N hashes',
  first_name                    VARCHAR(50)   NOT NULL,
  last_name                     VARCHAR(50)   DEFAULT NULL,
  full_name                     VARCHAR(150)  NOT NULL DEFAULT '',
  email                         VARCHAR(100)  NOT NULL DEFAULT '',
  profile_pic                   VARCHAR(500)  DEFAULT 'images/Default.jpg',
  -- Stream / Channel / Territory (NEW columns)
  stream                        VARCHAR(50)   DEFAULT NULL                   COMMENT 'B2B or B2C',
  stream_code                   VARCHAR(20)   DEFAULT NULL,
  channel                       VARCHAR(50)   DEFAULT NULL                   COMMENT 'PCO, MCO, CVO, FWS, HD, RETAIL',
  channel_code                  VARCHAR(25)   DEFAULT NULL,
  territory_code                VARCHAR(25)   DEFAULT NULL                   COMMENT 'FK odt_master_data_db.odt_territories',
  territory_name                VARCHAR(100)  DEFAULT NULL,
  zone_code                     VARCHAR(25)   DEFAULT NULL                   COMMENT 'FK odt_master_data_db.odt_zones',
  zone_name                     VARCHAR(100)  DEFAULT NULL,
  region_code                   VARCHAR(20)   DEFAULT NULL                   COMMENT 'FK odt_master_data_db.odt_regions',
  region_name                   VARCHAR(50)   DEFAULT NULL,
  -- Classification
  customer_type                 VARCHAR(20)   DEFAULT NULL                   COMMENT 'PCO,MCO,CVO,FWS,HD,IND',
  user_type                     VARCHAR(20)   NOT NULL DEFAULT 'U'           COMMENT 'U=User A=Admin SA=SuperAdmin',
  app_type                      VARCHAR(10)   NOT NULL DEFAULT ''            COMMENT 'WOW CDR TCM',
  -- Account Status
  status                        CHAR(1)       NOT NULL DEFAULT 'A'           COMMENT 'A=Active I=Inactive D=Deleted',
  account_status                ENUM('A','B','E') NOT NULL DEFAULT 'A'     COMMENT 'A=Active B=Blocked E=Expired',
  account_blocked_on            DATETIME      DEFAULT NULL,
  account_expired_on            DATETIME      DEFAULT NULL,
  invalid_login_attempts        INT           NOT NULL DEFAULT 0,
  econtroller                   CHAR(1)       NOT NULL DEFAULT 'N',
  mail_validation               CHAR(1)       NOT NULL DEFAULT 'N',
  mail_send                     VARCHAR(1)    NOT NULL DEFAULT 'N',
  first_login                   INT           NOT NULL DEFAULT 0,
  -- Login Tracking
  last_login                    DATETIME      DEFAULT NULL,
  current_login                 DATETIME      DEFAULT NULL,
  last_ip                       VARCHAR(45)   DEFAULT NULL,
  current_ip                    VARCHAR(45)   DEFAULT NULL,
  login_count                   INT           NOT NULL DEFAULT 0,
  -- Password Policy
  last_password_change_on       DATE          DEFAULT NULL,
  ninety_days_status            CHAR(1)       NOT NULL DEFAULT 'N',
  ninety_days_active_date       DATE          DEFAULT NULL,
  ninety_days_active_reason     VARCHAR(100)  DEFAULT NULL,
  ninety_days_deactivation_date DATE          DEFAULT NULL,
  ninety_days_mail_send_date    DATE          DEFAULT NULL,
  -- Timestamps
  added_date                    DATE          DEFAULT NULL,
  deactivation_date             DATE          DEFAULT NULL,
  created_at                    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                    TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_login_id (login_id),
  UNIQUE KEY uq_user_code (user_code),
  UNIQUE KEY uq_email (email),
  KEY idx_stream (stream),
  KEY idx_channel (channel),
  KEY idx_territory_code (territory_code),
  KEY idx_zone_code (zone_code),
  KEY idx_region_code (region_code),
  KEY idx_account_status (account_status),
  KEY idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Core user table -- extends econ_customers_drm with Stream/Channel/Territory';

-- 1.2 odt_user_sessions
CREATE TABLE IF NOT EXISTS odt_user_sessions (
  session_id    BIGINT        NOT NULL AUTO_INCREMENT,
  user_id       INT           NOT NULL,
  session_token VARCHAR(255)  NOT NULL,
  ip_address    VARCHAR(45)   DEFAULT NULL,
  user_agent    VARCHAR(500)  DEFAULT NULL,
  login_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  logout_at     DATETIME      DEFAULT NULL,
  is_active     ENUM('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (session_id),
  KEY idx_user_id (user_id),
  KEY idx_session_token (session_token),
  KEY idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Active/historical user login sessions';

-- 1.3 odt_user_stream_channel_map (many-to-many)
CREATE TABLE IF NOT EXISTS odt_user_stream_channel_map (
  map_id          INT           NOT NULL AUTO_INCREMENT,
  user_id         INT           NOT NULL,
  stream          VARCHAR(50)   NOT NULL  COMMENT 'B2B / B2C',
  stream_code     VARCHAR(20)   DEFAULT NULL,
  channel         VARCHAR(50)   NOT NULL  COMMENT 'PCO MCO CVO FWS HD',
  channel_code    VARCHAR(25)   DEFAULT NULL,
  territory_code  VARCHAR(25)   DEFAULT NULL,
  zone_code       VARCHAR(25)   DEFAULT NULL,
  region_code     VARCHAR(20)   DEFAULT NULL,
  status          ENUM('Y','N') NOT NULL DEFAULT 'Y',
  assigned_by     VARCHAR(50)   DEFAULT NULL,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (map_id),
  KEY idx_user_id (user_id),
  KEY idx_stream (stream),
  KEY idx_channel (channel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Many-to-many: User <-> Stream / Channel / Territory mapping';

-- 1.4 odt_user_documents
CREATE TABLE IF NOT EXISTS odt_user_documents (
  doc_id       INT           NOT NULL AUTO_INCREMENT,
  user_id      INT           NOT NULL,
  doc_type     VARCHAR(50)   NOT NULL  COMMENT 'PAN AADHAAR LICENSE OTHER',
  doc_number   VARCHAR(100)  DEFAULT NULL,
  doc_path     VARCHAR(500)  DEFAULT NULL,
  status       ENUM('Y','N') NOT NULL DEFAULT 'Y',
  uploaded_by  VARCHAR(50)   DEFAULT NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (doc_id),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User KYC / identity documents';


-- ##########################################################
--  DATABASE 2: odt_role_permission_db
--  Reference : cdr_roles, aof_permission_master, tcm_ind_role_master
-- ##########################################################

CREATE DATABASE IF NOT EXISTS odt_role_permission_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE odt_role_permission_db;

-- 2.1 odt_roles (ref: cdr_roles + aof_role_master)
CREATE TABLE IF NOT EXISTS odt_roles (
  role_id      INT           NOT NULL AUTO_INCREMENT,
  role_code    VARCHAR(20)   NOT NULL,
  role_name    VARCHAR(100)  NOT NULL,
  role_type    VARCHAR(20)   DEFAULT NULL  COMMENT 'ADMIN USER APPROVER VIEWER',
  stream       VARCHAR(50)   DEFAULT NULL  COMMENT 'B2B / B2C / ALL',
  channel      VARCHAR(50)   DEFAULT NULL  COMMENT 'PCO MCO CVO FWS HD ALL',
  app_type     VARCHAR(20)   DEFAULT NULL  COMMENT 'WOW / CDR / TCM / ALL',
  description  TEXT          DEFAULT NULL,
  status       CHAR(1)       NOT NULL DEFAULT 'Y'  COMMENT 'Y=Active N=Inactive',
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id),
  UNIQUE KEY uq_role_code (role_code),
  KEY idx_stream (stream),
  KEY idx_channel (channel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master list of roles -- ref: cdr_roles aof_role_master';

-- 2.2 odt_modules
CREATE TABLE IF NOT EXISTS odt_modules (
  module_id     INT           NOT NULL AUTO_INCREMENT,
  module_code   VARCHAR(50)   NOT NULL,
  module_name   VARCHAR(100)  NOT NULL,
  parent_module INT           DEFAULT NULL  COMMENT 'Self-ref for sub-modules',
  app_type      VARCHAR(20)   DEFAULT NULL,
  stream        VARCHAR(50)   DEFAULT NULL,
  channel       VARCHAR(50)   DEFAULT NULL,
  sort_order    INT           NOT NULL DEFAULT 0,
  status        CHAR(1)       NOT NULL DEFAULT 'Y',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (module_id),
  UNIQUE KEY uq_module_code (module_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Application modules / menu items / feature areas';

-- 2.3 odt_permissions (ref: aof_permission_master) -- fine-grained CRUD per role per module
CREATE TABLE IF NOT EXISTS odt_permissions (
  permission_id   INT           NOT NULL AUTO_INCREMENT,
  role_id         INT           NOT NULL  COMMENT 'FK odt_roles.role_id',
  module_id       INT           NOT NULL  COMMENT 'FK odt_modules.module_id',
  emp_code        VARCHAR(20)   DEFAULT NULL  COMMENT 'User-level override optional',
  access_level    ENUM('0','1','2','3','4','5','7','ADM','SU') NOT NULL DEFAULT '0',
  stream          VARCHAR(50)   DEFAULT NULL  COMMENT 'B2B / B2C / ALL',
  channel         VARCHAR(50)   DEFAULT NULL  COMMENT 'PCO MCO CVO FWS HD ALL',
  segment         VARCHAR(20)   DEFAULT NULL  COMMENT 'OEM HDSSD DISTRIBUTOR CSA ALL',
  can_view        ENUM('Y','N') NOT NULL DEFAULT 'Y',
  can_add         ENUM('Y','N') NOT NULL DEFAULT 'N',
  can_update      ENUM('Y','N') NOT NULL DEFAULT 'N',
  can_delete      ENUM('Y','N') NOT NULL DEFAULT 'N',
  can_approve     ENUM('Y','N') NOT NULL DEFAULT 'N',
  can_download    ENUM('Y','N') NOT NULL DEFAULT 'N',
  can_upload      ENUM('Y','N') NOT NULL DEFAULT 'N',
  can_export      ENUM('Y','N') NOT NULL DEFAULT 'N',
  status          VARCHAR(1)    NOT NULL DEFAULT 'Y',
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (permission_id),
  UNIQUE KEY uq_role_module (role_id, module_id, emp_code),
  KEY idx_role_id (role_id),
  KEY idx_module_id (module_id),
  KEY idx_stream (stream),
  KEY idx_channel (channel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Role + user level permissions per module -- ref: aof_permission_master';

-- 2.4 odt_role_user_map
CREATE TABLE IF NOT EXISTS odt_role_user_map (
  map_id       INT           NOT NULL AUTO_INCREMENT,
  user_id      INT           NOT NULL  COMMENT 'FK odt_user_db.odt_users.user_id',
  role_id      INT           NOT NULL  COMMENT 'FK odt_roles.role_id',
  assigned_by  VARCHAR(50)   DEFAULT NULL,
  valid_from   DATE          DEFAULT NULL,
  valid_to     DATE          DEFAULT NULL,
  status       ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (map_id),
  KEY idx_user_id (user_id),
  KEY idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User <-> Role mapping with validity period';


-- ##########################################################
--  DATABASE 3: odt_offer_db
--  Reference : wow_wo_offer_details, wow_wo_offer_transaction,
--              wow_wo_offer_closure_transaction,
--              wow_wo_offer_letter_details (cilcc_wow_fresh.sql)
--  Extended  : + stream, channel columns throughout
-- ##########################################################

CREATE DATABASE IF NOT EXISTS odt_offer_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE odt_offer_db;

-- 3.1 odt_offer_details (ref: wow_wo_offer_details + stream/channel)
CREATE TABLE IF NOT EXISTS odt_offer_details (
  offer_id                              INT            NOT NULL AUTO_INCREMENT,
  offer_code                            VARCHAR(32)    DEFAULT NULL,
  executive_code                        VARCHAR(25)    DEFAULT NULL,
  customer_code                         VARCHAR(50)    DEFAULT NULL,
  customer_name                         VARCHAR(200)   DEFAULT NULL,
  -- Stream / Channel (NEW)
  stream                                VARCHAR(50)    DEFAULT NULL  COMMENT 'B2B or B2C',
  stream_code                           VARCHAR(20)    DEFAULT NULL,
  channel                               VARCHAR(50)    DEFAULT NULL  COMMENT 'PCO MCO CVO FWS HD',
  channel_code                          VARCHAR(25)    DEFAULT NULL,
  territory_code                        VARCHAR(25)    DEFAULT NULL,
  zone_code                             VARCHAR(25)    DEFAULT NULL,
  region_code                           VARCHAR(20)    DEFAULT NULL,
  -- Offer Period
  start_date                            DATE           DEFAULT NULL,
  end_date                              DATE           DEFAULT NULL,
  effective_end_date                    DATE           NOT NULL DEFAULT '0000-00-00'  COMMENT 'Effective end for PID',
  -- Financial
  stored_exchange_rate_lc_usd           FLOAT          NOT NULL DEFAULT 70.62,
  stored_cost_of_capital                INT            NOT NULL DEFAULT 6,
  sales_tax_vat_rate                    FLOAT          NOT NULL DEFAULT 18,
  existing_loan_balance                 VARCHAR(64)    DEFAULT NULL,
  existing_loan_contract_end_date       DATE           DEFAULT NULL,
  existing_loan_vol_remaining_litres    VARCHAR(64)    DEFAULT NULL,
  additional_cash_loan                  VARCHAR(64)    DEFAULT NULL,
  additional_equipment_loan             VARCHAR(64)    DEFAULT NULL,
  total_additional_loan                 VARCHAR(64)    DEFAULT NULL,
  total_trade_loan                      VARCHAR(64)    DEFAULT NULL,
  -- Volume & Rebate
  advance_rebate_disbursement_plan      TEXT           DEFAULT NULL,
  volume_delivery_plan                  TEXT           DEFAULT NULL,
  total_volume_commitment               VARCHAR(64)    DEFAULT NULL,
  amortization_rate_per_litre           VARCHAR(64)    DEFAULT NULL,
  initial_marketing_revex               VARCHAR(64)    DEFAULT NULL,
  loan_disbursement                     TEXT           DEFAULT NULL,
  loan_balance_to_be_disbursed          TEXT           DEFAULT NULL,
  gross_turnover_inflation_rate_percent TEXT           DEFAULT NULL,
  cogs_inflation_rate_percent           TEXT           DEFAULT NULL,
  other_inflation_rate_percent          TEXT           DEFAULT NULL,
  sku_text                              TEXT           DEFAULT NULL,
  volume_litre_text                     TEXT           DEFAULT NULL,
  customer_rebates_per_litre_text       TEXT           DEFAULT NULL,
  variable_marketing_cost_per_litre     TEXT           NOT NULL,
  other_variable_cost_per_litre         TEXT           DEFAULT NULL,
  base_incremental_customer_costs_pa    VARCHAR(64)    DEFAULT NULL,
  base_equipment_maintenance_costs_pa   VARCHAR(64)    DEFAULT NULL,
  customer_level_inputs                 TEXT           NOT NULL,
  current_proposed_text                 TEXT           DEFAULT NULL,
  main_competitor_offer_text            TEXT           DEFAULT NULL,
  equipment_purchase_detail             TEXT           DEFAULT NULL,
  investment_term_months                TEXT           DEFAULT NULL,
  -- Credit
  bank_guaranty_plan                    TEXT           DEFAULT NULL,
  credit_term_days                      VARCHAR(64)    DEFAULT NULL,
  trading_credit_limit                  VARCHAR(64)    DEFAULT NULL,
  other_tl_nbv                          VARCHAR(64)    DEFAULT NULL,
  existing_security_positive            VARCHAR(64)    DEFAULT NULL,
  additional_security_required          VARCHAR(64)    DEFAULT NULL,
  total_credit_exposure                 VARCHAR(64)    DEFAULT NULL,
  bp_credit_rating                      VARCHAR(64)    DEFAULT NULL,
  acdd_check                            VARCHAR(10)    DEFAULT NULL,
  acdd_comments                         TEXT           DEFAULT NULL,
  credit_remarks                        TEXT           DEFAULT NULL,
  commercial_input_completed_by_date    DATE           DEFAULT NULL,
  credit_check_completed_by_name        VARCHAR(250)   DEFAULT NULL,
  credit_check_completed_by_date        DATE           DEFAULT NULL,
  -- Workflow Status
  approver                              VARCHAR(38)    DEFAULT NULL,
  offer_status                          VARCHAR(4)     NOT NULL DEFAULT 'D'          COMMENT 'D=Draft P=Pending A=Approved R=Rejected E=Expired',
  delete_reason                         TEXT           DEFAULT NULL,
  reactive_date                         DATE           NOT NULL DEFAULT '0000-00-00',
  mailer_status                         VARCHAR(4)     NOT NULL DEFAULT 'Y',
  is_extended_offer                     VARCHAR(4)     NOT NULL DEFAULT 'N',
  contract_delivery                     VARCHAR(10)    NOT NULL DEFAULT 'NA',
  closure_status                        ENUM('P','Y','N','E','NA') NOT NULL DEFAULT 'NA',
  sku_code_change_status                ENUM('P','N','Y','B') NOT NULL DEFAULT 'N',
  sku_code_change_date                  DATETIME       DEFAULT NULL,
  closure_rejection_date                DATE           DEFAULT NULL,
  -- KERiS
  keris_updation_status                 VARCHAR(4)     NOT NULL DEFAULT 'N',
  keris_updation_date                   DATETIME       DEFAULT NULL,
  is_old_keris                          VARCHAR(5)     NOT NULL DEFAULT 'N',
  parent_id_updation_status             VARCHAR(4)     NOT NULL DEFAULT 'N',
  parent_id_updation_date               DATETIME       DEFAULT NULL,
  is_old_parent                         VARCHAR(5)     NOT NULL DEFAULT 'N',
  -- Flags
  is_pitstop                            VARCHAR(4)     NOT NULL DEFAULT 'N',
  is_wbc_new                            VARCHAR(4)     NOT NULL DEFAULT 'N',
  sku_discount_updation_date            TIMESTAMP      NULL DEFAULT NULL,
  direct_customer_detail                TEXT           DEFAULT NULL,
  indirect_customer_detail              TEXT           DEFAULT NULL,
  mix_incen_remark                      TEXT           NOT NULL,
  mix_incen_remark_flag                 ENUM('D','A') NOT NULL DEFAULT 'D',
  created_at                            TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                            TIMESTAMP      NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (offer_id),
  UNIQUE KEY uq_offer_code (offer_code),
  KEY idx_executive_code (executive_code),
  KEY idx_customer_code (customer_code),
  KEY idx_stream (stream),
  KEY idx_channel (channel),
  KEY idx_territory (territory_code),
  KEY idx_offer_status (offer_status),
  KEY idx_closure_status (closure_status),
  KEY idx_start_date (start_date),
  KEY idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Offer header -- ref: wow_wo_offer_details + stream/channel added';

-- 3.2 odt_offer_approval_transaction (ref: wow_wo_offer_transaction)
CREATE TABLE IF NOT EXISTS odt_offer_approval_transaction (
  txn_id         INT          NOT NULL AUTO_INCREMENT,
  offer_id       INT          NOT NULL,
  stream         VARCHAR(50)  DEFAULT NULL,
  channel        VARCHAR(50)  DEFAULT NULL,
  rtm_status     VARCHAR(1)   NOT NULL DEFAULT 'P', rtm_code VARCHAR(16) DEFAULT NULL, rtm_comments TEXT, rtm_date DATE DEFAULT NULL,
  l1_status      VARCHAR(1)   NOT NULL DEFAULT 'P', l1_code  VARCHAR(16) DEFAULT NULL, l1_comments  TEXT, l1_date  DATE DEFAULT NULL, l1_email VARCHAR(100) DEFAULT NULL,
  l2_status      VARCHAR(1)   NOT NULL DEFAULT 'P', l2_code  VARCHAR(16) DEFAULT NULL, l2_comments  TEXT, l2_date  DATE DEFAULT NULL,
  l3_status      VARCHAR(1)   NOT NULL DEFAULT 'P', l3_code  VARCHAR(16) DEFAULT NULL, l3_comments  TEXT, l3_date  DATE DEFAULT NULL,
  l3_2_status    VARCHAR(2)   NOT NULL DEFAULT 'P', l3_2_code VARCHAR(16) DEFAULT NULL, l3_2_comments TEXT, l3_2_date DATE DEFAULT NULL,
  l4_status      VARCHAR(1)   NOT NULL DEFAULT 'P', l4_code  VARCHAR(16) DEFAULT NULL, l4_comments  TEXT, l4_date  DATE DEFAULT NULL,
  l5_status      VARCHAR(1)   NOT NULL DEFAULT 'P', l5_code  VARCHAR(16) DEFAULT NULL, l5_comments  TEXT, l5_date  DATE DEFAULT NULL,
  l6_status      VARCHAR(1)   NOT NULL DEFAULT 'P', l6_code  VARCHAR(16) DEFAULT NULL, l6_comments  TEXT, l6_date  DATE DEFAULT NULL,
  l7_status      VARCHAR(1)   NOT NULL DEFAULT 'P', l7_code  VARCHAR(16) DEFAULT NULL, l7_comments  TEXT, l7_date  DATE DEFAULT NULL,
  cm_status      VARCHAR(1)   NOT NULL DEFAULT 'P', cm_code  VARCHAR(16) DEFAULT NULL, cm_comments  TEXT, cm_date  DATE DEFAULT NULL,
  srca_status    VARCHAR(1)   NOT NULL DEFAULT 'P', srca_code VARCHAR(16) DEFAULT NULL, srca_comments TEXT, srca_date DATE DEFAULT NULL,
  ci_status      VARCHAR(1)   NOT NULL DEFAULT 'P', ci_code  VARCHAR(16) DEFAULT NULL, ci_comments  TEXT, ci_date  DATE DEFAULT NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (txn_id),
  KEY idx_offer_id (offer_id),
  KEY idx_stream (stream),
  KEY idx_channel (channel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Offer approval levels RTM L1-L7 CM SRCA CI -- ref: wow_wo_offer_transaction';

-- 3.3 odt_offer_closure_transaction (ref: wow_wo_offer_closure_transaction)
CREATE TABLE IF NOT EXISTS odt_offer_closure_transaction (
  closure_id          INT           NOT NULL AUTO_INCREMENT,
  offer_id            INT           NOT NULL,
  added_date          DATE          NOT NULL,
  added_by            VARCHAR(25)   DEFAULT NULL,
  added_by_email      VARCHAR(100)  DEFAULT NULL,
  added_by_comments   TEXT,
  stream              VARCHAR(50)   DEFAULT NULL,
  channel             VARCHAR(50)   DEFAULT NULL,
  volume_status       CHAR(2)       NOT NULL,
  recovery_status     CHAR(2)       NOT NULL DEFAULT 'N',
  recovery_attachment TEXT,
  l1_status CHAR(2) NOT NULL, l1_date DATE NOT NULL, l1_code VARCHAR(20) NOT NULL, l1_email VARCHAR(100) NOT NULL, l1_comments TEXT NOT NULL,
  l2_status CHAR(2) NOT NULL, l2_date DATE NOT NULL, l2_code VARCHAR(20) NOT NULL, l2_email VARCHAR(100) NOT NULL, l2_comments TEXT NOT NULL,
  l3_status CHAR(2) NOT NULL, l3_date DATE NOT NULL, l3_code VARCHAR(20) NOT NULL, l3_email VARCHAR(100) NOT NULL, l3_comments TEXT NOT NULL,
  l4_status CHAR(2) NOT NULL, l4_date DATE NOT NULL, l4_code VARCHAR(20) NOT NULL, l4_email VARCHAR(100) NOT NULL, l4_comments TEXT NOT NULL,
  l5_status CHAR(2) NOT NULL, l5_date DATE NOT NULL, l5_code VARCHAR(20) NOT NULL, l5_email VARCHAR(100) NOT NULL, l5_comments TEXT NOT NULL,
  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (closure_id),
  KEY idx_offer_id (offer_id),
  KEY idx_stream (stream),
  KEY idx_channel (channel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Offer closure settlement -- ref: wow_wo_offer_closure_transaction';

-- 3.4 odt_offer_letter_details (ref: wow_wo_offer_letter_details)
CREATE TABLE IF NOT EXISTS odt_offer_letter_details (
  letter_id            INT           NOT NULL AUTO_INCREMENT,
  offer_id             INT           NOT NULL,
  executive_code       VARCHAR(50)   NOT NULL,
  stream               VARCHAR(50)   DEFAULT NULL,
  channel              VARCHAR(50)   DEFAULT NULL,
  offer_letter_date    DATETIME      NOT NULL,
  offer_file_path      VARCHAR(255)  NOT NULL,
  offer_letter_status  VARCHAR(1)    NOT NULL DEFAULT 'E'  COMMENT 'E=Pending P=Published R=Recalled',
  serial_no            VARCHAR(32)   NOT NULL,
  last_action_on       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (letter_id),
  KEY idx_offer_id (offer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Offer letter documents -- ref: wow_wo_offer_letter_details';

-- 3.5 odt_offer_sku_details
CREATE TABLE IF NOT EXISTS odt_offer_sku_details (
  sku_detail_id         INT            NOT NULL AUTO_INCREMENT,
  offer_id              INT            NOT NULL,
  sku_code              VARCHAR(50)    NOT NULL,
  sku_name              VARCHAR(200)   DEFAULT NULL,
  volume_litres         DECIMAL(15,4)  DEFAULT NULL,
  rebate_per_litre      DECIMAL(10,4)  DEFAULT NULL,
  variable_mktg_cost    DECIMAL(10,4)  DEFAULT NULL,
  other_variable_cost   DECIMAL(10,4)  DEFAULT NULL,
  stream                VARCHAR(50)    DEFAULT NULL,
  channel               VARCHAR(50)    DEFAULT NULL,
  status                ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at            TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP      NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (sku_detail_id),
  KEY idx_offer_id (offer_id),
  KEY idx_sku_code (sku_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='SKU-level offer details';


-- ##########################################################
--  DATABASE 4: odt_master_data_db
--  Reference : channels_master, territory_master, zone_master,
--              region_master, b2b_master_segment (cilcc_cdr/wow)
-- ##########################################################

CREATE DATABASE IF NOT EXISTS odt_master_data_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE odt_master_data_db;

-- 4.1 odt_streams
CREATE TABLE IF NOT EXISTS odt_streams (
  stream_id    INT           NOT NULL AUTO_INCREMENT,
  stream_code  VARCHAR(20)   NOT NULL,
  stream_name  VARCHAR(100)  NOT NULL,
  description  TEXT          DEFAULT NULL,
  status       ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (stream_id),
  UNIQUE KEY uq_stream_code (stream_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Stream master: B2B B2C';

INSERT IGNORE INTO odt_streams (stream_code, stream_name) VALUES
  ('B2B', 'Business to Business'),
  ('B2C', 'Business to Consumer');

-- 4.2 odt_channels (ref: channels_master)
CREATE TABLE IF NOT EXISTS odt_channels (
  channel_id    INT           NOT NULL AUTO_INCREMENT,
  channel_code  VARCHAR(25)   NOT NULL,
  channel_name  VARCHAR(100)  NOT NULL,
  stream_code   VARCHAR(20)   DEFAULT NULL,
  description   TEXT          DEFAULT NULL,
  status        ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (channel_id),
  UNIQUE KEY uq_channel_code (channel_code),
  KEY idx_stream_code (stream_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Channel master -- ref: channels_master';

INSERT IGNORE INTO odt_channels (channel_code, channel_name, stream_code) VALUES
  ('PCO',    'Passenger Car Oil',         'B2C'),
  ('MCO',    'Motorcycle Oil',            'B2C'),
  ('CVO',    'Commercial Vehicle Oil',    'B2B'),
  ('FWS',    'Fast-Wear Shops',           'B2C'),
  ('HD',     'Heavy Duty / Industrial',   'B2B'),
  ('RETAIL', 'Retail General Trade',      'B2C'),
  ('IND',    'Industrial B2B',            'B2B');

-- 4.3 odt_zones (ref: zone_master)
CREATE TABLE IF NOT EXISTS odt_zones (
  zone_id    INT           NOT NULL AUTO_INCREMENT,
  zone_code  VARCHAR(25)   NOT NULL,
  zone_name  VARCHAR(100)  NOT NULL,
  status     ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (zone_id),
  UNIQUE KEY uq_zone_code (zone_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Zone master -- ref: zone_master';

INSERT IGNORE INTO odt_zones (zone_code, zone_name) VALUES
  ('NORTH',   'North Zone'),
  ('SOUTH',   'South Zone'),
  ('EAST',    'East Zone'),
  ('WEST',    'West Zone'),
  ('CENTRAL', 'Central Zone');

-- 4.4 odt_regions (ref: region_master + tcm_ind_region_master)
CREATE TABLE IF NOT EXISTS odt_regions (
  region_id    INT           NOT NULL AUTO_INCREMENT,
  region_code  VARCHAR(20)   NOT NULL,
  region_name  VARCHAR(100)  NOT NULL,
  zone_code    VARCHAR(25)   DEFAULT NULL,
  status       ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (region_id),
  UNIQUE KEY uq_region_code (region_code),
  KEY idx_zone_code (zone_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Region master -- ref: region_master tcm_ind_region_master';

-- 4.5 odt_territories (ref: territory_master)
CREATE TABLE IF NOT EXISTS odt_territories (
  territory_id    INT           NOT NULL AUTO_INCREMENT,
  territory_code  VARCHAR(25)   NOT NULL,
  territory_name  VARCHAR(100)  NOT NULL,
  region_code     VARCHAR(20)   DEFAULT NULL,
  zone_code       VARCHAR(25)   DEFAULT NULL,
  stream_code     VARCHAR(20)   DEFAULT NULL,
  channel_code    VARCHAR(25)   DEFAULT NULL,
  status          ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (territory_id),
  UNIQUE KEY uq_territory_code (territory_code),
  KEY idx_zone_code (zone_code),
  KEY idx_region_code (region_code),
  KEY idx_stream_code (stream_code),
  KEY idx_channel_code (channel_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Territory master -- ref: territory_master';

-- 4.6 odt_stream_channel_territory_limits
CREATE TABLE IF NOT EXISTS odt_stream_channel_territory_limits (
  limit_id                  INT            NOT NULL AUTO_INCREMENT,
  stream_code               VARCHAR(20)    NOT NULL,
  channel_code              VARCHAR(25)    NOT NULL,
  territory_code            VARCHAR(25)    DEFAULT NULL,
  zone_code                 VARCHAR(25)    DEFAULT NULL,
  region_code               VARCHAR(20)    DEFAULT NULL,
  min_volume_litres         DECIMAL(15,4)  DEFAULT NULL,
  max_volume_litres         DECIMAL(15,4)  DEFAULT NULL,
  min_offer_value           DECIMAL(15,2)  DEFAULT NULL,
  max_offer_value           DECIMAL(15,2)  DEFAULT NULL,
  max_credit_days           INT            DEFAULT NULL,
  max_loan_amount           DECIMAL(15,2)  DEFAULT NULL,
  approval_level_required   VARCHAR(5)     DEFAULT NULL  COMMENT 'L1 L2 L3 L4 L5 L6 L7',
  effective_from            DATE           DEFAULT NULL,
  effective_to              DATE           DEFAULT NULL,
  status                    ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_by                VARCHAR(50)    DEFAULT NULL,
  created_at                TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                TIMESTAMP      NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (limit_id),
  KEY idx_stream_channel (stream_code, channel_code),
  KEY idx_territory (territory_code),
  KEY idx_zone (zone_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Stream x Channel x Territory volume and offer limits';

-- 4.7 odt_b2b_segments (ref: b2b_master_segment)
CREATE TABLE IF NOT EXISTS odt_b2b_segments (
  segment_id    INT           NOT NULL AUTO_INCREMENT,
  segment_code  VARCHAR(25)   NOT NULL,
  segment_name  VARCHAR(100)  NOT NULL,
  stream_code   VARCHAR(20)   DEFAULT 'B2B',
  status        ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (segment_id),
  UNIQUE KEY uq_segment_code (segment_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='B2B segment master -- ref: b2b_master_segment';

-- 4.8 odt_b2b_subsegments (ref: b2b_master_subsegment)
CREATE TABLE IF NOT EXISTS odt_b2b_subsegments (
  subsegment_id    INT           NOT NULL AUTO_INCREMENT,
  subsegment_code  VARCHAR(25)   NOT NULL,
  subsegment_name  VARCHAR(100)  NOT NULL,
  segment_code     VARCHAR(25)   NOT NULL,
  status           ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (subsegment_id),
  UNIQUE KEY uq_subsegment_code (subsegment_code),
  KEY idx_segment_code (segment_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='B2B sub-segment master -- ref: b2b_master_subsegment';

-- 4.9 odt_sku_master
CREATE TABLE IF NOT EXISTS odt_sku_master (
  sku_id        INT           NOT NULL AUTO_INCREMENT,
  sku_code      VARCHAR(50)   NOT NULL,
  sku_name      VARCHAR(200)  NOT NULL,
  brand         VARCHAR(100)  DEFAULT NULL,
  category      VARCHAR(100)  DEFAULT NULL,
  pack_size     VARCHAR(50)   DEFAULT NULL,
  uom           VARCHAR(20)   DEFAULT NULL  COMMENT 'LTR KG PCS',
  stream_code   VARCHAR(20)   DEFAULT NULL,
  channel_code  VARCHAR(25)   DEFAULT NULL,
  status        ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (sku_id),
  UNIQUE KEY uq_sku_code (sku_code),
  KEY idx_stream (stream_code),
  KEY idx_channel (channel_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='SKU product master';

-- 4.10 odt_customer_master
CREATE TABLE IF NOT EXISTS odt_customer_master (
  customer_id      INT           NOT NULL AUTO_INCREMENT,
  customer_code    VARCHAR(50)   NOT NULL,
  customer_name    VARCHAR(200)  NOT NULL,
  stream           VARCHAR(50)   DEFAULT NULL,
  channel          VARCHAR(50)   DEFAULT NULL,
  segment_code     VARCHAR(25)   DEFAULT NULL,
  subsegment_code  VARCHAR(25)   DEFAULT NULL,
  territory_code   VARCHAR(25)   DEFAULT NULL,
  zone_code        VARCHAR(25)   DEFAULT NULL,
  region_code      VARCHAR(20)   DEFAULT NULL,
  parent_code      VARCHAR(50)   DEFAULT NULL,
  group_code       VARCHAR(50)   DEFAULT NULL,
  contact_person   VARCHAR(150)  DEFAULT NULL,
  email            VARCHAR(100)  DEFAULT NULL,
  mobile           VARCHAR(20)   DEFAULT NULL,
  address          TEXT          DEFAULT NULL,
  city             VARCHAR(100)  DEFAULT NULL,
  state            VARCHAR(100)  DEFAULT NULL,
  pincode          VARCHAR(10)   DEFAULT NULL,
  gst_number       VARCHAR(20)   DEFAULT NULL,
  pan_number       VARCHAR(20)   DEFAULT NULL,
  credit_limit     DECIMAL(15,2) DEFAULT NULL,
  credit_days      INT           DEFAULT NULL,
  status           ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uq_customer_code (customer_code),
  KEY idx_stream (stream),
  KEY idx_channel (channel),
  KEY idx_territory (territory_code),
  KEY idx_zone (zone_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Central customer master';


-- ##########################################################
--  DATABASE 5: odt_notification_db
-- ##########################################################

CREATE DATABASE IF NOT EXISTS odt_notification_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE odt_notification_db;

-- 5.1 odt_notification_templates
CREATE TABLE IF NOT EXISTS odt_notification_templates (
  template_id       INT           NOT NULL AUTO_INCREMENT,
  template_code     VARCHAR(50)   NOT NULL,
  template_name     VARCHAR(200)  NOT NULL,
  notification_type ENUM('EMAIL','SMS','WHATSAPP','IN_APP','PUSH') NOT NULL,
  stream            VARCHAR(50)   DEFAULT NULL,
  channel           VARCHAR(50)   DEFAULT NULL,
  app_type          VARCHAR(20)   DEFAULT NULL,
  event_code        VARCHAR(50)   DEFAULT NULL  COMMENT 'OFFER_CREATED OFFER_APPROVED CLOSURE_DONE',
  subject           VARCHAR(500)  DEFAULT NULL,
  body_html         LONGTEXT      DEFAULT NULL,
  body_text         TEXT          DEFAULT NULL,
  placeholders      TEXT          DEFAULT NULL  COMMENT 'JSON list of placeholder keys',
  is_active         ENUM('Y','N') NOT NULL DEFAULT 'Y',
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (template_id),
  UNIQUE KEY uq_template_code (template_code),
  KEY idx_event_code (event_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Notification templates for EMAIL SMS In-App alerts';

-- 5.2 odt_notification_log
CREATE TABLE IF NOT EXISTS odt_notification_log (
  notif_id          BIGINT        NOT NULL AUTO_INCREMENT,
  template_code     VARCHAR(50)   DEFAULT NULL,
  notification_type ENUM('EMAIL','SMS','WHATSAPP','IN_APP','PUSH') NOT NULL,
  event_code        VARCHAR(50)   DEFAULT NULL,
  ref_entity_type   VARCHAR(50)   DEFAULT NULL  COMMENT 'OFFER USER CLOSURE',
  ref_entity_id     VARCHAR(50)   DEFAULT NULL,
  stream            VARCHAR(50)   DEFAULT NULL,
  channel           VARCHAR(50)   DEFAULT NULL,
  sender_code       VARCHAR(50)   DEFAULT NULL,
  sender_email      VARCHAR(150)  DEFAULT NULL,
  recipient_code    VARCHAR(50)   DEFAULT NULL,
  recipient_email   VARCHAR(150)  DEFAULT NULL,
  recipient_mobile  VARCHAR(20)   DEFAULT NULL,
  subject           VARCHAR(500)  DEFAULT NULL,
  body              LONGTEXT      DEFAULT NULL,
  status            ENUM('PENDING','SENT','FAILED','BOUNCED') NOT NULL DEFAULT 'PENDING',
  retry_count       INT           NOT NULL DEFAULT 0,
  error_message     TEXT          DEFAULT NULL,
  sent_at           DATETIME      DEFAULT NULL,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (notif_id),
  KEY idx_event_code (event_code),
  KEY idx_ref_entity (ref_entity_type, ref_entity_id),
  KEY idx_status (status),
  KEY idx_recipient_email (recipient_email),
  KEY idx_stream (stream),
  KEY idx_channel (channel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Full notification log for EMAIL SMS In-App Push';

-- 5.3 odt_in_app_notifications
CREATE TABLE IF NOT EXISTS odt_in_app_notifications (
  id                BIGINT        NOT NULL AUTO_INCREMENT,
  user_id           INT           NOT NULL,
  title             VARCHAR(200)  NOT NULL,
  message           TEXT          NOT NULL,
  notification_type VARCHAR(50)   DEFAULT 'INFO'  COMMENT 'INFO WARNING ALERT SUCCESS',
  ref_entity_type   VARCHAR(50)   DEFAULT NULL,
  ref_entity_id     VARCHAR(50)   DEFAULT NULL,
  stream            VARCHAR(50)   DEFAULT NULL,
  channel           VARCHAR(50)   DEFAULT NULL,
  is_read           ENUM('Y','N') NOT NULL DEFAULT 'N',
  read_at           DATETIME      DEFAULT NULL,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  KEY idx_is_read (is_read),
  KEY idx_stream (stream)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='In-app notification inbox per user';

-- 5.4 odt_mailer_queue (ref: activation_deactivation_mailer aof_mail_master)
CREATE TABLE IF NOT EXISTS odt_mailer_queue (
  queue_id         BIGINT        NOT NULL AUTO_INCREMENT,
  template_code    VARCHAR(50)   DEFAULT NULL,
  event_code       VARCHAR(50)   DEFAULT NULL,
  ref_entity_type  VARCHAR(50)   DEFAULT NULL,
  ref_entity_id    VARCHAR(50)   DEFAULT NULL,
  stream           VARCHAR(50)   DEFAULT NULL,
  channel          VARCHAR(50)   DEFAULT NULL,
  from_email       VARCHAR(150)  DEFAULT NULL,
  to_email         VARCHAR(500)  NOT NULL,
  cc_email         VARCHAR(500)  DEFAULT NULL,
  bcc_email        VARCHAR(500)  DEFAULT NULL,
  subject          VARCHAR(500)  NOT NULL,
  body             LONGTEXT      NOT NULL,
  attachment_path  TEXT          DEFAULT NULL,
  priority         TINYINT       NOT NULL DEFAULT 5  COMMENT '1=High 5=Normal 10=Low',
  scheduled_at     DATETIME      DEFAULT NULL,
  status           ENUM('QUEUED','PROCESSING','SENT','FAILED') NOT NULL DEFAULT 'QUEUED',
  retry_count      INT           NOT NULL DEFAULT 0,
  error_message    TEXT          DEFAULT NULL,
  sent_at          DATETIME      DEFAULT NULL,
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (queue_id),
  KEY idx_status (status),
  KEY idx_priority (priority),
  KEY idx_scheduled (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Async mailer queue for all outbound emails';


-- ##########################################################
--  DATABASE 6: odt_audit_log_db
--  Reference : admin_activity_log, admin_backup_log,
--              admin_customer_tagging_audit_log (cilcc_cdr)
-- ##########################################################

CREATE DATABASE IF NOT EXISTS odt_audit_log_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE odt_audit_log_db;

-- 6.1 odt_audit_logs (ref: admin_activity_log)
CREATE TABLE IF NOT EXISTS odt_audit_logs (
  audit_id        BIGINT        NOT NULL AUTO_INCREMENT,
  action_type     VARCHAR(100)  NOT NULL  COMMENT 'INSERT UPDATE DELETE LOGIN LOGOUT APPROVE REJECT EXPORT',
  entity_type     VARCHAR(50)   DEFAULT NULL  COMMENT 'USER OFFER ROLE PERMISSION CUSTOMER SKU',
  entity_id       VARCHAR(100)  DEFAULT NULL,
  entity_code     VARCHAR(100)  DEFAULT NULL,
  actor_user_id   INT           DEFAULT NULL,
  actor_code      VARCHAR(100)  DEFAULT NULL,
  actor_email     VARCHAR(150)  DEFAULT NULL,
  actor_role      VARCHAR(50)   DEFAULT NULL,
  ip_address      VARCHAR(50)   DEFAULT NULL,
  user_agent      VARCHAR(500)  DEFAULT NULL,
  stream          VARCHAR(50)   DEFAULT NULL,
  channel         VARCHAR(50)   DEFAULT NULL,
  territory_code  VARCHAR(25)   DEFAULT NULL,
  app_type        VARCHAR(20)   DEFAULT NULL,
  module          VARCHAR(100)  DEFAULT NULL,
  before_data     LONGTEXT      DEFAULT NULL  COMMENT 'JSON snapshot before change',
  after_data      LONGTEXT      DEFAULT NULL  COMMENT 'JSON snapshot after change',
  changed_fields  TEXT          DEFAULT NULL  COMMENT 'JSON array of changed field names',
  status          VARCHAR(30)   DEFAULT NULL,
  remarks         TEXT          DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (audit_id),
  KEY idx_action_type (action_type),
  KEY idx_entity (entity_type, entity_id),
  KEY idx_actor_code (actor_code),
  KEY idx_stream (stream),
  KEY idx_channel (channel),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Global audit trail -- ref: admin_activity_log';

-- 6.2 odt_backup_log (ref: admin_backup_log)
CREATE TABLE IF NOT EXISTS odt_backup_log (
  backup_id       BIGINT        NOT NULL AUTO_INCREMENT,
  action_type     VARCHAR(100)  DEFAULT NULL,
  original_table  VARCHAR(150)  DEFAULT NULL,
  backup_table    VARCHAR(150)  DEFAULT NULL,
  backup_db       VARCHAR(150)  DEFAULT NULL,
  record_count    INT           DEFAULT NULL,
  triggered_by    VARCHAR(100)  DEFAULT NULL,
  trigger_reason  VARCHAR(300)  DEFAULT NULL,
  status          ENUM('SUCCESS','FAILED','PARTIAL') NOT NULL DEFAULT 'SUCCESS',
  error_message   TEXT          DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (backup_id),
  KEY idx_original_table (original_table),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='DB backup history -- ref: admin_backup_log';

-- 6.3 odt_login_audit
CREATE TABLE IF NOT EXISTS odt_login_audit (
  login_audit_id  BIGINT        NOT NULL AUTO_INCREMENT,
  user_id         INT           DEFAULT NULL,
  user_code       VARCHAR(50)   DEFAULT NULL,
  email           VARCHAR(150)  DEFAULT NULL,
  login_type      ENUM('LOGIN','LOGOUT','FAILED','BLOCKED','PASSWORD_CHANGE','PASSWORD_RESET') NOT NULL,
  ip_address      VARCHAR(45)   DEFAULT NULL,
  user_agent      VARCHAR(500)  DEFAULT NULL,
  stream          VARCHAR(50)   DEFAULT NULL,
  channel         VARCHAR(50)   DEFAULT NULL,
  app_type        VARCHAR(20)   DEFAULT NULL,
  failure_reason  VARCHAR(200)  DEFAULT NULL,
  session_token   VARCHAR(255)  DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (login_audit_id),
  KEY idx_user_id (user_id),
  KEY idx_user_code (user_code),
  KEY idx_login_type (login_type),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Login logout failure security audit';

-- 6.4 odt_data_change_log (field-level diff)
CREATE TABLE IF NOT EXISTS odt_data_change_log (
  change_id         BIGINT        NOT NULL AUTO_INCREMENT,
  audit_id          BIGINT        DEFAULT NULL,
  entity_type       VARCHAR(50)   NOT NULL,
  entity_id         VARCHAR(100)  NOT NULL,
  field_name        VARCHAR(100)  NOT NULL,
  old_value         TEXT          DEFAULT NULL,
  new_value         TEXT          DEFAULT NULL,
  changed_by_code   VARCHAR(50)   DEFAULT NULL,
  changed_by_email  VARCHAR(150)  DEFAULT NULL,
  stream            VARCHAR(50)   DEFAULT NULL,
  channel           VARCHAR(50)   DEFAULT NULL,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (change_id),
  KEY idx_audit_id (audit_id),
  KEY idx_entity (entity_type, entity_id),
  KEY idx_field_name (field_name),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Field-level change diff log for sensitive data';

-- ============================================================
--  END OF SCHEMA - ODT 6-Database Architecture
-- ============================================================
