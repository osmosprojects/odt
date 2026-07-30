import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { OfferValidationService } from './offer-validation.service';
import { OfferPageOptionsDto } from './dtos/offer-page-options.dto';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { PageDto } from '../../common/dto/page.dto';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { WbcNumberService } from './wbc-number.service';
import { decryptOfferId, encryptOfferId } from '../../common/utils/crypto.utils';
import { phpUnserialize, phpSerialize, safePhpUnserialize } from '../../common/utils/legacy-serialization.utils';
import { moneyFormatIndia } from '../../common/utils/money-format.utils';
import { OfferStatus } from '../../enums/offer-status.enum';

import { ActivityLogService } from './activity-log.service';

@Injectable()
export class OfferService {
  constructor(
    private offerRepo: OfferRepository,
    private validation: OfferValidationService,
    private wbcNumberService: WbcNumberService,
    private activityLogService: ActivityLogService,
  ) {}

  async getPreviousOffer(customerCode: string): Promise<any> {
    const raw = await this.offerRepo.findPreviousOffer(customerCode);
    if (!raw) {
      return {
        hasPreviousOffer: false,
        previousOffer: null,
      };
    }
    const formatDate = (d: any) => (d ? new Date(d).toISOString().split('T')[0] : null);
    return {
      hasPreviousOffer: true,
      previousOffer: {
        offer_id: raw.offer_id,
        offer_code: raw.offer_code || '',
        offer_status: raw.offer_status || '',
        start_date: formatDate(raw.start_date),
        end_date: formatDate(raw.end_date),
        contract_tenure: raw.contract_tenure || null,
        tot_volume_commitment: String(raw.tot_volume_commitment || '0'),
        total_gross_margin: String(raw.total_gross_margin || '0'),
        gmpl_dofa: raw.gmpl_dofa || '0',
        remark: raw.remark || '',
      },
    };
  }

  async findAll(pageOptions: OfferPageOptionsDto): Promise<PageDto<OfferEntity>> {
    const [data, total] = await this.offerRepo.findFiltered(pageOptions);
    return new PageDto(data, total, pageOptions);
  }

