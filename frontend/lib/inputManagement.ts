export type MasterStatus = "Active" | "Pending Approval" | "Inactive";

export interface MasterRecord {
  id: string;
  masterType: string;
  lastUpdatedOn: string;
  uploadedBy: string;
  approvalMailName: string | null;
  masterFileName: string;
  status: MasterStatus;
}

export const masterTypeOptions = [
  "Customer Master",
  "SKU Master",
  "Distributor Master",
  "Item Master",
  "Terms Master",
  "Offer Master",
];

export const masterRecords: MasterRecord[] = [
  {
    id: "MST-001",
    masterType: "Customer Master",
    lastUpdatedOn: "21 May 2024, 10:30 AM",
    uploadedBy: "John Doe",
    approvalMailName: "customer-master-approval.msg",
    masterFileName: "customer_master_may2024.xlsx",
    status: "Active",
  },
  {
    id: "MST-002",
    masterType: "SKU Master",
    lastUpdatedOn: "21 May 2024, 09:15 AM",
    uploadedBy: "Jane Smith",
    approvalMailName: "sku-master-approval.eml",
    masterFileName: "sku_master_may2024.xlsx",
    status: "Pending Approval",
  },
  {
    id: "MST-003",
    masterType: "Distributor Master",
    lastUpdatedOn: "20 May 2024, 04:45 PM",
    uploadedBy: "Mike Wilson",
    approvalMailName: null,
    masterFileName: "distributor_master_may2024.xlsx",
    status: "Active",
  },
  {
    id: "MST-004",
    masterType: "Item Master",
    lastUpdatedOn: "19 May 2024, 11:20 AM",
    uploadedBy: "Sarah Lee",
    approvalMailName: "item-master-approval.pdf",
    masterFileName: "item_master_may2024.xlsx",
    status: "Active",
  },
  {
    id: "MST-005",
    masterType: "Terms Master",
    lastUpdatedOn: "18 May 2024, 02:10 PM",
    uploadedBy: "John Doe",
    approvalMailName: null,
    masterFileName: "terms_master_may2024.xlsx",
    status: "Inactive",
  },
];

export function getCurrentMasterForType(masterType: string): MasterRecord | undefined {
  return masterRecords.find((m) => m.masterType === masterType);
}