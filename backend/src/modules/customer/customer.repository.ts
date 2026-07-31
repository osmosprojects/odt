import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustDetailsEntity } from '../../database/migrations/cust-details.entity';
import { CustomerMasterEntity } from '../../database/migrations/customer-master.entity';
import { OfferDetailsEntity } from '../../database/migrations/offer-details.entity';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(CustDetailsEntity)
    private repo: Repository<CustDetailsEntity>,

    @InjectRepository(CustomerMasterEntity)
    private masterRepo: Repository<CustomerMasterEntity>,

    @InjectRepository(OfferDetailsEntity)
    private offerDetailsRepo: Repository<OfferDetailsEntity>,
  ) {}

  /** Existing: fetch per-offer customer snapshot */
  findByOfferId(offerId: number): Promise<CustDetailsEntity | null> {
    return this.repo.findOne({ where: { offer_id: offerId } });
  }

  /**
   * Live customer master search across all key fields.
   * Searches: customer_name, customer_code, db_name (distributor), db_code, cust_id, gst_no, contact_no, state
   * Returns paginated results ordered by name.
   */
  async searchCustomers(
    q: string,
    page = 1,
    limit = 25,
  ): Promise<{ data: CustomerMasterEntity[]; total: number }> {
    const qb = this.masterRepo
      .createQueryBuilder('c')
      .where('c.customer_name IS NOT NULL')
      .andWhere("c.customer_name != ''");

    if (q && q.trim().length > 0) {
      const term = `%${q.trim()}%`;
      qb.andWhere(
        `(c.customer_name LIKE :term
          OR c.customer_code LIKE :term
          OR c.db_name LIKE :term
          OR c.db_code LIKE :term
          OR CAST(c.cust_id AS CHAR) LIKE :term
          OR c.gst_no LIKE :term
          OR c.contact_no LIKE :term
          OR c.state LIKE :term)`,
        { term },
      );
    }

    const [data, total] = await qb
      .orderBy('c.customer_name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, total };
  }

  /** Fetch all offer history records associated with a customer code, JDE AB code, or customer name */
  async getCustomerOffers(customerCode: string, customerName?: string): Promise<any[]> {
    const code = (customerCode || '').trim();
    const name = (customerName || '').trim();
    if (!code && !name) return [];

    const qb = this.repo
      .createQueryBuilder('cd')
      .innerJoin(OfferDetailsEntity, 'o', 'cd.offer_id = o.offer_id');

    const conditions: string[] = [];
    const params: Record<string, any> = {};

    if (code) {
      conditions.push('cd.customer_distributor_jde_ab_no_text = :code');
      conditions.push('cd.customer_turfview_no_text = :code');
      conditions.push('o.executive_code = :code');
      params.code = code;
    }

    if (name && name.length >= 2) {
      conditions.push('cd.customer_name_text = :name');
      conditions.push('cd.customer_name_text LIKE :nameLike');
      params.name = name;
      params.nameLike = `%${name}%`;

      // Extract key significant words (e.g. "BALAJI" from "BIKE POINT NEW BALAJI AUTOMOBILES")
      const words = name.split(/\s+/).filter(
        (w) => w.length >= 4 && !['BIKE', 'POINT', 'NEW', 'SHRI', 'SHREE', 'PVT', 'LTD', 'LIMITED', 'MOTORS', 'AUTOMOBILES', 'AUTOMOTIVE', 'WORKS', 'ENTERPRISES', 'SERVICES', 'LUBRICANTS'].includes(w.toUpperCase()),
      );
      words.forEach((word, idx) => {
        conditions.push(`cd.customer_name_text LIKE :word_${idx}`);
        params[`word_${idx}`] = `%${word}%`;
      });
    }

    qb.where(`(${conditions.join(' OR ')})`, params)
      .select([
        'o.offer_id AS offer_id',
        'o.offer_code AS offer_code',
        'o.offer_type AS offer_type',
        'o.offer_status AS offer_status',
        'o.start_date AS start_date',
        'o.end_date AS end_date',
        'o.effective_end_date AS effective_end_date',
        'o.contract_tenure AS contract_tenure',
        'o.tot_volume_commitment AS tot_volume_commitment',
        'o.total_gross_margin AS total_gross_margin',
        'o.offer_closure_status AS offer_closure_status',
        'cd.customer_name_text AS customer_name',
        'cd.segment_text AS segment',
      ])
      .orderBy('o.offer_id', 'DESC')
      .limit(50);

    const rows = await qb.getRawMany();
    return rows || [];
  }

  /**
   * Enrich customer records with Executive Name (from econ_customers_drm),
   * State Name (from wow_statemaster), and GST Number (from odt_customer_master).
   */
  async enrichCustomerData(
    customers: CustomerMasterEntity[],
  ): Promise<Map<string, { executive: string; state: string; gstNumber: string }>> {
    const map = new Map<string, { executive: string; state: string; gstNumber: string }>();
    if (!customers || customers.length === 0) return map;

    const execCodes = Array.from(
      new Set(customers.map((c) => (c.executive_code || '').trim()).filter(Boolean)),
    );
    const stateCodes = Array.from(
      new Set(customers.map((c) => (c.state || '').trim()).filter(Boolean)),
    );

    // 1. Executive Name lookup from econ_customers_drm
    const execMap = new Map<string, string>();
    if (execCodes.length > 0) {
      try {
        const rawExecs = await this.masterRepo.manager.query(
          `SELECT loginid, TRIM(CONCAT(IFNULL(fname, ''), ' ', IFNULL(lname, ''))) AS full_name
           FROM econ_customers_drm
           WHERE loginid IN (?)`,
          [execCodes],
        );
        if (Array.isArray(rawExecs)) {
          for (const r of rawExecs) {
            const loginid = (r.loginid || r.LOGINID || '').toString().trim();
            const fullName = (r.full_name || r.FULL_NAME || '').toString().trim();
            if (loginid && fullName) {
              execMap.set(loginid, fullName);
            }
          }
        }
      } catch (err) {
        // Graceful error logging
      }
    }

    // 2. State lookup via 4-step relational flow:
    // Step 1: odt_customer_master.id
    // Step 2: wow_wo_cust_details.offer_id = odt_customer_master.id -> cust_state
    // Step 3: wow_statemaster.code = cust_state -> statename
    // Step 4: state = statename
    const masterIds = Array.from(
      new Set(customers.map((c) => c.id).filter(Boolean)),
    );

    const custStateMap = new Map<number, string>();
    if (masterIds.length > 0) {
      try {
        let rawCustDetails: any[] = [];
        try {
          rawCustDetails = await this.masterRepo.manager.query(
            `SELECT offer_id, cust_state FROM wow_wo_cust_details WHERE offer_id IN (?)`,
            [masterIds],
          );
        } catch {
          try {
            rawCustDetails = await this.masterRepo.manager.query(
              `SELECT offer_id, cust_state FROM wow_odt_cust_details WHERE offer_id IN (?)`,
              [masterIds],
            );
          } catch {
            rawCustDetails = await this.masterRepo.manager.query(
              `SELECT offer_id, cust_state FROM odt_cust_details WHERE offer_id IN (?)`,
              [masterIds],
            );
          }
        }

        if (Array.isArray(rawCustDetails)) {
          for (const r of rawCustDetails) {
            const offerId = Number(r.offer_id || r.OFFER_ID);
            const custState = (r.cust_state || r.CUST_STATE || '').toString().trim();
            if (offerId && custState) {
              custStateMap.set(offerId, custState);
            }
          }
        }
      } catch (err) {
        // Graceful error handling
      }
    }

    const custStateCodes = Array.from(
      new Set(Array.from(custStateMap.values()).filter(Boolean)),
    );
    const stateNameMap = new Map<string, string>();
    if (custStateCodes.length > 0) {
      try {
        const rawStates = await this.masterRepo.manager.query(
          `SELECT code, statename FROM wow_statemaster WHERE code IN (?) OR statename IN (?)`,
          [custStateCodes, custStateCodes],
        );
        if (Array.isArray(rawStates)) {
          for (const r of rawStates) {
            const code = (r.code || r.CODE || '').toString().trim();
            const name = (r.statename || r.STATENAME || r.state_name || '').toString().trim();
            if (code && name) {
              stateNameMap.set(code, name);
            }
            if (name) {
              stateNameMap.set(name, name);
            }
          }
        }
      } catch (err) {
        // Graceful error handling
      }
    }

    for (const c of customers) {
      const key = String(c.id || c.cust_id);
      const execCode = (c.executive_code || '').trim();

      let resolvedExec = (c.executive_name || '').trim();
      if (!resolvedExec && execCode) {
        resolvedExec = execMap.get(execCode) || '';
      }

      // Step 4: Populate state = statename derived from offer_id -> cust_state -> statename
      const custStateCode = custStateMap.get(c.id) || '';
      let resolvedState = '';
      if (custStateCode) {
        resolvedState = stateNameMap.get(custStateCode) || custStateCode;
      }

      const resolvedGst = (c.gst_no || '').trim();

      map.set(key, {
        executive: resolvedExec,
        state: resolvedState,
        gstNumber: resolvedGst,
      });
    }

    return map;
  }

}