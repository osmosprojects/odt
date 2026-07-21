// Centralized API Client for NestJS Backend Connection
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    const query = new URLSearchParams(params).toString();
    return fetchApi<any[]>(`/master-data/customers${query ? `?${query}` : ''}`);
  },
  getSkus: () => fetchApi<any[]>('/master-data/skus'),

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
};
