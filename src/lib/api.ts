// API Configuration and Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface LoginResponse {
  user: ApiUser;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  referral_code: string;
  account_status: 'active' | 'inactive' | 'pending';
  bank_account?: {
    bank_name: string;
    account_number: string;
    account_holder: string;
    is_verified: boolean;
  };
  created_at: string;
}

export interface DashboardStatsResponse {
  total_companies: number;
  total_transactions: number;
  total_commission: number;
  available_balance: number;
  paid_commission: number;
  pending_commission: number;
  commission_rate: number;
}

export interface MonthlyDataResponse {
  month: string;
  commission: number;
  companies: number;
}

export interface ReferralInfoResponse {
  referral_code: string;
  referral_link: string;
  commission_rate: number;
  total_referrals: number;
}

export interface CompanyResponse {
  id: number;
  name: string;
  registration_date: string;
  status: 'active' | 'inactive';
  total_job_posts: number;
  total_revenue: number;
  commission_earned: number;
}

export interface CompanySummaryResponse {
  total_companies: number;
  active_companies: number;
  total_revenue: number;
  total_commission: number;
}

export interface TransactionResponse {
  id: number;
  date: string;
  company_name: string;
  company_id: number;
  description: string;
  transaction_amount: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
}

export interface PayoutInfoResponse {
  balance: {
    available_balance: number;
    pending_payout: number;
    paid_amount: number;
  };
  bank_account: {
    bank_name: string;
    account_number: string;
    account_holder: string;
    is_verified: boolean;
  };
  schedule: {
    processing_day: number;
    minimum_payout: number;
    transfer_time: string;
  };
}

export interface PaginatedResponse<T> {
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  [key: string]: T[] | unknown;
}

// Token management
const TOKEN_KEY = 'partner_access_token';
const REFRESH_TOKEN_KEY = 'partner_refresh_token';
const USER_KEY = 'partner_user';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getStoredUser = (): ApiUser | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (accessToken: string, refreshToken: string, user: ApiUser): void => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = getStoredToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized - clear auth data
        if (response.status === 401) {
          clearAuthData();
          window.location.href = '/login';
        }
        return data as ApiResponse<T>;
      }

      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection.',
        },
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/partner/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request<null>('/partner/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<ApiResponse<ApiUser>> {
    return this.request<ApiUser>('/partner/profile');
  }

  async updateProfile(data: { name?: string }): Promise<ApiResponse<ApiUser>> {
    return this.request<ApiUser>('/partner/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return this.request<null>('/partner/password/change', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStatsResponse>> {
    return this.request<DashboardStatsResponse>('/partner/dashboard/stats');
  }

  async getMonthlyData(): Promise<ApiResponse<MonthlyDataResponse[]>> {
    return this.request<MonthlyDataResponse[]>('/partner/dashboard/monthly');
  }

  // Referral endpoints
  async getReferralInfo(): Promise<ApiResponse<ReferralInfoResponse>> {
    return this.request<ReferralInfoResponse>('/partner/referral');
  }

  // Companies endpoints
  async getCompanies(page = 1, limit = 15, status?: string, search?: string): Promise<ApiResponse<PaginatedResponse<CompanyResponse> & { companies: CompanyResponse[] }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    
    return this.request<PaginatedResponse<CompanyResponse> & { companies: CompanyResponse[] }>(`/partner/companies?${params}`);
  }

  async getCompaniesSummary(): Promise<ApiResponse<CompanySummaryResponse>> {
    return this.request<CompanySummaryResponse>('/partner/companies/summary');
  }

  // Transactions endpoints
  async getTransactions(page = 1, limit = 15, status?: string): Promise<ApiResponse<PaginatedResponse<TransactionResponse> & { transactions: TransactionResponse[] }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status && status !== 'all') params.append('status', status);
    
    return this.request<PaginatedResponse<TransactionResponse> & { transactions: TransactionResponse[] }>(`/partner/transactions?${params}`);
  }

  // Payouts endpoints
  async getPayoutInfo(): Promise<ApiResponse<PayoutInfoResponse>> {
    return this.request<PayoutInfoResponse>('/partner/payouts');
  }

  async getPayoutHistory(page = 1, limit = 15): Promise<ApiResponse<PaginatedResponse<unknown> & { payouts: unknown[] }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return this.request<PaginatedResponse<unknown> & { payouts: unknown[] }>(`/partner/payouts/history?${params}`);
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
