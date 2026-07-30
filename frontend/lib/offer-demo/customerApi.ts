/**
 * customerApi.ts
 * Centralized API helpers for the Offer Creation Demo.
 * Calls the live NestJS backend for customer search, offer history, and SKU search.
 */

import { Customer, PreviousOffer, PreviousOfferResult, SkuMasterItem } from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('odt_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(
  url: string,
  fallback: T,
  timeoutMs = 5000,
): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

// ── Customer field mapping ─────────────────────────────────────────────────
function mapToCustomer(c: Record<string, any>): Customer {
  return {
    id: String(c.id ?? c.cust_id ?? ''),
    name: String(c.name ?? c.customer_name ?? ''),
    businessStream: String(c.businessStream ?? c.stream ?? ''),
    customerCode: String(c.customerCode ?? c.customer_code ?? ''),
    customerType: String(c.customerType ?? c.customer_type ?? 'Direct'),
    distributorName: String(c.distributorName ?? c.db_name ?? ''),
    distributorCode: String(c.distributorCode ?? c.db_code ?? ''),
    jdeCode: String(c.jdeCode ?? c.customer_code ?? String(c.cust_id ?? c.id ?? '')),
    state: String(c.state ?? ''),
    segment: String(c.segment ?? ''),
    subSegment: String(c.subSegment ?? c.sub_segment ?? ''),
    salesRep: String(c.salesRep ?? c.executive ?? c.executive_name ?? ''),
    executive: String(c.executive ?? c.executive_name ?? ''),
    executiveCode: String(c.executiveCode ?? c.executive_code ?? ''),
    salesArea: String(c.salesArea ?? c.state ?? ''),
    address: String(c.address ?? c.customer_address ?? ''),
    previousWbc: String(c.previousWbc ?? 'N/A'),
    previousWbcOffer: String(c.previousWbcOffer ?? 'N/A'),
    gstNumber: String(c.gstNumber ?? c.gst_no ?? ''),
    creditDays: String(c.creditDays ?? c.credit_days ?? ''),
    keyAccount: String(c.keyAccount ?? c.key_account ?? ''),
  };
}

// ── Customer Search ────────────────────────────────────────────────────────

export interface CustomerSearchResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export async function searchCustomersApi(
  q: string,
  page = 1,
  limit = 25,
): Promise<CustomerSearchResponse> {
  const trimmed = q.trim();
  if (trimmed.length < 2) {
    return { data: [], total: 0, page: 1, limit };
  }

  const url = `${API_BASE}/customers/search?q=${encodeURIComponent(trimmed)}&page=${page}&limit=${limit}`;

  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('odt_token') : null;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    let rawList: any[] = [];
    let totalCount = 0;
    let pageNum = page;
    let limitNum = limit;

    if (Array.isArray(json)) {
      rawList = json;
      totalCount = json.length;
    } else if (json && typeof json === 'object') {
      // Handle response format: { success: true, data: { data: [...], total: 18614, page: 1, limit: 25 } }
      if (json.data && typeof json.data === 'object' && Array.isArray(json.data.data)) {
        rawList = json.data.data;
        totalCount = json.data.total ?? rawList.length;
        pageNum = json.data.page ?? page;
        limitNum = json.data.limit ?? limit;
      }
      // Handle response format: { success: true, data: [...] } or { data: [...], total: 18614 }
      else if (Array.isArray(json.data)) {
        rawList = json.data;
        totalCount = json.total ?? rawList.length;
        pageNum = json.page ?? page;
        limitNum = json.limit ?? limit;
      }
      // Handle response format: { result: [...] }
      else if (Array.isArray(json.result)) {
        rawList = json.result;
        totalCount = json.total ?? rawList.length;
        pageNum = json.page ?? page;
        limitNum = json.limit ?? limit;
      }
    }

    const mapped = rawList.map(mapToCustomer);
    return {
      data: mapped,
      total: totalCount,
      page: pageNum,
      limit: limitNum,
    };
  } catch (err) {
    console.error("searchCustomersApi backend request failed:", err);
    return { data: [], total: 0, page, limit };
  }
}

// ── Previous Offer History ─────────────────────────────────────────────────

export interface PreviousOfferLookupPayload {
  customerCode?: string;
  custId?: string;
  executiveCode?: string;
  customerName?: string;
}

