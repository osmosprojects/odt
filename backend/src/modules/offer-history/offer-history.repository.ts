import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferDetailsEntity } from '../../database/migrations/offer-details.entity';
import { CustDetailsEntity } from '../../database/migrations/cust-details.entity';
import { CustomerMasterEntity } from '../../database/migrations/customer-master.entity';

@Injectable()
export class OfferHistoryRepository {
  private readonly logger = new Logger(OfferHistoryRepository.name);

  constructor(
    @InjectRepository(OfferDetailsEntity)
    private repo: Repository<OfferDetailsEntity>,
    @InjectRepository(CustDetailsEntity)
    private custRepo: Repository<CustDetailsEntity>,
    @InjectRepository(CustomerMasterEntity)
    private masterRepo: Repository<CustomerMasterEntity>,
  ) {}

  /**
   * Search wow_odt_cust_details by customer_name_text ONLY.
   */
  async findOfferIdsByCustomerName(customerName: string): Promise<number[]> {
    const name = (customerName || '').trim();
    if (!name) return [];

    const startTime = Date.now();
    const qb = this.custRepo
      .createQueryBuilder('cd')
      .select('DISTINCT cd.offer_id', 'offer_id')
      .where('cd.customer_name_text IS NOT NULL AND (cd.customer_name_text = :name OR cd.customer_name_text LIKE :likeName)', {
        name,
        likeName: `%${name}%`,
      });

    this.logger.log(`[Generated SQL]: ${qb.getSql()}`);
    this.logger.log(`[SQL Parameters]: name="${name}", likeName="%${name}%"`);
    this.logger.log(`[Executing SQL]`);

    try {
      const rows = await qb.getRawMany();
      const offerIds = (rows || []).map((r) => Number(r.offer_id)).filter((id) => !isNaN(id) && id > 0);
      const executionTime = Date.now() - startTime;
      this.logger.log(`[Rows Returned]: ${rows.length} | [Offer IDs Found]: [${offerIds.join(', ')}] | [Execution Time]: ${executionTime}ms`);
      return offerIds;
    } catch (error) {
      this.logger.error(`[SQL ERROR]`, error);
      throw error;
    }
  }

