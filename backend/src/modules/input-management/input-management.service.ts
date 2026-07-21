import { Injectable } from '@nestjs/common';

@Injectable()
export class InputManagementService {
  private masterRecords = [
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

  getMasterRecords() {
    return this.masterRecords;
  }

  uploadMasterFile(masterType: string, uploadedBy: string, filename: string) {
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
}
