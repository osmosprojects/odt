export declare class InputManagementService {
    private masterRecords;
    getMasterRecords(): {
        id: string;
        masterType: string;
        lastUpdatedOn: string;
        uploadedBy: string;
        approvalMailName: string;
        masterFileName: string;
        status: string;
    }[];
    uploadMasterFile(masterType: string, uploadedBy: string, filename: string): {
        message: string;
        record: {
            id: string;
            masterType: string;
            lastUpdatedOn: string;
            uploadedBy: string;
            approvalMailName: string;
            masterFileName: string;
            status: string;
        };
    };
}
