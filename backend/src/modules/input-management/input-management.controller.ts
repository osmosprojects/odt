import { Controller, Get, Post, Body } from '@nestjs/common';
import { InputManagementService } from './input-management.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Input Management (Master Uploads)')
@Controller('api/input-management')
export class InputManagementController {
  constructor(private readonly inputManagementService: InputManagementService) {}

  @ApiOperation({ summary: 'Get all master data upload records' })
  @Get()
  getMasterRecords() {
    return this.inputManagementService.getMasterRecords();
  }

  @ApiOperation({ summary: 'Upload and update master file (Customer/SKU/Distributor)' })
  @Post('upload')
  uploadMasterFile(@Body() body: { masterType: string; uploadedBy?: string; filename: string }) {
    return this.inputManagementService.uploadMasterFile(body.masterType, body.uploadedBy, body.filename);
  }
}