export async function fetchPreviousOffer(
  payload: PreviousOfferLookupPayload | string,
): Promise<PreviousOfferResult> {
  const dto: PreviousOfferLookupPayload =
    typeof payload === 'string'
      ? { executiveCode: payload }
      : payload || {};

  const getStr = (val: any): string => (val !== undefined && val !== null ? String(val).trim() : '');

  const customerCodeStr = getStr(dto.customerCode);
  const custIdStr = getStr(dto.custId);
  const executiveCodeStr = getStr(dto.executiveCode);
  const customerNameStr = getStr(dto.customerName);

  const params = new URLSearchParams();
  if (customerCodeStr) params.append('customerCode', customerCodeStr);
  if (custIdStr) params.append('custId', custIdStr);
  if (executiveCodeStr) params.append('executiveCode', executiveCodeStr);
  if (customerNameStr) params.append('customerName', customerNameStr);

  const queryString = params.toString();
  if (!queryString) {
    return { found: false, message: 'No Previous Offer Found' };
  }

  const url = `${API_BASE}/offers/history/lookup?${queryString}`;
  const fallback: PreviousOfferResult = {
    found: false,
    message: 'No Previous Offer Found',
  };

  try {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    const resultPayload = json?.data?.data || json?.data || json;

    console.log("RAW RESPONSE", json);
    console.log("RESULT PAYLOAD", resultPayload);

    let targetOffer: any = null;
    let historyList: any[] = [];
    let foundReason = "";

    const payload = resultPayload;
    const rawData = payload?.data || payload;

    if (payload?.previousOffer && typeof payload.previousOffer === 'object') {
      targetOffer = payload.previousOffer;
      historyList = payload.offerHistory || payload.previousOffers || payload.history || [payload.previousOffer];
      foundReason = "Extracted from payload.previousOffer (Case 1 / Case 2)";
    } else if (rawData?.previousOffer && typeof rawData.previousOffer === 'object') {
      targetOffer = rawData.previousOffer;
      historyList = rawData.offerHistory || rawData.previousOffers || rawData.history || [rawData.previousOffer];
      foundReason = "Extracted from rawData.previousOffer";
    } else if (Array.isArray(payload?.offerHistory) && payload.offerHistory.length > 0) {
      targetOffer = payload.offerHistory[0];
      historyList = payload.offerHistory;
      foundReason = "Extracted latest offer from payload.offerHistory array (Case 5)";
    } else if (Array.isArray(rawData?.offerHistory) && rawData.offerHistory.length > 0) {
      targetOffer = rawData.offerHistory[0];
      historyList = rawData.offerHistory;
      foundReason = "Extracted latest offer from rawData.offerHistory array";
    } else if (Array.isArray(payload) && payload.length > 0) {
      targetOffer = payload[0];
      historyList = payload;
      foundReason = "Extracted latest offer from payload array";
    } else if (Array.isArray(rawData) && rawData.length > 0) {
      targetOffer = rawData[0];
      historyList = rawData;
      foundReason = "Extracted latest offer from rawData array";
    } else if (payload?.offerId || payload?.offer_id || payload?.offerCode || payload?.offer_code) {
      targetOffer = payload;
      historyList = [payload];
      foundReason = "Payload itself is a direct Offer object (Case 3 / Case 4)";
    } else if (rawData?.offerId || rawData?.offer_id || rawData?.offerCode || rawData?.offer_code) {
      targetOffer = rawData;
      historyList = [rawData];
      foundReason = "rawData itself is a direct Offer object";
    } else if (json?.previousOffer && typeof json.previousOffer === 'object') {
      targetOffer = json.previousOffer;
      historyList = json.offerHistory || [json.previousOffer];
      foundReason = "Extracted from json.previousOffer";
    } else if (Array.isArray(json?.offerHistory) && json.offerHistory.length > 0) {
      targetOffer = json.offerHistory[0];
      historyList = json.offerHistory;
      foundReason = "Extracted latest offer from json.offerHistory array";
    }

    if (targetOffer && typeof targetOffer === 'object') {
      const parsedSkus = Array.isArray(targetOffer.previousSkuDetails) && targetOffer.previousSkuDetails.length > 0
        ? targetOffer.previousSkuDetails
        : (Array.isArray(targetOffer.skus) && targetOffer.skus.length > 0 
          ? targetOffer.skus 
          : (Array.isArray(targetOffer.previousSkus) ? targetOffer.previousSkus : []));

      const normalizedResponse: PreviousOffer = {
        found: true,
        offerId: Number(targetOffer.offerId ?? targetOffer.offer_id ?? 0),
        offerCode: String(targetOffer.offerCode ?? targetOffer.offer_code ?? ''),
        offerType: String(targetOffer.offerType ?? targetOffer.offer_type ?? targetOffer.stream ?? ''),
        offerStatus: String(targetOffer.offerStatus ?? targetOffer.offer_status ?? ''),
        startDate: targetOffer.startDate ?? targetOffer.start_date ?? null,
        endDate: targetOffer.endDate ?? targetOffer.end_date ?? null,
        contractTenure: String(targetOffer.contractTenure ?? targetOffer.contract_tenure ?? '12'),
        contractVolume: Number(targetOffer.contractVolume ?? targetOffer.contract_vol ?? targetOffer.volumeCommitment ?? targetOffer.tot_volume_commitment ?? 0),
        volumeCommitment: Number(targetOffer.volumeCommitment ?? targetOffer.tot_volume_commitment ?? targetOffer.contractVolume ?? targetOffer.contract_vol ?? 0),
        totalGrossMargin: Number(targetOffer.totalGrossMargin ?? targetOffer.total_gross_margin ?? 0),
        investment: Number(targetOffer.investment ?? targetOffer.totalGrossMargin ?? targetOffer.total_gross_margin ?? 0),
        gmpl: Number(targetOffer.gmpl ?? 0),
        gmplDofa: String(targetOffer.gmplDofa ?? targetOffer.gmpl_dofa ?? ''),
        totalCustLvlInput: Number(targetOffer.totalCustLvlInput ?? targetOffer.total_cust_lvl_input ?? 0),
        totalNetPrice: Number(targetOffer.totalNetPrice ?? targetOffer.total_net_price ?? 0),
        customerName: String(targetOffer.customerName ?? targetOffer.customer_name_text ?? ''),
        executiveCode: String(targetOffer.executiveCode ?? targetOffer.executive_code ?? ''),
        remark: String(targetOffer.remark ?? ''),
        AR_SEOL_current: Number(targetOffer.AR_SEOL_current ?? targetOffer.ar_seol_current ?? targetOffer.arSeol ?? 0),
        total_investment_current: Number(targetOffer.total_investment_current ?? targetOffer.totalInvestment ?? targetOffer.total_investment ?? targetOffer.previousInvestment ?? 0),
        rs_l_investment_current: Number(targetOffer.rs_l_investment_current ?? targetOffer.rsLtrInvestment ?? targetOffer.investmentRate ?? targetOffer.rsPerLitre ?? 0),
        gmpl_current: Number(targetOffer.gmpl_current ?? targetOffer.gmpl ?? 0),
        arSeol: Number(targetOffer.AR_SEOL_current ?? targetOffer.arSeol ?? targetOffer.totalCustLvlInput ?? 0),
        totalInvestment: Number(targetOffer.total_investment_current ?? targetOffer.totalInvestment ?? targetOffer.previousInvestment ?? 0),
        rsLtrInvestment: Number(targetOffer.rs_l_investment_current ?? targetOffer.rsLtrInvestment ?? targetOffer.investmentRate ?? targetOffer.rsPerLitre ?? 0),
        investmentRate: Number(targetOffer.rs_l_investment_current ?? targetOffer.investmentRate ?? targetOffer.rsLtrInvestment ?? 0),
        skus: parsedSkus,
        previousSkus: parsedSkus,
        previousSkuDetails: parsedSkus,
        historicalPackage: targetOffer.historicalPackage || payload?.historicalPackage || json?.historicalPackage || null,
        customerPerformance: targetOffer.customerPerformance || payload?.customerPerformance || json?.customerPerformance || null,
        previousContract: targetOffer.previousContract || payload?.previousContract || json?.previousContract || null,
        previousOfferSummary: targetOffer.previousOfferSummary || payload?.previousOfferSummary || json?.previousOfferSummary || null,
        data: targetOffer,
        history: historyList.length > 0 ? historyList : [],
      };

      console.log("RAW RESPONSE", json);
      console.log("RESULT PAYLOAD", resultPayload);
      console.log("NORMALIZED RESPONSE", normalizedResponse);
      console.log("TYPE OF NORMALIZED RESPONSE", typeof normalizedResponse);
      console.log("FOUND FLAG", normalizedResponse.found);
      console.log("OFFER ID", normalizedResponse.offerId);
      console.log("HISTORY LENGTH", normalizedResponse.history.length);
      console.log("[fetchPreviousOffer Normalization]", {
        rawResponse: json,
        resultPayload,
        normalizedResponse,
        found: true,
        offerId: normalizedResponse.offerId,
        historyCount: normalizedResponse.history.length,
        reason: foundReason,
      });

      return normalizedResponse;
    }

    console.log("RAW RESPONSE", json);
    console.log("RESULT PAYLOAD", resultPayload);
    console.log("NORMALIZED RESPONSE", fallback);
    console.log("TYPE OF NORMALIZED RESPONSE", typeof fallback);
    console.log("FOUND FLAG", fallback.found);
    console.log("[fetchPreviousOffer Normalization]", {
      rawResponse: json,
      resultPayload,
      normalizedResponse: fallback,
      found: false,
      reason: "No valid previous offer structure or offer array found in backend response",
    });
    return fallback;
  } catch (err) {
    console.error("[fetchPreviousOffer Network/Error]", err);
    return fallback;
  }
}

