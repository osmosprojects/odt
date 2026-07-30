import { Injectable, Logger } from '@nestjs/common';
import { OfferHistoryRepository } from './offer-history.repository';
import { PreviousOfferLookupDto } from './dtos/previous-offer-lookup.dto';
import { safePhpUnserialize } from '../../common/utils/legacy-serialization.utils';
import { OfferDetailsEntity } from '../../database/migrations/offer-details.entity';

export interface PreviousOfferDetails {
  offer_id: number;
  offer_code: string;
  stream: string;
  executive_code: string;
  start_date: string | null;
  end_date: string | null;
  contract_tenure: string | null;
  tot_volume_commitment: string;
  offer_status: string;
  total_gross_margin: string;
  gmpl_dofa: string;
  remark: string;
  proposal_id: string;

  customer_level_input_text: string;
  current_proposed_text: string;
  previous_sku_details: string;
  sku_text: string;

  customerLevelInputs: any;
  currentProposed: any;
  previousSkus: any;
  skus: any;
  previousSkuDetails: any[];
  historicalPackage: any;
  customerPerformance: any;
  previousContract: any;
  previousOfferSummary: any;

  // Deserialized metric values from current_proposed_text
  AR_SEOL_current?: number;
  total_investment_current?: number;
  rs_l_investment_current?: number;
  gmpl_current?: number;
  kl_pm_current?: number;

  offerId: number;
  offerCode: string;
  offerType: string;
  offerStatus: string;
  startDate: string | null;
  endDate: string | null;
  contractTenure: string | null;
  contractVolume: number;
  volumeCommitment: number;
  previousCommitment: number;
  previousActual: number;
  previousInvestment: number;
  investmentRate: number;
  gmpl: number;
  gmplDofa: string;
  totalCustLvlInput: number;
  totalNetPrice: number;
  executiveCode: string;
  createdDate: string | null;
  latestUpdatedDate: string | null;
}

export interface PreviousOfferResponse {
  success: boolean;
  hasPreviousOffer: boolean;
  previousOffer: PreviousOfferDetails | null;
  previousContract?: any;
  previousSkuDetails?: any[];
  historicalPackage?: any;
  customerPerformance?: any;
  previousOfferSummary?: any;
  offerHistory: PreviousOfferDetails[];
  message?: string;
  customer?: {
    customer_identifier: string;
  } | null;
}

function parsePhpValue(text: string | null | undefined, key: string): string | null {
  if (!text) return null;
  const regex = new RegExp(`"${key}";(?:s:\\d+:"([^"]*)"|i:(\\d+)|d:([\\d.]+))`, 'i');
  const match = text.match(regex);
  if (match) {
    return match[1] ?? match[2] ?? match[3] ?? null;
  }
  return null;
}

@Injectable()
export class OfferHistoryService {
  private readonly logger = new Logger(OfferHistoryService.name);

  constructor(private repo: OfferHistoryRepository) {}

