import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';

/** Shape returned to the frontend for the Offer Creation Demo customer search */
export interface CustomerSearchResult {
  id: string;
  name: string;
  businessStream: string;
  customerCode: string;
  customerType: string;
  distributorName: string;
  distributorCode: string;
  jdeCode: string;
  state: string;
  segment: string;
  subSegment: string;
  executive: string;
  salesRep: string;
  salesArea: string;
  address: string;
  gstNumber: string;
  previousWbc: string;
  previousWbcOffer: string;
}

@Injectable()
export class CustomerService {
  constructor(private customerRepo: CustomerRepository) {}

  /** Existing: get customer snapshot tied to a specific offer */
  async getForOffer(offerId: number) {
    const customer = await this.customerRepo.findByOfferId(offerId);
    if (!customer)
      throw new NotFoundException(`No customer data found for offer ${offerId}`);
    return customer;
  }

  /**
   * Live master-data customer search with pagination.
   * Query must be at least 2 characters.
   */
  async searchCustomers(
    q: string,
    page = 1,
    limit = 25,
  ): Promise<{ data: CustomerSearchResult[]; total: number; page: number; limit: number }> {
    const { data: rows, total } = await this.customerRepo.searchCustomers(
      (q || '').trim(),
      page,
      limit,
    );

    const mapped = rows.map((c) => ({
      id: String(c.cust_id || c.id),
      name: c.customer_name || '',
      businessStream: c.stream || '',
      customerCode: c.customer_code || '',
      customerType: c.customer_type || 'Direct',
      distributorName: c.db_name || '',
      distributorCode: c.db_code || '',
      jdeCode: c.customer_code || String(c.cust_id || c.id),
      executiveCode: c.executive_code || '',
      state: c.state || '',
      segment: c.segment || '',
      subSegment: c.sub_segment || '',
      executive: c.executive_name || '',
      salesRep: c.executive_name || '',
      salesArea: c.state ? `${c.state}` : '',
      address: c.customer_address || '',
      gstNumber: c.gst_no || '',
      creditDays: c.credit_days || '',
      keyAccount: c.key_account || '',
      previousWbc: 'N/A',
      previousWbcOffer: 'N/A',
    }));

    return { data: mapped, total, page, limit };
  }

  /**
   * Fetch and structure customer's offer history (Active, Expired, Extended, Pending)
   */
  async getCustomerOffers(customerCode: string, customerName?: string) {
    const rawOffers = await this.customerRepo.getCustomerOffers(customerCode, customerName);

    const now = new Date();

    const formatDate = (d: any) => (d ? new Date(d).toISOString().split('T')[0] : '');

    const active: any[] = [];
    const expired: any[] = [];
    const extended: any[] = [];
    const pending: any[] = [];
    const all: any[] = [];

    for (const r of rawOffers) {
      const endDate = r.effective_end_date ? new Date(r.effective_end_date) : (r.end_date ? new Date(r.end_date) : null);
      const isExpired = endDate ? endDate < now : false;
      const isExtended = String(r.offer_type || '').toLowerCase().includes('extend') || String(r.offer_closure_status || '').toUpperCase() === 'EXTENDED';

      const item = {
        offerId: r.offer_id,
        offerCode: r.offer_code || `WBC-${r.offer_id}`,
        offerType: r.offer_type || 'Standard',
        status: r.offer_status || 'Draft',
        startDate: formatDate(r.start_date),
        endDate: formatDate(r.end_date),
        effectiveEndDate: formatDate(r.effective_end_date),
        tenure: r.contract_tenure || '12',
        volumeCommitment: String(r.tot_volume_commitment || '0'),
        grossMargin: String(r.total_gross_margin || '0'),
        closureStatus: r.offer_closure_status || '',
        customerName: r.customer_name || '',
        segment: r.segment || '',
      };

      all.push(item);
      if (isExtended) {
        extended.push(item);
      } else if (isExpired) {
        expired.push(item);
      } else if (r.offer_status === 'Draft' || r.offer_status === 'D') {
        pending.push(item);
      } else {
        active.push(item);
      }
    }

    return {
      customerCode,
      totalCount: all.length,
      activeOffers: active,
      expiredOffers: expired,
      extendedOffers: extended,
      pendingOffers: pending,
      allOffers: all,
    };
  }
}