// ── SKU / Item Master Search ───────────────────────────────────────────────

export interface SkuSearchResponse {
  data: SkuMasterItem[];
  total: number;
  page: number;
  limit: number;
}

export async function searchSkusApi(
  q: string,
  stream = '',
  page = 1,
  limit = 30,
): Promise<SkuSearchResponse> {
  const params = new URLSearchParams({
    q: q.trim(),
    ...(stream ? { stream } : {}),
    page: String(page),
    limit: String(limit),
  });

  const url = `${API_BASE}/items/search?${params.toString()}`;
  const fallback: SkuSearchResponse = {
    data: [],
    total: 0,
    page,
    limit,
  };

  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('odt_token') : null;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return fallback;

    const json = await res.json();

    let rawList: any[] = [];
    let totalCount = 0;
    let pageNum = page;
    let limitNum = limit;

    if (Array.isArray(json)) {
      rawList = json;
      totalCount = json.length;
    } else if (json && typeof json === 'object') {
      if (json.data && typeof json.data === 'object' && Array.isArray(json.data.data)) {
        rawList = json.data.data;
        totalCount = json.data.total ?? rawList.length;
        pageNum = json.data.page ?? page;
        limitNum = json.data.limit ?? limit;
      } else if (Array.isArray(json.data)) {
        rawList = json.data;
        totalCount = json.total ?? rawList.length;
        pageNum = json.page ?? page;
        limitNum = json.limit ?? limit;
      }
    }

    return {
      data: rawList as SkuMasterItem[],
      total: totalCount,
      page: pageNum,
      limit: limitNum,
    };
  } catch {
    return fallback;
  }
}