  async findOne(id: number): Promise<any> {
    // 1. Try finding detailed offer record from odt_offer_details + wow_wo_cust_details
    const detailed = await this.offerRepo.findPreviousWbcOfferDetailsById(id);
    let offer: any = null;
    try {
      offer = await this.offerRepo.findOneById('offer_id', id);
    } catch {
      offer = null;
    }

    if (!detailed && !offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }

    let parsedSkuText: any = null;
    let parsedCustomerInput: any = null;
    let parsedCurrentProposed: any = null;
    let skuRows: any[] = [];

    const rawSkuText = detailed?.sku_text || offer?.sku_text;
    if (rawSkuText) {
      try {
        parsedSkuText = safePhpUnserialize(rawSkuText) || {};
        // Extract SKU rows if legacy indexed format (sku_name0, sku_code0...)
        const counter = parseInt(parsedSkuText.sku_counter || '0', 10);
        if (counter > 0) {
          for (let i = 0; i < counter; i++) {
            if (parsedSkuText[`sku_code${i}`] || parsedSkuText[`sku_name${i}`]) {
              skuRows.push({
                skuCode: parsedSkuText[`sku_code${i}`] || '',
                skuName: parsedSkuText[`sku_name${i}`] || '',
                baseGross: parseFloat(parsedSkuText[`sku_base_gross${i}`] || '0'),
                baseCogs: parseFloat(parsedSkuText[`sku_base_cogs${i}`] || '0'),
                volume: parseFloat(parsedSkuText[`sku_volume${i}`] || '0'),
                rebatePerLtr: parseFloat(parsedSkuText[`sku_reb_per_ltr${i}`] || '0'),
                gmLevel: parsedSkuText[`sku_gm_level${i}`] || 'N',
              });
            }
          }
        } else if (Array.isArray(parsedSkuText.skus)) {
          skuRows = parsedSkuText.skus;
        }
      } catch {
        parsedSkuText = null;
      }
    }

    if (detailed?.customer_level_input_text) {
      parsedCustomerInput = safePhpUnserialize(detailed.customer_level_input_text);
    }
    if (detailed?.current_proposed_text) {
      parsedCurrentProposed = safePhpUnserialize(detailed.current_proposed_text);
    }

    const formatDate = (d: any) => (d ? new Date(d).toISOString().split('T')[0] : '');

    return {
      offer_id: id,
      offer_code: detailed?.offer_code || offer?.offer_code || `WBC-${id}`,
      account_status: detailed?.offer_status || offer?.account_status || 'Draft',
      created_date: offer?.created_date || new Date(),
      expiration_date: detailed?.end_date || offer?.expiration_date || new Date(),
      money_offered: parseFloat(detailed?.total_cust_lvl_input || offer?.money_offered || '0'),

      // Hydrated legacy fields for Offer Creation Demo & Pipeline Edit
      offerStream: detailed?.stream || 'WBC',
      offerType: detailed?.offer_type || 'Standard',
      startDate: formatDate(detailed?.start_date),
      endDate: formatDate(detailed?.end_date),
      effectiveEndDate: formatDate(detailed?.effective_end_date),
      tenure: detailed?.contract_tenure || parsedCurrentProposed?.months_proposed || '12',

      totalVolumeCommitment: parseFloat(detailed?.tot_volume_commitment || parsedCurrentProposed?.volume_kl_proposed || '0'),
      totalGrossMargin: parseFloat(detailed?.total_gross_margin || '0'),
      gmplDofa: detailed?.gmpl_dofa || parsedCurrentProposed?.gmpl_proposed || '0',
      finalApprover: detailed?.final_approver || 'Regional Sales Manager',
      remark: detailed?.remark || '',

      selectedCustomer: detailed ? {
        id: String(detailed.customer_distributor_jde_ab_no_text || id),
        name: detailed.customerName || '',
        businessStream: detailed.stream || 'WBC',
        customerCode: detailed.customer_distributor_jde_ab_no_text || '',
        customerType: detailed.customerType || 'Direct',
        distributorName: detailed.distributorName || '',
        distributorCode: '',
        jdeCode: detailed.customer_distributor_jde_ab_no_text || '',
        state: detailed.state || '',
        segment: detailed.segment || '',
        subSegment: '',
        salesRep: detailed.executive_code || '',
        salesArea: detailed.state || '',
        address: detailed.customers_address_text || '',
        gstNumber: detailed.gstNo || '',
      } : null,

      selectedSkus: skuRows,
      customerLevelInput: parsedCustomerInput,
      currentProposed: parsedCurrentProposed,
      parsedSkuText,
    };
  }

  async findOneByEncryptedId(encryptedId: string): Promise<OfferEntity> {
    const numericId = decryptOfferId(encryptedId);
    return this.findOne(numericId);
  }

  getEncryptedOfferId(id: number): string {
    return encryptOfferId(id);
  }

  parseLegacySkuText(serializedText: string): any {
    return phpUnserialize(serializedText);
  }

  serializeToLegacy(data: any): string {
    return phpSerialize(data);
  }

  formatAmount(amount: number): string {
    return moneyFormatIndia(amount);
  }

  async create(dto: CreateOfferDto): Promise<OfferEntity> {
    if (!dto) {
      throw new BadRequestException('Request body is required');
    }

    if (!dto.expiration_date) {
      throw new BadRequestException('expiration_date is required');
    }

    this.validation.validateDates(dto.expiration_date);
    await this.validation.checkDuplicate(dto);

    const offer = await this.offerRepo.create(dto as any);
    offer.offer_code = this.wbcNumberService.formatWbcNumber(offer.offer_id);
    const saved = await this.offerRepo.save(offer);
    await this.activityLogService.logAction('CREATE', saved.offer_id, saved.offer_code, 'System User', 'Sales Executive', { dto });
    return saved;
  }

  // ── Multi-step Offer Creation Core Business Logic ─────────────────────────

