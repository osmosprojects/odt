import { MasterDataService } from './master-data.service';
export declare class MasterDataController {
    private readonly masterDataService;
    constructor(masterDataService: MasterDataService);
    getStreams(): Promise<import("../../entities/master-data.entities").Stream[]>;
    getChannels(streamCode?: string): Promise<import("../../entities/master-data.entities").Channel[]>;
    getZones(): Promise<import("../../entities/master-data.entities").Zone[] | {
        zoneId: number;
        zoneCode: string;
        zoneName: string;
    }[]>;
    getRegions(zoneCode?: string): Promise<{
        regionId: number;
        regionCode: string;
        regionName: string;
        zoneCode: string;
    }[]>;
    getCustomers(query: any): Promise<import("../../entities/master-data.entities").CustomerMaster[] | {
        customerId: number;
        customerCode: string;
        customerName: string;
        stream: string;
        channel: string;
        territoryCode: string;
        email: string;
        mobile: string;
        status: string;
    }[]>;
    getSkus(): Promise<import("../../entities/master-data.entities").SkuMaster[] | {
        skuId: number;
        skuCode: string;
        skuName: string;
        brand: string;
        category: string;
        packSize: string;
        uom: string;
    }[]>;
}
