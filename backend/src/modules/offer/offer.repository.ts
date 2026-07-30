import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from '../../common/utils/base.utils';
import { OfferEntity } from '../../database/migrations/offer.entity';
import { OfferPageOptionsDto } from './dtos/offer-page-options.dto';
import { OfferDetailsEntity } from '../../database/migrations/offer-details.entity';
import { CustDetailsEntity } from '../../database/migrations/cust-details.entity';

@Injectable()
export class OfferRepository extends BaseRepository<OfferEntity> {
  private readonly logger = new Logger(OfferRepository.name);

  constructor(@InjectRepository(OfferEntity) repo: Repository<OfferEntity>) {
    super(repo);
  }

  findFiltered(opts: OfferPageOptionsDto): Promise<[OfferEntity[], number]> {
    const where: FindOptionsWhere<OfferEntity> = {};
    if (opts.status) where.account_status = opts.status;
    if (opts.category) where.offer_category = opts.category;

    return this.repo.findAndCount({
      where,
      skip: opts.skip,
      take: opts.limit,
      order: { created_date: 'DESC' },
    });
  }

  // #19 — duplicate validation: same executive_code + same expiration_date = likely duplicate
  async findPotentialDuplicate(executiveCode: number, expirationDate: string): Promise<OfferEntity | null> {
    return this.repo.findOne({
      where: { executive_code: executiveCode, expiration_date: new Date(expirationDate) as any },
    });
  }

  findAllForExport(): Promise<OfferEntity[]> {
    return this.repo.find();
  }

  save(offer: OfferEntity): Promise<OfferEntity> {
    return this.repo.save(offer);
  }

  async findPreviousOffer(customerCode: string): Promise<any | null> {
    const code = (customerCode || '').trim();
    if (!code) return null;
    return this.repo.manager
      .createQueryBuilder()
      .select('od.*')
      .from('odt_offer_details', 'od')
      .leftJoin('wow_wo_cust_details', 'cd', 'od.offer_id = cd.offer_id')
      .where("od.offer_status NOT IN ('DEL')")
      .andWhere(
        `((cd.customer_distributor_jde_ab_no_text IS NOT NULL AND cd.customer_distributor_jde_ab_no_text = :code)
          OR (cd.customer_turfview_no_text IS NOT NULL AND cd.customer_turfview_no_text = :code)
          OR (od.executive_code IS NOT NULL AND od.executive_code = :code))`,
        { code },
      )
      .orderBy('od.start_date', 'DESC')
      .addOrderBy('od.id', 'DESC')
      .getRawOne();
  }

  /**
   * Legacy PHP Query: Load all ACTIVE Previous WBC Offers belonging to the logged-in Executive.
   */
  async findPreviousWbcOffersByExecutive(executiveCode: string): Promise<any[]> {
    const execCode = (executiveCode || '').trim();
    this.logger.log(`[Incoming Executive Code]: "${execCode}"`);

    const qb = this.repo.manager
      .createQueryBuilder()
      .select([
        'a.offer_id AS offerId',
        'a.offer_code AS offerCode',
        'a.start_date AS startDate',
        'a.end_date AS endDate',
        'b.customer_name_text AS customerName',
        'b.segment_text AS segment',
        'a.effective_end_date AS effectiveEndDate',
        'a.offer_closure_status AS closureStatus',
      ])
      .from('odt_offer_details', 'a')
      .innerJoin('wow_wo_cust_details', 'b', 'a.offer_id = b.offer_id')
      .where("a.offer_status IN ('P', 'APP', 'A', 'Draft', 'D')");

    if (execCode) {
      qb.andWhere('a.executive_code = :execCode', { execCode });
      this.logger.log(`[SQL Parameters]: executiveCode=${execCode}`);
    }

    qb.orderBy('b.customer_name_text', 'ASC');

    const results = await qb.getRawMany();
    this.logger.log(`[Offer Count]: ${results ? results.length : 0} previous WBC offers found.`);
    return results || [];
  }

  /**
   * Load complete details for a single selected Previous WBC Offer by offerId.
   */
  async findPreviousWbcOfferDetailsById(offerId: number): Promise<any | null> {
    this.logger.log(`[Selected OfferId]: ${offerId}`);
    if (!offerId || isNaN(offerId)) return null;

    const raw = await this.repo.manager
      .createQueryBuilder()
      .select([
        'a.*',
        'b.customer_name_text AS customerName',
        'b.segment_text AS segment',
        'b.customer_type_text AS customerType',
        'b.distributor_name_text AS distributorName',
        'b.customer_distributor_jde_ab_no_text AS jdeCode',
        'b.cust_state AS state',
        'b.gst_no_text AS gstNo',
      ])
      .from('odt_offer_details', 'a')
      .leftJoin('wow_wo_cust_details', 'b', 'a.offer_id = b.offer_id')
      .where('a.offer_id = :offerId', { offerId })
      .getRawOne();

    if (raw) {
      this.logger.log(`[Performance Loaded]: Successfully loaded details for offerId ${offerId}`);
    } else {
      this.logger.warn(`[Performance Loaded]: No record found in odt_offer_details for offerId ${offerId}`);
    }

    return raw;
  }