  async saveStep1(dto: any): Promise<{ offerId: number; offerCode: string; step: number }> {
    if (!dto.offerStream) {
      throw new BadRequestException('offerStream is required');
    }

    let offer: OfferEntity;
    if (dto.offerId) {
      offer = await this.findOne(dto.offerId);
    } else {
      const expirationDate = dto.periodTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      offer = await this.offerRepo.create({
        executive_code: 101,
        expiration_date: expirationDate,
        money_offered: 0,
        account_status: OfferStatus.D,
      });
      offer.offer_code = this.wbcNumberService.formatWbcNumber(offer.offer_id);
    }

    offer.sku_text = this.serializeToLegacy(dto);
    await this.offerRepo.save(offer);
    await this.activityLogService.logAction('SAVE_STEP1', offer.offer_id, offer.offer_code, 'System User', 'Sales Executive', { offerStream: dto.offerStream });

    return {
      offerId: offer.offer_id,
      offerCode: offer.offer_code || `WBC-${offer.offer_id}`,
      step: 1,
    };
  }

  async saveStep2(dto: any): Promise<{ offerId: number; step: number }> {
    const offer = await this.findOne(dto.offerId);
    if (!dto.whyInvest || !dto.risksToVolume || !dto.mitigationToRisk) {
      throw new BadRequestException('whyInvest, risksToVolume, and mitigationToRisk are required');
    }

    const existingData = offer.sku_text ? this.parseLegacySkuText(offer.sku_text) : {};
    const mergedData = { ...existingData, step2: dto };
    offer.sku_text = this.serializeToLegacy(mergedData);
    if (dto.totalInvestment) {
      offer.money_offered = dto.totalInvestment;
    }
    await this.offerRepo.save(offer);
    await this.activityLogService.logAction('SAVE_STEP2', offer.offer_id, offer.offer_code, 'System User', 'Sales Executive', { totalInvestment: dto.totalInvestment });

    return { offerId: offer.offer_id, step: 2 };
  }

  async saveStep3(dto: any): Promise<{ offerId: number; step: number; finalDofa: string }> {
    const offer = await this.findOne(dto.offerId);
    const existingData = offer.sku_text ? this.parseLegacySkuText(offer.sku_text) : {};
    const mergedData = { ...existingData, step3: dto };
    offer.sku_text = this.serializeToLegacy(mergedData);
    await this.offerRepo.save(offer);
    await this.activityLogService.logAction('SAVE_STEP3', offer.offer_id, offer.offer_code, 'System User', 'Sales Executive', { finalDofa: dto.finalDofa });

    return {
      offerId: offer.offer_id,
      step: 3,
      finalDofa: dto.finalDofa || 'Regional Sales Manager (RWM)',
    };
  }

  async saveDraft(dto: any): Promise<{ offerId: number; message: string }> {
    let offerId = dto.offerId;
    if (!offerId) {
      const newOffer = await this.offerRepo.create({
        executive_code: 101,
        expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        money_offered: 0,
        account_status: OfferStatus.D,
      });
      newOffer.offer_code = this.wbcNumberService.formatWbcNumber(newOffer.offer_id);
      await this.offerRepo.save(newOffer);
      offerId = newOffer.offer_id;
    }

    const offer = await this.findOne(offerId);
    const existingData = offer.sku_text ? this.parseLegacySkuText(offer.sku_text) : {};
    const mergedData = { ...existingData, [`draftStep${dto.step}`]: dto.payload };
    offer.sku_text = this.serializeToLegacy(mergedData);
    await this.offerRepo.save(offer);
    await this.activityLogService.logAction('SAVE_DRAFT', offerId, offer.offer_code, 'System User', 'Sales Executive', { step: dto.step });

    return { offerId, message: 'Draft saved successfully' };
  }

  async submitOffer(dto: any): Promise<{ offerId: number; status: string; message: string }> {
    const offer = await this.findOne(dto.offerId);
    offer.account_status = OfferStatus.P; // Move from Draft (D) to Pending (P)
    await this.offerRepo.save(offer);
    await this.activityLogService.logAction('SUBMIT', offer.offer_id, offer.offer_code, 'System User', 'Sales Executive', { submittedAt: new Date().toISOString() });

    return {
      offerId: offer.offer_id,
      status: OfferStatus.P,
      message: 'Offer submitted for approval successfully',
    };
  }