// ── Customer Past Offers ───────────────────────────────────────────────────

export async function fetchCustomerOffersApi(customerCode: string, customerName?: string) {
  if (!customerCode?.trim() && !customerName?.trim()) return null;
  const code = encodeURIComponent((customerCode || 'ALL').trim());
  const nameQuery = customerName?.trim() ? `?name=${encodeURIComponent(customerName.trim())}` : '';
  const url = `${API_BASE}/customers/${code}/offers${nameQuery}`;
  try {
    const res = await fetch(url, { headers: getAuthHeaders(), signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch {
    return null;
  }
}


// ── Offer Actions (Submit / Edit / Extend) ───────────────────────────────

export async function submitOfferApi(payload: any) {
  const url = `${API_BASE}/offers/submit`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function editOfferApi(payload: any) {
  const url = `${API_BASE}/offers/edit`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function extendOfferApi(payload: any) {
  const url = `${API_BASE}/offers/extend`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ── Full Offer Creation ───────────────────────────────────────────────────

/**
 * POST /offers/create-full
 * Sends the complete Workspace form data (customer + investment + SKUs + remarks)
 * to the backend, which atomically saves odt_offer_details + wow_wo_cust_details.
 * Returns { offerId, offerCode, message, status }
 */
export async function createFullOfferApi(payload: any): Promise<{
  offerId: number;
  offerCode: string;
  message: string;
  status: string;
  error?: string;
}> {
  const url = `${API_BASE}/offers/create-full`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        offerId: 0,
        offerCode: '',
        message: json.message || 'Failed to create offer',
        status: 'ERROR',
        error: json.message || `HTTP ${res.status}`,
      };
    }
    return json.data || json;
  } catch (err: any) {
    return {
      offerId: 0,
      offerCode: '',
      message: 'Network error — could not reach backend',
      status: 'ERROR',
      error: err?.message || 'Unknown error',
    };
  }
}

/**
 * POST /offers/submit
 * Moves offer from Draft (D) → Pending Approval (P)
 */
export async function submitForApprovalApi(offerId: number): Promise<{
  offerId: number;
  status: string;
  message: string;
}> {
  const url = `${API_BASE}/offers/submit`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ offerId }),
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json();
    return json.data || json;
  } catch {
    return { offerId, status: 'ERROR', message: 'Submit failed' };
  }
}
