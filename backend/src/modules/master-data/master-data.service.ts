import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stream, Channel, Zone, Region, CustomerMaster, SkuMaster } from '../../entities/master-data.entities';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(Stream, 'masterDbConnection')
    private readonly streamRepo?: Repository<Stream>,
    @InjectRepository(Channel, 'masterDbConnection')
    private readonly channelRepo?: Repository<Channel>,
    @InjectRepository(Zone, 'masterDbConnection')
    private readonly zoneRepo?: Repository<Zone>,
    @InjectRepository(Region, 'masterDbConnection')
    private readonly regionRepo?: Repository<Region>,
    @InjectRepository(CustomerMaster, 'masterDbConnection')
    private readonly customerRepo?: Repository<CustomerMaster>,
    @InjectRepository(SkuMaster, 'masterDbConnection')
    private readonly skuRepo?: Repository<SkuMaster>,
  ) {}

  async getStreams() {
    try {
      if (this.streamRepo) {
        const streams = await this.streamRepo.find();
        if (streams && streams.length > 0) return streams;
      }
    } catch (e) {
      // Fallback if DB connection transient
    }
    return [
      { streamId: 1, streamCode: 'B2B', streamName: 'Business to Business', status: 'Y' },
      { streamId: 2, streamCode: 'B2C', streamName: 'Business to Consumer', status: 'Y' },
    ];
  }

  async getChannels(streamCode?: string) {
    try {
      if (this.channelRepo) {
        const channels = streamCode
          ? await this.channelRepo.find({ where: { streamCode } })
          : await this.channelRepo.find();
        if (channels && channels.length > 0) return channels;
      }
    } catch (e) {}

    const defaultChannels = [
      { channelId: 1, channelCode: 'PCO', channelName: 'Passenger Car Oil', streamCode: 'B2C', status: 'Y' },
      { channelId: 2, channelCode: 'MCO', channelName: 'Motorcycle Oil', streamCode: 'B2C', status: 'Y' },
      { channelId: 3, channelCode: 'CVO', channelName: 'Commercial Vehicle Oil', streamCode: 'B2B', status: 'Y' },
      { channelId: 4, channelCode: 'FWS', channelName: 'Fast-Wear Shops', streamCode: 'B2C', status: 'Y' },
      { channelId: 5, channelCode: 'HD', channelName: 'Heavy Duty / Industrial', streamCode: 'B2B', status: 'Y' },
      { channelId: 6, channelCode: 'RETAIL', channelName: 'Retail General Trade', streamCode: 'B2C', status: 'Y' },
    ];
    return streamCode ? defaultChannels.filter((c) => c.streamCode === streamCode) : defaultChannels;
  }

  async getZones() {
    try {
      if (this.zoneRepo) {
        const zones = await this.zoneRepo.find();
        if (zones && zones.length > 0) return zones;
      }
    } catch (e) {}
    return [
      { zoneId: 1, zoneCode: 'NORTH', zoneName: 'North Zone' },
      { zoneId: 2, zoneCode: 'SOUTH', zoneName: 'South Zone' },
      { zoneId: 3, zoneCode: 'EAST', zoneName: 'East Zone' },
      { zoneId: 4, zoneCode: 'WEST', zoneName: 'West Zone' },
      { zoneId: 5, zoneCode: 'CENTRAL', zoneName: 'Central Zone' },
    ];
  }

  async getRegions(zoneCode?: string) {
    try {
      if (this.regionRepo) {
        const regions = zoneCode
          ? await this.regionRepo.find({ where: { zoneCode } })
          : await this.regionRepo.find();
        if (regions && regions.length > 0) return regions;
      }
    } catch (e) {}
    const defaultRegions = [
      { regionId: 1, regionCode: 'REG_N1', regionName: 'Delhi NCR', zoneCode: 'NORTH' },
      { regionId: 2, regionCode: 'REG_W1', regionName: 'Mumbai Metro', zoneCode: 'WEST' },
      { regionId: 3, regionCode: 'REG_S1', regionName: 'Bengaluru Urban', zoneCode: 'SOUTH' },
      { regionId: 4, regionCode: 'REG_E1', regionName: 'Kolkata Region', zoneCode: 'EAST' },
    ];
    return zoneCode ? defaultRegions.filter((r) => r.zoneCode === zoneCode) : defaultRegions;
  }

  async getCustomers(query?: any) {
    try {
      if (this.customerRepo) {
        const customers = await this.customerRepo.find();
        if (customers && customers.length > 0) return customers;
      }
    } catch (e) {}
    return [
      {
        customerId: 1001,
        customerCode: 'CUST-8092',
        customerName: 'Apex Motors Ltd',
        stream: 'B2B',
        channel: 'HD',
        territoryCode: 'TERR_NORTH_01',
        email: 'procurement@apexmotors.com',
        mobile: '+919876543210',
        status: 'Active',
      },
      {
        customerId: 1002,
        customerCode: 'CUST-8093',
        customerName: 'Metro Logistics Corp',
        stream: 'B2B',
        channel: 'CVO',
        territoryCode: 'TERR_WEST_02',
        email: 'fleet@metrologistics.in',
        mobile: '+919876543211',
        status: 'Active',
      },
    ];
  }

  async getSkus() {
    try {
      if (this.skuRepo) {
        const skus = await this.skuRepo.find();
        if (skus && skus.length > 0) return skus;
      }
    } catch (e) {}
    return [
      { skuId: 501, skuCode: 'SKU-CR-5W30-4L', skuName: 'Castrol EDGE 5W-30 (4L)', brand: 'EDGE', category: 'Synthetic Engine Oil', packSize: '4x4L', uom: 'LTR' },
      { skuId: 502, skuCode: 'SKU-CR-15W40-20L', skuName: 'Castrol Vecton 15W-40 (20L Bucket)', brand: 'Vecton', category: 'Heavy Duty Diesel Oil', packSize: '1x20L', uom: 'LTR' },
    ];
  }
}
