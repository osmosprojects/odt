import { InputManagementService } from './input-management.service';
export declare class InputManagementController {
    private readonly inputManagementService;
    constructor(inputManagementService: InputManagementService);
    getMasterRecords(): {
        id: string;
        masterType: string;
        lastUpdatedOn: string;
        uploadedBy: string;
        approvalMailName: string;
        masterFileName: string;
        status: string;
    }[];
    uploadMasterFile(body: {
        masterType: string;
        uploadedBy?: string;
        filename: string;
    }): {
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
