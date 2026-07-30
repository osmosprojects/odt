import { Controller, Get, Post, Param, Query, Body, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferPageOptionsDto } from './dtos/offer-page-options.dto';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';
import { ArchiveService } from '../../common/services/archive.service';
import { Res } from '@nestjs/common';
import type { Response } from 'express';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../../common/services/file.service';
import { Public } from '../../common/decorators/public.decrator';

import { OfferLetterService } from './offer-letter.service';

@Controller('offers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OfferController {
  constructor(
    private offerService: OfferService,
    private archiveService:ArchiveService,
    private fileService:FileService,
    private offerLetterService: OfferLetterService
  ) {}

  @Public()
  @Get(':id/generate-letter')
  async generateLetter(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const pdfBuffer = await this.offerLetterService.generateOfferLetter(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=offer-letter-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Public()
  @Post(':id/validate')
  async validateOffer(@Param('id', ParseIntPipe) id: number) {
    return this.offerService.validateForSubmission(id);
  }

  @Public()
  @Get('previous-wbc')
  getPreviousWbcOffers(@Query('executiveCode') executiveCode?: string) {
    return this.offerService.getPreviousWbcOffers(executiveCode);
  }

  @Public()
  @Get('pipeline')
  getPipelineOffers() {
    return this.offerService.getPipelineOffers();
  }

  @Public()
  @Get('previous-wbc/:offerId')
  getPreviousWbcOfferById(@Param('offerId', ParseIntPipe) offerId: number) {
    return this.offerService.getPreviousWbcOfferById(offerId);
  }

  @Public()
  @Get()
  findAll(@Query() pageOptions: OfferPageOptionsDto) {
    return this.offerService.findAll(pageOptions);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offerService.findOne(id);
  }

  @Get('encrypted/:hash')
  @Roles(Role.WS, Role.ASM, Role.KAS, Role.SAM, Role.ADMIN, Role.WSK)
  findOneEncrypted(@Param('hash') hash: string) {
    return this.offerService.findOneByEncryptedId(hash);
  }

  @Public()
  @Post()
  create(@Body() dto: CreateOfferDto) {
    return this.offerService.create(dto);
  }

  @Public()
  @Post('step1')
  saveStep1(@Body() dto: any) {
    return this.offerService.saveStep1(dto);
  }

  @Public()
  @Post('step2')
  saveStep2(@Body() dto: any) {
    return this.offerService.saveStep2(dto);
  }

  @Public()
  @Post('step3')
  saveStep3(@Body() dto: any) {
    return this.offerService.saveStep3(dto);
  }

  @Public()
  @Post('draft')
  saveDraft(@Body() dto: any) {
    return this.offerService.saveDraft(dto);
  }

  @Public()
  @Post('submit')
  submitOffer(@Body() dto: any) {
    return this.offerService.submitOffer(dto);
  }

  @Public()
  @Post('edit')
  editOffer(@Body() dto: any) {
    return this.offerService.editOffer(dto);
  }

  @Public()
  @Post('extend')
  extendOffer(@Body() dto: any) {
    return this.offerService.extendOffer(dto);
  }

  /** POST /offers/create-full — Complete offer creation journey */
  @Public()
  @Post('create-full')
  createFullOffer(@Body() dto: any) {
    return this.offerService.createFullOffer(dto);
  }

  @Public()
  @Get(':id/activity-logs')
  getActivityLogs(@Param('id', ParseIntPipe) id: number) {
    return this.offerService.getActivityLogs(id);
  }

  @Get('export/excel')
  @Roles(Role.WS, Role.ASM, Role.KAS, Role.SAM, Role.ADMIN, Role.WSK)
  async exportExcel(@Res() res: Response) {
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=offers-report.xlsx',
    });

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const worksheet = workbook.addWorksheet('Offers');

    worksheet.columns = [
      { header: 'Offer ID', key: 'offer_id', width: 15 },
      { header: 'Executive Code', key: 'executive_code', width: 20 },
      { header: 'Status', key: 'account_status', width: 15 },
      { header: 'Amount', key: 'money_offered', width: 20 },
    ];

    const offers = await this.offerService.findAllForExport();
    offers.forEach((offer) => {
      worksheet.addRow(offer as any).commit();
    });

    worksheet.commit();
    await workbook.commit();
  }

  @Get('export/pdf')
  @Roles(Role.WS, Role.ASM, Role.KAS, Role.SAM, Role.ADMIN, Role.WSK)
  async exportPdf(@Res() res: Response) {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=offer-summary.pdf',
    });

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    const startX = doc.page.margins.left;
    let currentY = doc.page.margins.top;

    doc.fontSize(16).font('Helvetica-Bold').text('Offer Summary Report', startX, currentY, {
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
      align: 'center',
    });
    currentY += 30;

    const columns = [
      { header: 'Offer ID', key: 'offer_id', width: 100 },
      { header: 'Executive Code', key: 'executive_code', width: 150 },
      { header: 'Status', key: 'account_status', width: 100 },
      { header: 'Amount', key: 'money_offered', width: 150 },
    ];

    const colPositions: number[] = [];
    let runningX = startX;
    columns.forEach((col) => {
      colPositions.push(runningX);
      runningX += col.width;
    });

    doc.fontSize(10).font('Helvetica-Bold');
    columns.forEach((col, i) => {
      doc.text(col.header, colPositions[i], currentY, { width: col.width, align: 'left' });
    });
    currentY += 20;

    const offers = await this.offerService.findAllForExport();
    doc.font('Helvetica');
    offers.forEach((offer) => {
      columns.forEach((col, i) => {
        const value = (offer as any)[col.key] ?? '';
        doc.text(String(value), colPositions[i], currentY, { width: col.width, align: 'left' });
      });
      currentY += 20;
    });

    doc.end();
  }
  @Get('export/zip')
  @Roles(Role.WS, Role.ASM, Role.KAS, Role.SAM, Role.ADMIN, Role.WSK)
  exportZip(@Res() res: Response) {
    this.archiveService.streamZip(res, 'offer-export.zip', [
      { name: 'note1.txt', content: 'This is offer file 1' },
      { name: 'note2.txt', content: 'This is offer file 2' },
    ]);
  }
  @Post('upload-test')
  @Roles(Role.WS, Role.ASM, Role.KAS, Role.SAM, Role.ADMIN, Role.WSK)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any) {  
    return this.fileService.saveUploadedFile(file);
  }
}