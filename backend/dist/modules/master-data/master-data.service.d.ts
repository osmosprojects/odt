import { Repository } from 'typeorm';
import { Stream, Channel, Zone, Region, CustomerMaster, SkuMaster } from '../../entities/master-data.entities';
export declare class MasterDataService {
    private readonly streamRepo?;
    private readonly channelRepo?;
    private readonly zoneRepo?;
    private readonly regionRepo?;
    private readonly customerRepo?;
    private readonly skuRepo?;
    constructor(streamRepo?: Repository<Stream>, channelRepo?: Repository<Channel>, zoneRepo?: Repository<Zone>, regionRepo?: Repository<Region>, customerRepo?: Repository<CustomerMaster>, skuRepo?: Repository<SkuMaster>);
    getStreams(): Promise<Stream[]>;
    getChannels(streamCode?: string): Promise<Channel[]>;
    getZones(): Promise<Zone[] | {
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
    getCustomers(query?: any): Promise<CustomerMaster[] | {
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
    getSkus(): Promise<SkuMaster[] | {
        skuId: number;
        skuCode: string;
        skuName: string;
        brand: string;
        category: string;
        packSize: string;
        uom: string;
    }[]>;
}