  /** Edit existing offer, preserving legacy payload structure and recording audit log */
  async editOffer(dto: any): Promise<{ offerId: number; offerCode: string; message: string }> {
    const offerId = dto.offerId;
    if (!offerId) throw new BadRequestException('offerId is required for editOffer');
    
    const offer = await this.findOne(offerId);
    const existingData = offer.sku_text ? this.parseLegacySkuText(offer.sku_text) : {};
    const updatedData = { ...existingData, editHistory: [...(existingData.editHistory || []), { editedAt: new Date().toISOString(), payload: dto }] };
    
    offer.sku_text = this.serializeToLegacy(updatedData);
    if (dto.totalInvestment) offer.money_offered = dto.totalInvestment;
    
    await this.offerRepo.save(offer);
    await this.activityLogService.logAction('EDIT', offer.offer_id, offer.offer_code, 'System User', 'Sales Executive', { dto });

    return {
      offerId: offer.offer_id,
      offerCode: offer.offer_code || `WBC-${offer.offer_id}`,
      message: 'Offer edited successfully',
    };
  }

  /** Extend an existing offer contract duration */
  async extendOffer(dto: any): Promise<{ offerId: number; extendedCode: string; message: string }> {
    const offerId = dto.offerId;
    const additionalMonths = parseInt(dto.additionalMonths || '6', 10);
    if (!offerId) throw new BadRequestException('offerId is required for extendOffer');

    const parentOffer = await this.findOne(offerId);
    const existingData = parentOffer.sku_text ? this.parseLegacySkuText(parentOffer.sku_text) : {};

    // Calculate new expiration date
    const currentExp = new Date(parentOffer.expiration_date || Date.now());
    currentExp.setMonth(currentExp.getMonth() + additionalMonths);

    parentOffer.expiration_date = currentExp;
    const updatedData = { ...existingData, extended: true, additionalMonths, extendedAt: new Date().toISOString() };
    parentOffer.sku_text = this.serializeToLegacy(updatedData);

    await this.offerRepo.save(parentOffer);
    await this.activityLogService.logAction('EXTEND', parentOffer.offer_id, parentOffer.offer_code, 'System User', 'Sales Executive', { additionalMonths, newExpiration: currentExp.toISOString() });

    return {
      offerId: parentOffer.offer_id,
      extendedCode: parentOffer.offer_code || `WBC-${parentOffer.offer_id}`,
      message: `Offer extended by ${additionalMonths} months successfully`,
    };
  }

