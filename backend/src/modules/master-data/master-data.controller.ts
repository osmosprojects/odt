import { Controller, Get, Query } from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Master Data')
@Controller('api/master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @ApiOperation({ summary: 'Get Streams (B2B/B2C)' })
  @Get('streams')
  getStreams() {
    return this.masterDataService.getStreams();
  }

  @ApiOperation({ summary: 'Get Channels (PCO, MCO, CVO, FWS, HD, RETAIL)' })
  @Get('channels')
  getChannels(@Query('streamCode') streamCode?: string) {
    return this.masterDataService.getChannels(streamCode);
  }

  @ApiOperation({ summary: 'Get Zones' })
  @Get('zones')
  getZones() {
    return this.masterDataService.getZones();
  }

  @ApiOperation({ summary: 'Get Regions' })
  @Get('regions')
  getRegions(@Query('zoneCode') zoneCode?: string) {
    return this.masterDataService.getRegions(zoneCode);
  }

  @ApiOperation({ summary: 'Get Customer Master Records' })
  @Get('customers')
  getCustomers(@Query() query: any) {
    return this.masterDataService.getCustomers(query);
  }

  @ApiOperation({ summary: 'Get SKU Master Records' })
  @Get('skus')
  getSkus() {
    return this.masterDataService.getSkus();
  }
}
