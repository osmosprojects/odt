"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputManagementService = void 0;
const common_1 = require("@nestjs/common");
let InputManagementService = class InputManagementService {
    constructor() {
        this.masterRecords = [
            {
                id: 'MST-001',
                masterType: 'Customer Master',
                lastUpdatedOn: '21 May 2024, 10:30 AM',
                uploadedBy: 'John Doe',
                approvalMailName: 'customer-master-approval.msg',
                masterFileName: 'customer_master_may2024.xlsx',
                status: 'Active',
            },
            {
                id: 'MST-002',
                masterType: 'SKU Master',
                lastUpdatedOn: '21 May 2024, 09:15 AM',
                uploadedBy: 'Jane Smith',
                approvalMailName: 'sku-master-approval.eml',
                masterFileName: 'sku_master_may2024.xlsx',
                status: 'Pending Approval',
            },
            {
                id: 'MST-003',
                masterType: 'Distributor Master',
                lastUpdatedOn: '20 May 2024, 04:45 PM',
                uploadedBy: 'Mike Wilson',
                approvalMailName: null,
                masterFileName: 'distributor_master_may2024.xlsx',
                status: 'Active',
            },
        ];
    }
    getMasterRecords() {
        return this.masterRecords;
    }
    uploadMasterFile(masterType, uploadedBy, filename) {
        const newRecord = {
            id: `MST-00${this.masterRecords.length + 1}`,
            masterType,
            lastUpdatedOn: new Date().toLocaleString(),
            uploadedBy: uploadedBy || 'Admin',
            approvalMailName: `${masterType.toLowerCase().replace(' ', '_')}_approval.pdf`,
            masterFileName: filename,
            status: 'Active',
        };
        this.masterRecords.unshift(newRecord);
        return {
            message: `${masterType} file uploaded & parsed successfully`,
            record: newRecord,
        };
    }
};
exports.InputManagementService = InputManagementService;
exports.InputManagementService = InputManagementService = __decorate([
    (0, common_1.Injectable)()
], InputManagementService);
//# sourceMappingURL=input-management.service.js.map