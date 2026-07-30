import { Injectable, NotFoundException } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { OfferService } from './offer.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class OfferLetterService {
  constructor(
    private offerRepo: OfferRepository,
    private offerService: OfferService,
  ) {}

  async generateOfferLetter(offerId: number): Promise<Buffer> {
    const offer = await this.offerService.findOne(offerId);
    if (!offer) throw new NotFoundException('Offer not found');

    // Parse SKU data from legacy format
    let skuData: any = {};
    if (offer.sku_text) {
      try {
        skuData = this.offerService.parseLegacySkuText(offer.sku_text);
      } catch { skuData = {}; }
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('CASTROL INDIA LIMITED', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).text('OFFER LETTER', { align: 'center' });
      doc.moveDown(1);

      // Offer Details
      doc.fontSize(10).font('Helvetica');
      doc.text(`Offer Code: ${offer.offer_code || 'N/A'}`);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`);
      doc.text(`Status: ${offer.account_status || 'Draft'}`);
      doc.moveDown(1);

      // Customer Details section
      doc.fontSize(12).font('Helvetica-Bold').text('Customer Details');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica');
      
      const step1 = skuData || {};
      const customerName = step1.customers?.[0]?.name || step1.customerName || 'N/A';
      const customerCode = step1.customers?.[0]?.customerNumber || step1.customerCode || 'N/A';
      const segment = step1.customers?.[0]?.segment || step1.segment || 'N/A';
      const state = step1.customers?.[0]?.state || step1.state || 'N/A';
      const address = step1.customers?.[0]?.address || step1.address || 'N/A';
      
      doc.text(`Customer Name: ${customerName}`);
      doc.text(`Customer Code: ${customerCode}`);
      doc.text(`Segment: ${segment}`);
      doc.text(`State: ${state}`);
      doc.text(`Address: ${address}`);
      doc.moveDown(1);

      // Offer Terms
      doc.fontSize(12).font('Helvetica-Bold').text('Offer Terms');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Offer Stream: ${step1.offerStream || 'N/A'}`);
      doc.text(`Period: ${step1.periodFrom || 'N/A'} to ${step1.periodTo || 'N/A'}`);
      doc.text(`Investment Amount: ₹${this.offerService.formatAmount(offer.money_offered || 0)}`);
      doc.moveDown(1);

      // Investment Details
      const step2 = skuData.step2 || {};
      if (step2.whyInvest) {
        doc.fontSize(12).font('Helvetica-Bold').text('Investment Rationale');
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Why Invest: ${step2.whyInvest}`);
        doc.text(`Risks: ${step2.risksToVolume || 'N/A'}`);
        doc.text(`Mitigation: ${step2.mitigationToRisk || 'N/A'}`);
        doc.moveDown(1);
      }

      // SKU Details
      const step3 = skuData.step3 || {};
      if (step3.skus && step3.skus.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').text('SKU Details');
        doc.moveDown(0.3);
        doc.fontSize(9).font('Helvetica');
        
        step3.skus.forEach((sku: any, index: number) => {
          doc.text(`${index + 1}. ${sku.skuName || sku.name || 'N/A'} (${sku.skuCode || sku.code || 'N/A'})`);
          doc.text(`   Volume: ${sku.volumePMCommitment || sku.contractVolume || 0} L | Price: ₹${sku.listPrice || 0}`);
        });
        doc.moveDown(1);
      }

      // Terms and Conditions
      doc.fontSize(12).font('Helvetica-Bold').text('Terms and Conditions');
      doc.moveDown(0.3);
      doc.fontSize(9).font('Helvetica');
      doc.text('1. This offer is subject to the terms and conditions of the master agreement.');
      doc.text('2. Volumes mentioned are commitment volumes and shall be reviewed quarterly.');
      doc.text('3. Castrol reserves the right to modify or withdraw this offer.');
      doc.text('4. All disputes shall be subject to the jurisdiction of Mumbai courts.');
      doc.moveDown(2);

      // Signatures
      doc.fontSize(10).font('Helvetica');
      doc.text('Authorized Signatory', 50, doc.y);
      doc.text('Customer Acceptance', 350, doc.y - 14);

      doc.end();
    });
  }
}