  /**
   * POST /offers/create-full
   * Full offer creation: saves to odt_offer_details + wow_wo_cust_details in one transaction.
   * This is the main entry point for the Offer Creation journey.
   */
  async createFullOffer(dto: any): Promise<{ offerId: number; offerCode: string; message: string; status: string }> {
    if (!dto.selectedCustomer && !dto.customerCode) {
      throw new BadRequestException('Customer selection is required');
    }

    const customer = dto.selectedCustomer || {};
    const customerCode = customer.customerCode || customer.jdeCode || dto.customerCode || '';
    const executiveCode = customer.executiveCode || customer.salesRep || '';

    // Build serialized customer-level input text (legacy PHP format)
    const customerLevelInput: Record<string, any> = {
      target_incentive: String(dto.targetIncentive || 0),
      additional_input: String(dto.additionalInput || 0),
      sign_on_bonus: String(dto.signOnBonus || 0),
      others: String(dto.others || 0),
      total_investment: String(dto.totalInvestment || 0),
      rs_ltr_investment: String(dto.rsLtrInvestment || 0),
      sku_level_rebate: String(dto.skuLevelRebate || 0),
      total_foc_value: String(dto.totalFocValue || 0),
      prev_gmpl: String(dto.prevGmpl || 0),
      remark: dto.remark || '',
      why_invest: dto.whyInvest || '',
      risks_to_volume: dto.risksToVolume || '',
      mitigation_to_risk: dto.mitigationToRisk || '',
      competitor_details: dto.competitorDetails || '',
      associated_with_castrol: dto.associatedWithCastrol || '',
      significance_with_castrol: dto.significanceWithCastrol || '',
      up_trading_opportunities: dto.upTradingOpportunities || '',
      group_belongs_to: dto.groupBelongsTo || '',
      other_qualitative_info: dto.otherQualitativeInfo || '',
      months: String(dto.months || dto.investmentTerm || 12),
      periodFrom: dto.periodFrom || dto.startDate || '',
      periodTo: dto.periodTo || dto.endDate || '',
    };

    // Build SKU text (serialized)
    const skuPayload: Record<string, any> = { sku_counter: String((dto.selectedSkus || []).length) };
    (dto.selectedSkus || []).forEach((sku: any, i: number) => {
      skuPayload[`sku_code${i}`] = sku.skuCode || '';
      skuPayload[`sku_name${i}`] = sku.skuName || sku.description || '';
      skuPayload[`sku_volume${i}`] = String(sku.contractVolume || 0);
      skuPayload[`sku_reb_per_ltr${i}`] = String(sku.skuRebate || 0);
      skuPayload[`sku_base_gross${i}`] = String(sku.baseTO || 0);
      skuPayload[`sku_base_cogs${i}`] = String(sku.cogs || 0);
    });

    // Build current-proposed text
    const currentProposed: Record<string, any> = {
      volume_kl_proposed: String(dto.totalVolumeCommitment || dto.prevOfferCommitment || 0),
      months_proposed: String(dto.investmentTerm || dto.months || 12),
      total_investment_proposed: String(dto.totalAdditionalLoan || dto.totalInvestment || 0),
      gmpl_proposed: String(dto.prevGmpl || 0),
    };

    // Build offer payload for odt_offer_details
    const stream = customer.businessStream || dto.offerStream || 'WBC';
    const startDate = dto.startDate || null;
    const endDate = dto.endDate || null;
    const tenure = String(dto.investmentTerm || dto.months || 12);

    // Temporary offer_code placeholder — will be updated after insert
    const tempCode = `DRAFT-${Date.now()}`;

    const offerPayload = {
      stream,
      offer_code: tempCode,
      executive_code: executiveCode || customerCode,
      offer_type: dto.offerCreationType || 'New Offer',
      offer_status: 'D', // Draft
      start_date: startDate,
      end_date: endDate,
      contract_tenure: tenure,
      effective_end_date: endDate,
      tot_volume_commitment: String(dto.totalVolumeCommitment || dto.prevOfferCommitment || 0),
      customer_level_input_text: this.serializeToLegacy(customerLevelInput),
      sku_text: this.serializeToLegacy(skuPayload),
      current_proposed_text: this.serializeToLegacy(currentProposed),
      total_gross_margin: '0',
      gmpl_dofa: String(dto.prevGmpl || 0),
      final_approver: 'Regional Sales Manager',
      remark: dto.remark || dto.whyInvest || '',
      total_cust_lvl_input: String(dto.totalInvestment || dto.targetIncentive || 0),
    };

    // Build customer details payload for wow_wo_cust_details
    const custPayload = {
      customer_name_text: customer.name || '',
      customer_type_text: customer.customerType || 'Direct',
      current_customer_type_text: customer.customerType || 'Direct',
      customer_distributor_jde_ab_no_text: customerCode,
      customer_turfview_no_text: customerCode,
      distributor_name_text: customer.distributorName || '',
      segment_text: customer.segment || '',
      sub_segment_text: customer.subSegment || '',
      cust_state: customer.state || '',
      customers_address_text: customer.address || '',
      bp_sales_rep_text: customer.salesRep || customer.executive || '',
      sales_area_text: customer.salesArea || customer.state || '',
      gst_no_text: customer.gstNumber || '',
      key_account_text: customer.keyAccount || '',
      investment_type_text: dto.investmentType || '',
      investment_rationale_text: dto.investmentRationale || '',
      bp_bank_funded_text: dto.bpBankFunded || '',
      planning_status_text: dto.planningStatus || '',
      sales_remarks_text: dto.whyInvest || '',
    };

    // Save both tables atomically
    const newOfferId = await this.offerRepo.saveFullOffer(offerPayload, custPayload);

    // Generate proper WBC offer code and update the row
    const offerCode = this.wbcNumberService.formatWbcNumber(newOfferId);
    await this.offerRepo.updateOfferCode(newOfferId, offerCode);

    await this.activityLogService.logAction('CREATE_FULL', newOfferId, offerCode, customer.name || 'System', executiveCode || 'Sales Executive', { stream, customerCode, offerType: dto.offerCreationType });

    return {
      offerId: newOfferId,
      offerCode,
      message: 'Offer created successfully and saved to database',
      status: 'D',
    };
  }