  private mapOfferToDetails(offer: any): PreviousOfferDetails {
    const formatDate = (d: any) => (d ? new Date(d).toISOString().split('T')[0] : null);

    const customerLevelInputs = safePhpUnserialize(offer.customer_level_input_text) || {};
    const currentProposed = safePhpUnserialize(offer.current_proposed_text) || {};
    const rawPrevSkus = safePhpUnserialize(offer.previous_sku_details);
    const rawSkuText = safePhpUnserialize(offer.sku_text);

    this.logger.log(`[Debug - Previous Offer Found]: Offer ID ${offer.offer_id} (${offer.offer_code})`);
    this.logger.log(`[Debug - sku_text Loaded]: Offer ID ${offer.offer_id} | Length: ${offer.sku_text ? offer.sku_text.length : 0}`);
    this.logger.log(`[Debug - sku_text Deserialized]: ${!!rawSkuText}`);

    // Normalize indexed SKU text into clean arrays with full PHP attributes
    const parseSkuArray = (raw: any): any[] => {
      if (!raw) return [];
      if (Array.isArray(raw)) {
        return raw.map((item: any, idx: number) => {
          const cogs = parseFloat(item.cogs || item.baseCogs || item.sku_base_cogs || '0');
          const reb = parseFloat(item.skuRebate || item.rebate || item.sku_reb_per_ltr || item.sku_rebate || '0');
          const mixInc = parseFloat(item.mixIncentive || item.mix_incentive || reb || '0');
          const recMixInc = parseFloat(item.recMixIncentive || item.rec_mix_incentive || '0');
          const inc = parseFloat(item.productTargetIncentive || item.incentive || item.sku_incentive || item.targetIncentive || '0');
          const vol = parseFloat(item.contractVolume || item.volume || item.sku_volume || '0');
          const focVol = parseFloat(item.focVolume || item.foc_volume || '0');
          const gross = parseFloat(item.grossMargin || item.baseGross || item.sku_base_gross || '0');
          const sur = parseFloat(item.surcharge || item.sku_surcharge || '0');
          const nhfVal = parseFloat(item.nhf || item.sku_nhf || gross || '0');
          const totInp = parseFloat(item.totalInput || item.total_input || '0') || (reb + mixInc + inc);
          const baseTOVal = parseFloat(item.baseTO || item.base_to || item.sku_base_to || '0') || (cogs * 1.45);

          return {
            id: item.id || String(idx + 1),
            skuName: item.skuName || item.sku_name || '',
            skuCode: item.skuCode || item.sku_code || '',
            cogs,
            baseCogs: cogs,
            baseCOGS: cogs,
            baseTO: baseTOVal,
            contractVolume: vol,
            volume: vol,
            focVolume: focVol,
            totalInput: totInp,
            surcharge: sur,
            nhf: nhfVal,
            recMixIncentive: recMixInc,
            mixIncentive: mixInc,
            skuRebate: reb,
            rebate: reb,
            rebatePerLtr: reb,
            productTargetIncentive: inc,
            incentive: inc,
            grossMargin: gross,
            baseGross: gross,
            gmLevel: item.gmLevel || item.sku_gm_level || 'N',
            skuDataOption: item.skuDataOption || item.sku_data_option || "Primary",
            lbmName: item.lbmName || item.lbm_name || item.description || "Lubricants",
            pvName: item.pvName || item.pv_name || item.brandName || "PV",
            productTargetIncentiveDisbVol: vol,
            productTargetIncentiveDisbMonths: 12,
            productTargetIncentiveDisbAmt: inc * vol,
          };
        });
      }
      if (Array.isArray(raw.skus)) {
        return parseSkuArray(raw.skus);
      }
      const list: any[] = [];
      let counter = parseInt(raw.sku_counter || '0', 10);

      if (counter === 0 && typeof raw === 'object') {
        const keys = Object.keys(raw);
        for (const k of keys) {
          const m = k.match(/^sku_code(\d+)$/);
          if (m) {
            const idx = parseInt(m[1], 10) + 1;
            if (idx > counter) counter = idx;
          }
        }
      }

      if (counter > 0) {
        for (let i = 0; i < counter; i++) {
          if (raw[`sku_code${i}`] || raw[`sku_name${i}`]) {
            const reb = parseFloat(raw[`sku_reb_per_ltr${i}`] || raw[`sku_rebate${i}`] || '0');
            const vol = parseFloat(raw[`sku_volume${i}`] || '0');
            const focVol = parseFloat(raw[`foc_volume${i}`] || '0');
            const gross = parseFloat(raw[`sku_base_gross${i}`] || '0');
            const cogs = parseFloat(raw[`sku_base_cogs${i}`] || '0');
            const inc = parseFloat(raw[`product_target_incentive${i}`] || raw[`sku_incentive${i}`] || raw[`incentive${i}`] || '0');
            const mixInc = parseFloat(raw[`mix_incentive${i}`] || raw[`sku_mix_incentive${i}`] || reb || '0');
            const recMixInc = parseFloat(raw[`rec_mix_incentive${i}`] || raw[`rec_mix_inc${i}`] || '0');
            const sur = parseFloat(raw[`surcharge${i}`] || raw[`sku_surcharge${i}`] || '0');
            const nhfVal = parseFloat(raw[`nhf${i}`] || raw[`sku_nhf${i}`] || gross || '0');
            const totInp = parseFloat(raw[`total_input${i}`] || '0') || (reb + mixInc + inc);
            const baseTOVal = parseFloat(raw[`sku_base_to${i}`] || raw[`base_to${i}`] || '0') || (cogs * 1.45);

            list.push({
              id: String(i + 1),
              skuName: raw[`sku_name${i}`] || '',
              skuCode: raw[`sku_code${i}`] || '',
              contractVolume: vol,
              volume: vol,
              focVolume: focVol,
              cogs: cogs,
              baseCogs: cogs,
              baseCOGS: cogs,
              baseTO: baseTOVal,
              totalInput: totInp,
              surcharge: sur,
              nhf: nhfVal,
              recMixIncentive: recMixInc,
              mixIncentive: mixInc,
              skuRebate: reb,
              rebate: reb,
              rebatePerLtr: reb,
              productTargetIncentive: inc,
              incentive: inc,
              grossMargin: gross,
              baseGross: gross,
              gmLevel: raw[`sku_gm_level${i}`] || 'N',
              skuDataOption: "Primary",
              lbmName: "Lubricants",
              pvName: "PV",
              productTargetIncentiveDisbVol: vol,
              productTargetIncentiveDisbMonths: 12,
              productTargetIncentiveDisbAmt: inc * vol,
            });
          }
        }
      }
      return list;
    };

    const skus = parseSkuArray(rawSkuText);
    const previousSkus = parseSkuArray(rawPrevSkus);
    const finalSkus = skus.length > 0 ? skus : previousSkus;

    this.logger.log(`[Debug - SKU Array Created]: Total ${finalSkus.length} SKUs extracted from sku_text`);

    const propText = offer.current_proposed_text || '';
    const custInputText = offer.customer_level_input_text || '';
    
    const volCurrent = parseFloat(parsePhpValue(propText, 'volume_kl_current') || currentProposed.volume_kl_current || currentProposed.existing_details?.volume || '0');
    const volProposed = parseFloat(parsePhpValue(propText, 'volume_kl_proposed') || currentProposed.volume_kl_proposed || '0');
    const totVolCommitment = parseFloat(offer.tot_volume_commitment || '0');

    const commitment = totVolCommitment > 0 ? totVolCommitment : (volProposed > 0 ? volProposed : volCurrent);
    const actual = volCurrent;

    const invCurrent = parseFloat(parsePhpValue(propText, 'total_investment_current') || currentProposed.total_investment_current || currentProposed.existing_details?.total_cust_level_input || '0');
    const invProposed = parseFloat(parsePhpValue(propText, 'total_investment_proposed') || currentProposed.total_investment_proposed || '0');
    const custLvlInput = parseFloat(offer.total_cust_lvl_input || parsePhpValue(custInputText, 'Total_total') || customerLevelInputs.Total_total || customerLevelInputs.total_investment || '0');
    const prevInvestment = invCurrent > 0 ? invCurrent : (invProposed > 0 ? invProposed : custLvlInput);

    // Read the five Previous Contract metrics with robust fallbacks
    const arSeolCurrent = parseFloat(parsePhpValue(propText, 'AR_SEOL_current') || currentProposed.AR_SEOL_current || '0') ||
                          parseFloat(parsePhpValue(propText, 'AR_SEOL_proposed') || currentProposed.AR_SEOL_proposed || '0') ||
                          parseFloat(parsePhpValue(custInputText, 'ar_seol') || customerLevelInputs.ar_seol || customerLevelInputs.arSeol || '0') || 0;
    
    const totalInvestmentCurrent = prevInvestment;

    const rsLtrCurrent = parseFloat(parsePhpValue(propText, 'rs_l_investment_current') || currentProposed.rs_l_investment_current || '0');
    const rsLtrProposed = parseFloat(parsePhpValue(propText, 'rs_l_investment_proposed') || currentProposed.rs_l_investment_proposed || '0');
    const custLvlRsLtr = parseFloat(parsePhpValue(custInputText, 'Total_rs_lts') || customerLevelInputs.Total_rs_lts || customerLevelInputs.rs_ltr_investment || '0');
    const rsLtrInvestmentCurrent = rsLtrCurrent > 0 ? rsLtrCurrent : (rsLtrProposed > 0 ? rsLtrProposed : (custLvlRsLtr > 0 ? custLvlRsLtr : (commitment > 0 ? Number((prevInvestment / commitment).toFixed(2)) : 0)));

    const gmplCurrent = parseFloat(parsePhpValue(propText, 'gmpl_current') || currentProposed.gmpl_current || currentProposed.existing_details?.gmpl || '0');
    const gmplProposed = parseFloat(parsePhpValue(propText, 'gmpl_proposed') || currentProposed.gmpl_proposed || '0');
    const custLvlGmpl = parseFloat(parsePhpValue(custInputText, 'prev_gmpl') || customerLevelInputs.prev_gmpl || customerLevelInputs.prevGmpl || '0');
    const columnGmpl = parseFloat(offer.gmpl_dofa || '') || 0;
    const finalGmplCurrent = gmplCurrent > 0 ? gmplCurrent : (gmplProposed > 0 ? gmplProposed : (custLvlGmpl > 0 ? custLvlGmpl : (columnGmpl > 0 ? columnGmpl : 0)));

    const klPmCurrent = parseFloat(parsePhpValue(propText, 'kl_pm_current') || currentProposed.kl_pm_current || '0');
    const klPmProposed = parseFloat(parsePhpValue(propText, 'kl_pm_propsed') || currentProposed.kl_pm_propsed || '0');

    const tenureMonths = parseInt(offer.contract_tenure || customerLevelInputs.months || '12', 10) || 12;
    const volPerMonth = klPmCurrent > 0 ? Math.round(klPmCurrent) : (klPmProposed > 0 ? Math.round(klPmProposed) : (commitment > 0 ? Math.round(commitment / tenureMonths) : 0));
    const actPerMonth = actual > 0 ? Math.round(actual / tenureMonths) : 0;
    const rate = rsLtrInvestmentCurrent;
    const gmplVal = finalGmplCurrent;

    const createdDate = formatDate(offer.start_date);
    const latestUpdatedDate = formatDate(offer.offer_details_updated_date) || createdDate;

    const executiveName = offer.bp_sales_rep_text || offer.executiveName || offer.executive_code || '';
    const state = offer.cust_state || offer.state || '';
    const customerName = offer.customer_name_text || offer.customerName || '';

    // Construct Historical Package exactly matching PHP
    const historicalPackage = {
      targetIncentive: parseFloat(customerLevelInputs.target_incentive || customerLevelInputs.targetIncentive || prevInvestment || '0'),
      additionalInput: parseFloat(customerLevelInputs.additional_input || customerLevelInputs.additionalInput || '0'),
      signOnBonus: parseFloat(customerLevelInputs.sign_on_bonus || customerLevelInputs.signOnBonus || '0'),
      others: parseFloat(customerLevelInputs.others || '0'),
      arSeol: arSeolCurrent > 0 ? String(arSeolCurrent) : (customerLevelInputs.ar_seol || customerLevelInputs.arSeol || 'Not Applicable'),
      skuLevelRebate: parseFloat(customerLevelInputs.sku_level_rebate || customerLevelInputs.skuLevelRebate || '0'),
      totalFocValue: parseFloat(customerLevelInputs.total_foc_value || customerLevelInputs.totalFocValue || '0'),
      totalInvestment: totalInvestmentCurrent || prevInvestment,
      rsLtrInvestment: rate,
      prevGmpl: gmplVal,
      remark: offer.remark || customerLevelInputs.remark || customerLevelInputs.investmentRemarks || '',
    };
    this.logger.log(`[Debug - Historical Package Loaded]: ${JSON.stringify(historicalPackage)}`);

    // Construct Customer Performance exactly matching PHP
    const customerPerformance = {
      prevOfferCommitment: commitment,
      prevOfferActual: actual,
      months: tenureMonths,
      periodFrom: createdDate,
      periodTo: latestUpdatedDate,
      volumePM: volPerMonth,
      actualPM: actPerMonth,
      synthShare: parseFloat(currentProposed.synth_share || '0'),
      synthShareActual: parseFloat(currentProposed.synth_share_actual || '0'),
      commitment,
      actual,
    };
    this.logger.log(`[Debug - Customer Performance Loaded]: ${JSON.stringify(customerPerformance)}`);

    const previousContract = {
      offerId: offer.offer_id,
      offerCode: offer.offer_code || '',
      offerType: offer.offer_type || offer.stream || '',
      offerStatus: offer.offer_status || '',
      startDate: formatDate(offer.start_date),
      endDate: formatDate(offer.end_date),
      contractTenure: String(tenureMonths),
      totVolumeCommitment: String(commitment),
      totalGrossMargin: String(offer.total_gross_margin || '0'),
      customerName,
    };

    return {
      offer_id: offer.offer_id,
      offer_code: offer.offer_code || '',
      stream: offer.stream || '',
      executive_code: offer.executive_code || '',
      start_date: formatDate(offer.start_date),
      end_date: formatDate(offer.end_date),
      contract_tenure: String(tenureMonths),
      tot_volume_commitment: String(commitment),
      offer_status: offer.offer_status || '',
      total_gross_margin: String(offer.total_gross_margin || '0'),
      gmpl_dofa: offer.gmpl_dofa || String(gmplVal),
      remark: offer.remark || '',
      proposal_id: offer.proposal_id || '',

      customer_level_input_text: offer.customer_level_input_text || '',
      current_proposed_text: offer.current_proposed_text || '',
      previous_sku_details: offer.previous_sku_details || '',
      sku_text: offer.sku_text || '',

      customerLevelInputs,
      currentProposed,
      previousSkus: finalSkus,
      skus: finalSkus,
      previousSkuDetails: finalSkus,
      historicalPackage,
      customerPerformance,
      previousContract,
      previousOfferSummary: previousContract,

      // Deserialized keys from current_proposed_text
      AR_SEOL_current: arSeolCurrent,
      total_investment_current: totalInvestmentCurrent,
      rs_l_investment_current: rsLtrInvestmentCurrent,
      gmpl_current: finalGmplCurrent,
      kl_pm_current: klPmCurrent > 0 ? klPmCurrent : volPerMonth,

      arSeol: arSeolCurrent,
      totalInvestment: totalInvestmentCurrent || prevInvestment,

      offerId: offer.offer_id,
      offerCode: offer.offer_code || '',
      offerType: offer.offer_type || '',
      offerStatus: offer.offer_status || '',
      startDate: formatDate(offer.start_date),
      endDate: formatDate(offer.end_date),
      contractTenure: String(tenureMonths),
      contractVolume: commitment,
      volumeCommitment: commitment,
      previousCommitment: commitment,
      previousActual: actual,
      previousInvestment: prevInvestment,
      investmentRate: rate,
      gmpl: gmplVal,
      gmplDofa: offer.gmpl_dofa || '',
      totalCustLvlInput: custLvlInput,
      totalNetPrice: offer.total_net_price || 0,
      executiveCode: offer.executive_code || '',
      createdDate,
      latestUpdatedDate,

      executiveName,
      executive_name: executiveName,
      bp_sales_rep_text: executiveName,
      state,
      cust_state: state,
      customerName,
      customer_name_text: customerName,
      volPerMonth,
      volumePM: volPerMonth,
    } as any;
  }

