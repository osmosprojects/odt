import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OffersService, CreateOfferDto } from './offers.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Offer Management & Creation')
@Controller('api/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiOperation({ summary: 'List all offers with filters (Status, Stream, Channel)' })
  @Get()
  findAll(@Query() query: any) {
    return this.offersService.findAll(query);
  }

  @ApiOperation({ summary: 'Get Offer Approval Pipeline Stage 2 Summary (offer-pipeline-s2)' })
  @Get('pipeline-s2')
  getPipelineS2() {
    return this.offersService.getPipelineS2();
  }

  @ApiOperation({ summary: 'Get offer by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Create new Offer Draft (Step 1-3)' })
  @Post()
  create(@Body() dto: CreateOfferDto) {
    return this.offersService.create(dto);
  }

  @ApiOperation({ summary: 'Submit Offer for DOFA / Workflow Approval' })
  @Post(':id/submit')
  submitForApproval(@Param('id') id: string) {
    return this.offersService.submitForApproval(Number(id));
  }

  @ApiOperation({ summary: 'Approve specific level in workflow (rtm, l1, l2, l3, cm)' })
  @Post(':id/approve')
  approveOfferLevel(
    @Param('id') id: string,
    @Body() body: { level: string; comments?: string }
  ) {
    return this.offersService.approveOfferLevel(Number(id), body.level, body.comments);
  }

  @ApiOperation({ summary: 'Reject offer' })
  @Post(':id/reject')
  rejectOffer(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.offersService.rejectOffer(Number(id), body.reason);
  }

  @ApiOperation({ summary: 'Cancel / Recall offer' })
  @Post(':id/cancel')
  cancelOffer(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.offersService.cancelOffer(Number(id), body.reason);
  }

  @ApiOperation({ summary: 'Extend offer validity period' })
  @Post(':id/extend')
  extendOffer(
    @Param('id') id: string,
    @Body() body: { extensionMonths: number; newEndDate: string; remarks?: string }
  ) {
    return this.offersService.extendOffer(Number(id), body);
  }

  @ApiOperation({ summary: 'Submit Offer Closure Settlement' })
  @Post(':id/closure')
  submitClosure(@Param('id') id: string, @Body() closureData: any) {
    return this.offersService.submitClosure(Number(id), closureData);
  }
}
