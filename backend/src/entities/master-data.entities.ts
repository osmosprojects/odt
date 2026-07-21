import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('odt_streams')
export class Stream {
  @PrimaryGeneratedColumn({ name: 'stream_id' })
  streamId: number;

  @Column({ name: 'stream_code', length: 20, unique: true })
  streamCode: string;

  @Column({ name: 'stream_name', length: 100 })
  streamName: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}

@Entity('odt_channels')
export class Channel {
  @PrimaryGeneratedColumn({ name: 'channel_id' })
  channelId: number;

  @Column({ name: 'channel_code', length: 25, unique: true })
  channelCode: string;

  @Column({ name: 'channel_name', length: 100 })
  channelName: string;

  @Column({ name: 'stream_code', length: 20, nullable: true })
  streamCode: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}

@Entity('odt_zones')
export class Zone {
  @PrimaryGeneratedColumn({ name: 'zone_id' })
  zoneId: number;

  @Column({ name: 'zone_code', length: 25, unique: true })
  zoneCode: string;

  @Column({ name: 'zone_name', length: 100 })
  zoneName: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}

@Entity('odt_regions')
export class Region {
  @PrimaryGeneratedColumn({ name: 'region_id' })
  regionId: number;

  @Column({ name: 'region_code', length: 20, unique: true })
  regionCode: string;

  @Column({ name: 'region_name', length: 100 })
  regionName: string;

  @Column({ name: 'zone_code', length: 25, nullable: true })
  zoneCode: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}

@Entity('odt_territories')
export class Territory {
  @PrimaryGeneratedColumn({ name: 'territory_id' })
  territoryId: number;

  @Column({ name: 'territory_code', length: 25, unique: true })
  territoryCode: string;

  @Column({ name: 'territory_name', length: 100 })
  territoryName: string;

  @Column({ name: 'region_code', length: 20, nullable: true })
  regionCode: string;

  @Column({ name: 'zone_code', length: 25, nullable: true })
  zoneCode: string;

  @Column({ name: 'stream_code', length: 20, nullable: true })
  streamCode: string;

  @Column({ name: 'channel_code', length: 25, nullable: true })
  channelCode: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}

@Entity('odt_sku_master')
export class SkuMaster {
  @PrimaryGeneratedColumn({ name: 'sku_id' })
  skuId: number;

  @Column({ name: 'sku_code', length: 50, unique: true })
  skuCode: string;

  @Column({ name: 'sku_name', length: 200 })
  skuName: string;

  @Column({ name: 'brand', length: 100, nullable: true })
  brand: string;

  @Column({ name: 'category', length: 100, nullable: true })
  category: string;

  @Column({ name: 'pack_size', length: 50, nullable: true })
  packSize: string;

  @Column({ name: 'uom', length: 20, nullable: true })
  uom: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}

@Entity('odt_customer_master')
export class CustomerMaster {
  @PrimaryGeneratedColumn({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'customer_code', length: 50, unique: true })
  customerCode: string;

  @Column({ name: 'customer_name', length: 200 })
  customerName: string;

  @Column({ name: 'stream', length: 50, nullable: true })
  stream: string;

  @Column({ name: 'channel', length: 50, nullable: true })
  channel: string;

  @Column({ name: 'territory_code', length: 25, nullable: true })
  territoryCode: string;

  @Column({ name: 'zone_code', length: 25, nullable: true })
  zoneCode: string;

  @Column({ name: 'region_code', length: 20, nullable: true })
  regionCode: string;

  @Column({ name: 'email', length: 100, nullable: true })
  email: string;

  @Column({ name: 'mobile', length: 20, nullable: true })
  mobile: string;

  @Column({ name: 'status', type: 'enum', enum: ['Y', 'N'], default: 'Y' })
  status: string;
}