  async getActivityLogs(offerId: number): Promise<any[]> {
    return this.activityLogService.getLogsForOffer(offerId);
  }

  /**
   * GET /offers/pipeline
   * Returns formatted pipeline offers for the Pipeline Dashboard
   */
  async getPipelineOffers(): Promise<{ success: boolean; data: any[] }> {
    try {
      const records = await this.offerRepo.getPipelineOffers();
      const formatDate = (d: any) => (d ? new Date(d).toISOString().split('T')[0] : '');

      const data = (records || []).map((r) => {
        let mappedStatus = 'Draft';
        const st = String(r.status || '').trim().toUpperCase();
        if (st === 'P' || st === 'PENDING') mappedStatus = 'Pending Approval';
        else if (st === 'APP' || st === 'A' || st === 'PUBLISHED') mappedStatus = 'Published';
        else if (st === 'CLOSED' || st === 'EXTENDED' || st === 'E') mappedStatus = 'Closed / Closure';
        else if (st === 'DEL' || st === 'CANCEL' || st === 'CAN' || st === 'REJECTED') mappedStatus = 'Cancelled';
        else mappedStatus = 'Draft';

        return {
          id: String(r.id),
          offerCode: r.offerCode || `WBC-${r.id}`,
          customerName: r.customerName || 'Customer Record',
          stream: r.stream || 'WBC',
          offerType: r.offerType || 'Standard',
          volumeCommitment: r.volumeCommitment ? `${parseFloat(r.volumeCommitment).toLocaleString()} KL` : '0 KL',
          grossMargin: r.grossMargin ? `₹ ${parseFloat(r.grossMargin).toLocaleString()}` : 'N/A',
          status: mappedStatus,
          createdDate: formatDate(r.createdDate),
          expiryDate: formatDate(r.expiryDate),
          dofaLevel: r.dofaLevel ? `Level ${r.dofaLevel}` : 'Level 1',
          approver: r.approver || 'Regional Sales Manager',
        };
      });

      return { success: true, data };
    } catch {
      return { success: true, data: [] };
    }
  }

  async findAllForExport(): Promise<OfferEntity[]> {
    return this.offerRepo.findAllForExport();
  }

  async validateForSubmission(offerId: number) {
    return this.validation.validateForSubmission(offerId);
  }