  /**
   * Replicate ORIGINAL PHP Previous Offer Flow:
   * STEP 1: Customer selected (DTO received)
   * STEP 2: Search odt_customer_master by name/code/id
   * STEP 3: Return exact customer row
   * STEP 4: Take odt_customer_master.id & cust_id
   * STEP 5: Search odt_offer_details WHERE offer_id = odt_customer_master.id
   * STEP 6: Return previous offer details
   */
  async findAllByCustomerIdentifiers(
    customerCode?: string,
    custIdStr?: string,
    executiveCode?: string,
    customerName?: string,
  ): Promise<OfferDetailsEntity[]> {
    const startTime = Date.now();
    const code = (customerCode || '').trim();
    const custId = (custIdStr || '').trim();
    const execCode = (executiveCode || '').trim();
    const name = (customerName || '').trim();

    this.logger.log(`[Debug 1 - Customer selected]: customerCode="${code}", custId="${custId}", executiveCode="${execCode}", customerName="${name}"`);

    // STEP 2 & 3: Search odt_customer_master
    let customerMaster: CustomerMasterEntity | null = null;
    if (name) {
      customerMaster = await this.masterRepo.findOne({ where: { customer_name: name } });
    }
    if (!customerMaster && code) {
      customerMaster = await this.masterRepo.findOne({ where: { customer_code: code } });
    }
    if (!customerMaster && custId && !isNaN(Number(custId))) {
      customerMaster = await this.masterRepo.findOne({ where: [{ id: Number(custId) }, { cust_id: Number(custId) }] });
    }

    const offerIdsToQuery: number[] = [];

    if (customerMaster) {
      this.logger.log(`[Debug 2 - Customer found in odt_customer_master]: ${JSON.stringify({ id: customerMaster.id, cust_id: customerMaster.cust_id, customer_name: customerMaster.customer_name, customer_code: customerMaster.customer_code })}`);
      this.logger.log(`[Debug 3 - Customer ID]: ${customerMaster.id} (cust_id: ${customerMaster.cust_id})`);

      if (customerMaster.id) offerIdsToQuery.push(customerMaster.id);
      if (customerMaster.cust_id && customerMaster.cust_id !== customerMaster.id) {
        offerIdsToQuery.push(customerMaster.cust_id);
      }
    } else if (custId && !isNaN(Number(custId))) {
      offerIdsToQuery.push(Number(custId));
    } else {
      this.logger.log(`[Debug 2 - Customer found in odt_customer_master]: NOT FOUND directly in master table`);
    }

    // STEP 4 & 5: Query odt_offer_details
    const qb = this.repo
      .createQueryBuilder('od')
      .select([
        'od.*',
        'cd.customer_name_text AS customer_name_text',
        'cd.bp_sales_rep_text AS bp_sales_rep_text',
        'cd.cust_state AS cust_state',
        'cd.segment_text AS segment_text',
        'cd.sub_segment_text AS sub_segment_text',
        'cd.customer_distributor_jde_ab_no_text AS customer_distributor_jde_ab_no_text',
        'cd.customer_turfview_no_text AS customer_turfview_no_text',
      ])
      .leftJoin(CustDetailsEntity, 'cd', 'od.offer_id = cd.offer_id')
      .where("od.offer_status NOT IN ('DEL')");

    if (offerIdsToQuery.length > 0) {
      this.logger.log(`[Debug 4 - Offer ID lookup]: Querying odt_offer_details WHERE offer_id IN (${offerIdsToQuery.join(', ')})`);
      qb.andWhere('od.offer_id IN (:...offerIdsToQuery)', { offerIdsToQuery });
    } else if (code) {
      this.logger.log(`[Debug 4 - Offer ID lookup]: Fallback querying by customer_distributor_jde_ab_no_text="${code}"`);
      qb.andWhere('cd.customer_distributor_jde_ab_no_text = :code', { code });
    } else if (name) {
      this.logger.log(`[Debug 4 - Offer ID lookup]: Fallback querying by customer_name_text="${name}"`);
      qb.andWhere('cd.customer_name_text = :name', { name });
    } else {
      this.logger.log(`[Debug 4 - Offer ID lookup]: No valid identifiers provided, returning empty array`);
      return [];
    }

    qb.orderBy('od.start_date', 'DESC').addOrderBy('od.id', 'DESC').limit(50);

    this.logger.log(`[Generated SQL]: ${qb.getSql()}`);
    this.logger.log(`[Executing SQL]`);

    try {
      const offers = await qb.getRawMany();
      const executionTime = Date.now() - startTime;
      this.logger.log(`[Debug 5 - Offer found]: ${offers.length} offers found | [Execution Time]: ${executionTime}ms`);
      if (offers.length > 0) {
        this.logger.log(`[First Offer Row]: ${JSON.stringify({ offer_id: offers[0].offer_id, offer_code: offers[0].offer_code, start_date: offers[0].start_date, customer_name_text: offers[0].customer_name_text })}`);
      }
      return offers as any[];
    } catch (error) {
      this.logger.error(`[SQL ERROR]`, error);
      throw error;
    }
  }

  /**
   * Search by Offer ID directly.
   */
  async findOfferIdsByOfferId(offerId: number): Promise<number[]> {
    if (!offerId || isNaN(offerId)) return [];

    const startTime = Date.now();
    try {
      const exists = await this.repo.findOne({ where: { offer_id: offerId } });
      const offerIds = exists ? [offerId] : [];
      const executionTime = Date.now() - startTime;
      this.logger.log(`[Rows Returned]: ${offerIds.length} | [Offer IDs Found]: [${offerIds.join(', ')}] | [Execution Time]: ${executionTime}ms`);
      return offerIds;
    } catch (error) {
      this.logger.error(`[SQL ERROR]`, error);
      throw error;
    }
  }

