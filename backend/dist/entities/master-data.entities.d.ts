export declare class Stream {
    streamId: number;
    streamCode: string;
    streamName: string;
    status: string;
}
export declare class Channel {
    channelId: number;
    channelCode: string;
    channelName: string;
    streamCode: string;
    status: string;
}
export declare class Zone {
    zoneId: number;
    zoneCode: string;
    zoneName: string;
    status: string;
}
export declare class Region {
    regionId: number;
    regionCode: string;
    regionName: string;
    zoneCode: string;
    status: string;
}
export declare class Territory {
    territoryId: number;
    territoryCode: string;
    territoryName: string;
    regionCode: string;
    zoneCode: string;
    streamCode: string;
    channelCode: string;
    status: string;
}
export declare class SkuMaster {
    skuId: number;
    skuCode: string;
    skuName: string;
    brand: string;
    category: string;
    packSize: string;
    uom: string;
    status: string;
}
export declare class CustomerMaster {
    customerId: number;
    customerCode: string;
    customerName: string;
    stream: string;
    channel: string;
    territoryCode: string;
    zoneCode: string;
    regionCode: string;
    email: string;
    mobile: string;
    status: string;
}
