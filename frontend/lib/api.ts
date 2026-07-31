// Centralized API Client for NestJS Backend Connection
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('odt_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API Connection Fallback] Endpoint ${endpoint} unreachable:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    fetchApi<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => fetchApi<any>('/auth/profile'),

  // Master Data
  getStreams: () => fetchApi<any[]>('/master-data/streams'),
  getChannels: (streamCode?: string) =>
    fetchApi<any[]>(`/master-data/channels${streamCode ? `?streamCode=${streamCode}` : ''}`),
  getZones: () => fetchApi<any[]>('/master-data/zones'),
  getRegions: (zoneCode?: string) =>
    fetchApi<any[]>(`/master-data/regions${zoneCode ? `?zoneCode=${zoneCode}` : ''}`),
  getCustomers: (params?: Record<string, string>) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return fetchApi<any>(`/customers/search${query ? `?${query}` : ''}`).then((res: any) =>
      Array.isArray(res) ? res : res?.data || []
    );
  },
  getSkus: (search?: string, stream?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (stream) params.append('stream', stream);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<any>(`/items/search${query}`).then((res: any) =>
      Array.isArray(res) ? res : res?.data || []
    );
  },

  // Offers
  getOffers: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi<{ total: number; data: any[] }>(`/offers${query ? `?${query}` : ''}`);
  },
  getPipelineS2: () => fetchApi<any>('/offers/pipeline-s2'),
  getOfferById: (id: string | number) => fetchApi<any>(`/offers/${id}`),
  createOffer: (dto: any) =>
    fetchApi<any>('/offers', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  submitOffer: (id: string | number) =>
    fetchApi<any>(`/offers/${id}/submit`, { method: 'POST' }),
  approveOfferLevel: (id: string | number, level: string, comments?: string) =>
    fetchApi<any>(`/offers/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ level, comments }),
    }),
  rejectOffer: (id: string | number, reason: string) =>
    fetchApi<any>(`/offers/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  cancelOffer: (id: string | number, reason: string) =>
    fetchApi<any>(`/offers/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  extendOffer: (id: string | number, extensionData: { extensionMonths: number; newEndDate: string; remarks?: string }) =>
    fetchApi<any>(`/offers/${id}/extend`, {
      method: 'POST',
      body: JSON.stringify(extensionData),
    }),
  submitClosure: (id: string | number, closureData: any) =>
    fetchApi<any>(`/offers/${id}/closure`, {
      method: 'POST',
      body: JSON.stringify(closureData),
    }),

  // Offer Management (DOFA & Dollar Update)
  getDofaMatrices: () => fetchApi<any[]>('/offer-management/dofa-approval-flow'),
  createDofaMatrix: (data: any) =>
    fetchApi<any>('/offer-management/dofa-approval-flow', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getDollarRates: () => fetchApi<any[]>('/offer-management/dollar-update'),
  createDollarRate: (data: any) =>
    fetchApi<any>('/offer-management/dollar-update', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Input Management
  getMasterRecords: () => fetchApi<any[]>('/input-management'),
  uploadMasterFile: (data: { masterType: string; uploadedBy?: string; filename: string }) =>
    fetchApi<any>('/input-management/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Offer Letters
  getOfferLetters: () => fetchApi<any[]>('/offer-letters'),
  generateOfferLetter: (offerId: string | number) =>
    fetchApi<any>(`/offer-letters/generate/${offerId}`, { method: 'POST' }),

  // Reports & Analytics
  getDashboardStats: () => fetchApi<any>('/reports/dashboard-stats'),
  getCommercialSummary: () => fetchApi<any>('/reports/commercial-summary'),

  // Notifications
  getNotifications: () => fetchApi<any[]>('/notifications/inbox'),
  markNotificationRead: (id: number) =>
    fetchApi<any>(`/notifications/${id}/read`, { method: 'POST' }),

  // Multi-step Offer Creation & PCA Business Logic
  saveStep1Data: (payload: any) =>
    fetchApi<any>('/offers/step1', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  saveStep2Data: (payload: any) =>
    fetchApi<any>('/offers/step2', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  saveStep3Data: (payload: any) =>
    fetchApi<any>('/offers/step3', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  saveOfferDraft: (payload: { offerId?: number; step: number; payload: any }) =>
    fetchApi<any>('/offers/draft', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitOfferForApproval: (payload: { offerId: number; remarks?: string }) =>
    fetchApi<any>('/offers/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getPcaAnalysis: (payload: any) =>
    fetchApi<any>('/financials/pca-analysis', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Previous WBC Workflow APIs
  getPreviousWbcOffers: (executiveCode?: string) => {
    const query = executiveCode ? `?executiveCode=${encodeURIComponent(executiveCode)}` : '';
    return fetchApi<{ success: boolean; data: any[] }>(`/offers/previous-wbc${query}`);
  },

  getPreviousWbcOfferDetails: (offerId: string | number) => {
    return fetchApi<{ success: boolean; data: any }>(`/offers/previous-wbc/${offerId}`);
  },

  // Offer History Structured Lookup
  lookupPreviousOffer: (payload: {
    customerCode?: string;
    custId?: string;
    executiveCode?: string;
    customerName?: string;
  }) => {
    const params = new URLSearchParams();
    if (payload.customerCode) params.append('customerCode', payload.customerCode);
    if (payload.custId) params.append('custId', payload.custId);
    if (payload.executiveCode) params.append('executiveCode', payload.executiveCode);
    if (payload.customerName) params.append('customerName', payload.customerName);

    return fetchApi<{
      success: boolean;
      hasPreviousOffer: boolean;
      previousOffer: any;
      offerHistory: any[];
    }>(`/offers/history/lookup?${params.toString()}`);
  },

  getOfferHistory: (param: string) =>
    fetchApi<any>(`/offers/history/${encodeURIComponent(param)}`),

  getOfferHistoryByCustomer: (param: string) => {
    return fetchApi<any>(`/offers/history/${encodeURIComponent(param)}`);
  },

  getOfferHistoryByCustomerName: (customerName: string) => {
    return fetchApi<any>(`/offers/history/lookup?customerName=${encodeURIComponent(customerName)}`);
  },

  getOfferHistoryByCustomerCode: (customerCode: string) => {
    return fetchApi<any>(`/offers/history/lookup?customerCode=${encodeURIComponent(customerCode)}`);
  },

  getOfferHistoryByCustId: (custId: string) => {
    return fetchApi<any>(`/offers/history/lookup?custId=${encodeURIComponent(custId)}`);
  },

  // Offer Validation
  validateOffer: (offerId: number) =>
    fetchApi<any>(`/offers/${offerId}/validate`, { method: 'POST' }),

  // Offer Letter Download
  getOfferLetterUrl: (offerId: number) =>
    `${API_BASE_URL}/offers/${offerId}/generate-letter`,
};