  /**
   * Create a complete offer across odt_offer_details + wow_wo_cust_details in a single transaction.
   * Returns the newly created offer_id.
   */
  async saveFullOffer(offerPayload: any, custPayload: any): Promise<number> {
    const manager = this.repo.manager;

    return await manager.transaction(async (txn) => {
      // 1. Insert into odt_offer_details (offer_id starts as 0, updated after insert)
      const offerResult = await txn.query(
        `INSERT INTO odt_offer_details
          (stream, offer_code, executive_code, offer_type, offer_status,
           start_date, end_date, contract_tenure, effective_end_date,
           tot_volume_commitment, customer_level_input_text, sku_text,
           current_proposed_text, total_gross_margin, gmpl_dofa,
           final_approver, remark, total_cust_lvl_input, offer_details_updated_date,
           offer_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`,
        [
          offerPayload.stream || 'WBC',
          offerPayload.offer_code || '',
          offerPayload.executive_code || '',
          offerPayload.offer_type || 'New Offer',
          offerPayload.offer_status || 'D',
          offerPayload.start_date || null,
          offerPayload.end_date || null,
          offerPayload.contract_tenure || '12',
          offerPayload.effective_end_date || null,
          offerPayload.tot_volume_commitment || '0',
          offerPayload.customer_level_input_text || null,
          offerPayload.sku_text || null,
          offerPayload.current_proposed_text || null,
          offerPayload.total_gross_margin || '0',
          offerPayload.gmpl_dofa || '0',
          offerPayload.final_approver || 'Regional Sales Manager',
          offerPayload.remark || '',
          offerPayload.total_cust_lvl_input || '0',
        ],
      );

      const newOfferId: number = offerResult.insertId;

      // Sync offer_id = id (convention in this DB: offer_id mirrors the PK)
      await txn.query(`UPDATE odt_offer_details SET offer_id = ? WHERE id = ?`, [newOfferId, newOfferId]);

      // 2. Insert into wow_wo_cust_details using the new offer_id
      await txn.query(
        `INSERT INTO wow_wo_cust_details
          (offer_id, customer_name_text, customer_type_text, current_customer_type_text,
           customer_distributor_jde_ab_no_text, customer_turfview_no_text,
           distributor_name_text, segment_text, sub_segment_text,
           cust_state, customers_address_text, bp_sales_rep_text,
           sales_area_text, gst_no_text, key_account_text,
           investment_type_text, investment_rationale_text,
           bp_bank_funded_text, planning_status_text, sales_remarks_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newOfferId,
          custPayload.customer_name_text || '',
          custPayload.customer_type_text || 'Direct',
          custPayload.current_customer_type_text || '',
          custPayload.customer_distributor_jde_ab_no_text || '',
          custPayload.customer_turfview_no_text || '',
          custPayload.distributor_name_text || '',
          custPayload.segment_text || '',
          custPayload.sub_segment_text || '',
          custPayload.cust_state || '',
          custPayload.customers_address_text || '',
          custPayload.bp_sales_rep_text || '',
          custPayload.sales_area_text || '',
          custPayload.gst_no_text || '',
          custPayload.key_account_text || '',
          custPayload.investment_type_text || '',
          custPayload.investment_rationale_text || '',
          custPayload.bp_bank_funded_text || '',
          custPayload.planning_status_text || '',
          custPayload.sales_remarks_text || '',
        ],
      );

      return newOfferId;
    });
  }

  /** Update offer_code for a newly created offer row */
  async updateOfferCode(offerId: number, offerCode: string): Promise<void> {
    await this.repo.manager.query(
      `UPDATE odt_offer_details SET offer_code = ? WHERE id = ?`,
      [offerCode, offerId],
    );
  }

  /**
   * Fetch all pipeline offers for the Pipeline Dashboard with accurate customer names
   */
  async getPipelineOffers(): Promise<any[]> {
    return this.repo.manager
      .createQueryBuilder()
      .select([
        'a.offer_id AS id',
        'a.offer_code AS offerCode',
        'a.stream AS stream',
        'a.offer_type AS offerType',
        'a.offer_status AS status',
        'a.tot_volume_commitment AS volumeCommitment',
        'a.total_gross_margin AS grossMargin',
        'a.start_date AS createdDate',
        'a.end_date AS expiryDate',
        'a.final_approver AS approver',
        'a.gmpl_dofa AS dofaLevel',
        "COALESCE(NULLIF(TRIM(MAX(b.customer_name_text)), ''), NULLIF(TRIM(MAX(c.customer_name)), ''), CONCAT(a.stream, ' Customer (', a.offer_code, ')')) AS customerName",
      ])
      .from('odt_offer_details', 'a')
      .leftJoin('wow_wo_cust_details', 'b', 'a.offer_id = b.offer_id')
      .leftJoin('odt_customer_master', 'c', 'c.cust_id = a.executive_code OR c.customer_code = b.customer_distributor_jde_ab_no_text')
      .groupBy('a.offer_id')
      .orderBy('a.offer_id', 'DESC')
      .limit(200)
      .getRawMany();
  }
}