  /**
   * GET /offers/previous-wbc
   * Input: executiveCode
   * Returns active Previous WBC Offers belonging to executiveCode.
   * Format: { success: true, data: [...] }
   */
  async getPreviousWbcOffers(executiveCode?: string): Promise<{ success: boolean; data: any[] }> {
    try {
      const records = await this.offerRepo.findPreviousWbcOffersByExecutive(executiveCode || '');
      const formatDate = (d: any) => (d ? new Date(d).toISOString().split('T')[0] : null);

      const data = (records || []).map((r) => ({
        offerId: r.offerId,
        offerCode: r.offerCode || `WBC-${r.offerId}`,
        customerName: r.customerName || '',
        segment: r.segment || '',
        startDate: formatDate(r.startDate),
        endDate: formatDate(r.endDate),
        effectiveEndDate: formatDate(r.effectiveEndDate),
        closureStatus: r.closureStatus || '',
      }));

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: true,
        data: [],
      };
    }
  }

  /**
   * GET /offers/previous-wbc/:offerId
   * Return complete Previous Performance for selected offerId.
   * Format: { success: true, data: { ... } }
   */
  async getPreviousWbcOfferById(offerId: number): Promise<{ success: boolean; data: any }> {
    try {
      const raw = await this.offerRepo.findPreviousWbcOfferDetailsById(offerId);
      if (!raw) {
        return {
          success: true,
          data: null,
        };
      }

      const formatDate = (d: any) => (d ? new Date(d).toISOString().split('T')[0] : null);

      const customerLevelInputs = safePhpUnserialize(raw.customer_level_input_text) || {};
      const currentProposed = safePhpUnserialize(raw.current_proposed_text) || {};

      const volume = parseFloat(raw.tot_volume_commitment || currentProposed.volume_kl_proposed || currentProposed.volume_kl_current || '0') || 0;
      const months = parseInt(raw.contract_tenure || customerLevelInputs.months || '12', 10) || 12;
      const periodFrom = formatDate(raw.start_date) || customerLevelInputs.periodFrom || '';
      const periodTo = formatDate(raw.end_date) || customerLevelInputs.periodTo || '';

      const arSeolCurrent = parseFloat(currentProposed.AR_SEOL_current || '0') || 0;
      const totalInvestmentCurrent = parseFloat(currentProposed.total_investment_current || '0') || 0;
      const rsLtrInvestmentCurrent = parseFloat(currentProposed.rs_l_investment_current || '0') || 0;
      const gmplCurrent = parseFloat(currentProposed.gmpl_current || '0') || 0;

      const targetIncentive = parseFloat(customerLevelInputs.target_incentive || customerLevelInputs.targetIncentive || '0') || 0;
      const marketing = parseFloat(customerLevelInputs.additional_input || customerLevelInputs.additionalInput || customerLevelInputs.marketing || '0') || 0;
      const others = parseFloat(customerLevelInputs.others || '0') || 0;
      const investment = totalInvestmentCurrent > 0 ? totalInvestmentCurrent : (parseFloat(raw.total_cust_lvl_input || customerLevelInputs.total_investment || customerLevelInputs.investment || '0') || (targetIncentive + marketing + others));
      const gmpl = gmplCurrent > 0 ? gmplCurrent : (parseFloat(raw.gmpl_dofa || customerLevelInputs.prev_gmpl || '0') || 0);
      const skuRebate = parseFloat(customerLevelInputs.sku_level_rebate || customerLevelInputs.skuLevelRebate || customerLevelInputs.skuRebate || '0') || 0;
      const foc = parseFloat(customerLevelInputs.total_foc_value || customerLevelInputs.totalFocValue || customerLevelInputs.foc || '0') || 0;
      const totalInvestment = investment;
      const rsPerLitre = rsLtrInvestmentCurrent > 0 ? rsLtrInvestmentCurrent : (volume > 0 ? Number((totalInvestment / volume).toFixed(2)) : 0);
      const remark = raw.remark || customerLevelInputs.remark || customerLevelInputs.investmentRemarks || '';

      return {
        success: true,
        data: {
          offerId: raw.offer_id,
          offerCode: raw.offer_code || `WBC-${raw.offer_id}`,
          customerName: raw.customerName || '',
          segment: raw.segment || '',
          volume,
          months,
          periodFrom,
          periodTo,
          investment: totalInvestment,
          gmpl,
          skuRebate,
          foc,
          targetIncentive,
          marketing,
          others,
          totalInvestment,
          rsPerLitre,
          remark,
          prevOfferCommitment: volume,
          prevOfferActual: volume,
          prevGmpl: gmpl,
          skuLevelRebate: skuRebate,
          totalFocValue: foc,
          rsLtrInvestment: rsPerLitre,
          additionalInput: marketing,
          signOnBonus: 0,

          // Mapped current_proposed_text metric keys
          AR_SEOL_current: arSeolCurrent,
          total_investment_current: totalInvestmentCurrent,
          rs_l_investment_current: rsLtrInvestmentCurrent,
          gmpl_current: gmplCurrent,
          arSeol: arSeolCurrent,
          investmentRate: rsPerLitre,
        },
      };
    } catch (error) {
      return {
        success: true,
        data: null,
      };
    }
  }
}