  /**
   * Enterprise Structured Previous Offer Lookup (No regex, no guessing)
   */
  async lookupPreviousOffer(dto: PreviousOfferLookupDto): Promise<PreviousOfferResponse> {
    const startTime = Date.now();
    this.logger.log(`[Debug - Customer Selected]: ${JSON.stringify(dto)}`);

    const customerCode = (dto.customerCode || '').trim();
    const custId = (dto.custId || '').trim();
    const executiveCode = (dto.executiveCode || '').trim();
    const customerName = (dto.customerName || '').trim();

    let offers: OfferDetailsEntity[] = [];
    let repositoryMethodSelected = '';

    // Business Rules: Search using all available identifiers including customerName
    if (customerCode || custId || customerName) {
      repositoryMethodSelected = 'findAllByCustomerIdentifiers';
      this.logger.log(`[Repository Method Selected]: ${repositoryMethodSelected}`);
      offers = await this.repo.findAllByCustomerIdentifiers(customerCode, custId, executiveCode, customerName);
    } else if (executiveCode) {
      repositoryMethodSelected = 'findAllByExecutiveCode';
      this.logger.log(`[Repository Method Selected]: ${repositoryMethodSelected}`);
      offers = await this.repo.findAllByExecutiveCode(executiveCode);
    } else {
      this.logger.log('[Repository Method Selected]: None (Empty DTO provided)');
    }

    // Fallback: If no offers found yet but customerName is provided, search by customerName
    if ((!offers || offers.length === 0) && customerName) {
      this.logger.log('[Repository Method Selected Fallback]: findOfferIdsByCustomerName');
      const offerIds = await this.repo.findOfferIdsByCustomerName(customerName);
      if (offerIds && offerIds.length > 0) {
        offers = await this.repo.findPreviousOffersByOfferIds(offerIds);
      }
    }

    const executionTime = Date.now() - startTime;
    const loadedOfferIds = offers.map((o) => o.offer_id);
    this.logger.log(`[Offer IDs Found]: [${loadedOfferIds.join(', ')}] (Count: ${loadedOfferIds.length})`);
    this.logger.log(`[Offer Loaded]: ${offers.length > 0 ? `Offer ID ${offers[0].offer_id}` : 'None'}`);
    this.logger.log(`[Rows Returned]: ${offers.length}`);
    this.logger.log(`[Execution Time]: ${executionTime}ms`);

    if (!offers || offers.length === 0) {
      const emptyResponse: PreviousOfferResponse = {
        success: true,
        hasPreviousOffer: false,
        previousOffer: null,
        previousContract: null,
        previousSkuDetails: [],
        historicalPackage: null,
        customerPerformance: null,
        previousOfferSummary: null,
        offerHistory: [],
      };
      this.logger.log(`[Debug - API Response Created]: ${JSON.stringify(emptyResponse)}`);
      return emptyResponse;
    }

    const history = offers.map((o) => this.mapOfferToDetails(o));
    const latest = history[0];

    const response: PreviousOfferResponse = {
      success: true,
      hasPreviousOffer: true,
      previousOffer: latest,
      previousContract: latest.previousContract,
      previousSkuDetails: latest.previousSkuDetails,
      historicalPackage: latest.historicalPackage,
      customerPerformance: latest.customerPerformance,
      previousOfferSummary: latest.previousOfferSummary,
      offerHistory: history,
    };

    this.logger.log(`[Debug - API Response Created]: ${JSON.stringify({ success: response.success, hasPreviousOffer: response.hasPreviousOffer, offerCount: history.length, latestOfferId: latest.offerId, skuCount: latest.previousSkuDetails.length })}`);

    return response;
  }

  // Compatibility Wrappers (Delegate to lookupPreviousOffer with structured DTO)
  async getPreviousOfferByCustomerName(paramInput: string): Promise<PreviousOfferResponse> {
    return this.lookupPreviousOffer({ customerName: paramInput });
  }

  async getPreviousOffer(executiveCode: string): Promise<PreviousOfferResponse> {
    return this.lookupPreviousOffer({ executiveCode });
  }

  async getPreviousOfferByCustomer(
    customerCode: string,
    custIdStr?: string,
    executiveCode?: string,
  ): Promise<PreviousOfferResponse> {
    return this.lookupPreviousOffer({
      customerCode,
      custId: custIdStr,
      executiveCode,
    });
  }
}