  /**
   * Search by Executive Code.
   */
  async findAllByExecutiveCode(executiveCode: string, limit = 10): Promise<OfferDetailsEntity[]> {
    const startTime = Date.now();
    const execCode = (executiveCode || '').trim();
    if (!execCode) return [];

    const qb = this.repo
      .createQueryBuilder('od')
      .select([
        'od.*',
        'cd.customer_name_text AS customer_name_text',
        'cd.bp_sales_rep_text AS bp_sales_rep_text',
        'cd.cust_state AS cust_state',
        'cd.segment_text AS segment_text',
        'cd.sub_segment_text AS sub_segment_text',
        'cd.customer_distributor_jde_ab_no_text AS customer_distributor_jde_ab_no_text',
        'cd.customer_turfview_no_text AS customer_turfview_no_text',
      ])
      .leftJoin(CustDetailsEntity, 'cd', 'od.offer_id = cd.offer_id')
      .where('od.executive_code = :code', { code: execCode })
      .andWhere("od.offer_status NOT IN ('DEL')")
      .orderBy('od.id', 'DESC')
      .limit(limit);

    this.logger.log(`[Generated SQL]: ${qb.getSql()}`);
    this.logger.log(`[SQL Parameters]: code="${execCode}"`);
    this.logger.log(`[Executing SQL]`);

    try {
      const offers = await qb.getRawMany();
      const executionTime = Date.now() - startTime;
      this.logger.log(`[Rows Returned]: ${offers.length} | [Execution Time]: ${executionTime}ms`);
      return offers as any[];
    } catch (error) {
      this.logger.error(`[SQL ERROR]`, error);
      throw error;
    }
  }

  /**
   * Fetch odt_offer_details for collected offerIds.
   */
  async findPreviousOffersByOfferIds(offerIds: number[]): Promise<OfferDetailsEntity[]> {
    if (!offerIds || offerIds.length === 0) return [];

    const startTime = Date.now();
    const qb = this.repo
      .createQueryBuilder('od')
      .select([
        'od.*',
        'cd.customer_name_text AS customer_name_text',
        'cd.bp_sales_rep_text AS bp_sales_rep_text',
        'cd.cust_state AS cust_state',
        'cd.segment_text AS segment_text',
        'cd.sub_segment_text AS sub_segment_text',
        'cd.customer_distributor_jde_ab_no_text AS customer_distributor_jde_ab_no_text',
        'cd.customer_turfview_no_text AS customer_turfview_no_text',
      ])
      .leftJoin(CustDetailsEntity, 'cd', 'od.offer_id = cd.offer_id')
      .where('od.offer_id IN (:...offerIds)', { offerIds })
      .andWhere("od.offer_status NOT IN ('DEL')")
      .orderBy('od.start_date', 'DESC')
      .addOrderBy('od.id', 'DESC');

    this.logger.log(`[Generated SQL]: ${qb.getSql()}`);
    this.logger.log(`[Executing SQL]`);

    try {
      const offers = await qb.getRawMany();
      const executionTime = Date.now() - startTime;
      this.logger.log(`[Offer Loaded]: ${offers.length} offers loaded | [Execution Time]: ${executionTime}ms`);
      return offers as any[];
    } catch (error) {
      this.logger.error(`[SQL ERROR]`, error);
      throw error;
    }
  }

  /** Find latest offer by customer identifiers */
  async findLatestByCustomer(
    customerCode?: string,
    custIdStr?: string,
    executiveCode?: string,
    customerName?: string,
  ): Promise<OfferDetailsEntity | null> {
    const offers = await this.findAllByCustomerIdentifiers(customerCode, custIdStr, executiveCode, customerName);
    return offers.length > 0 ? offers[0] : null;
  }

  /** Legacy Orchestrator for customer name */
  async findOfferHistory(customerName: string): Promise<OfferDetailsEntity[]> {
    const offerIds = await this.findOfferIdsByCustomerName(customerName);
    if (!offerIds || offerIds.length === 0) return [];
    return this.findPreviousOffersByOfferIds(offerIds);
  }
}
