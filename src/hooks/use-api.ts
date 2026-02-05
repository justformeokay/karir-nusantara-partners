import { useState, useEffect, useCallback } from 'react';
import {
  api,
  DashboardStatsResponse,
  MonthlyDataResponse,
  ReferralInfoResponse,
  CompanyResponse,
  CompanySummaryResponse,
  TransactionResponse,
  PayoutInfoResponse,
} from '@/lib/api';

// Generic hook for API calls
interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useApi<T>(
  fetcher: () => Promise<{ success: boolean; data?: T; error?: { message: string } }>,
  deps: unknown[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetcher();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Dashboard Stats Hook
export function useDashboardStats(): UseApiState<DashboardStatsResponse> {
  return useApi(() => api.getDashboardStats(), []);
}

// Monthly Data Hook
export function useMonthlyData(): UseApiState<MonthlyDataResponse[]> {
  return useApi(() => api.getMonthlyData(), []);
}

// Referral Info Hook
export function useReferralInfo(): UseApiState<ReferralInfoResponse> {
  return useApi(() => api.getReferralInfo(), []);
}

// Companies Hook with pagination and filters
interface UseCompaniesState {
  companies: CompanyResponse[];
  summary: CompanySummaryResponse | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  refetch: () => Promise<void>;
}

export function useCompanies(): UseCompaniesState {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [summary, setSummary] = useState<CompanySummaryResponse | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [companiesRes, summaryRes] = await Promise.all([
        api.getCompanies(page, 15, status, search),
        api.getCompaniesSummary(),
      ]);

      if (companiesRes.success && companiesRes.data) {
        setCompanies(companiesRes.data.companies || []);
        setPagination({
          currentPage: companiesRes.data.pagination.current_page,
          totalPages: companiesRes.data.pagination.total_pages,
          totalItems: companiesRes.data.pagination.total_items,
        });
      } else {
        setError(companiesRes.error?.message || 'Failed to fetch companies');
      }

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    companies,
    summary,
    pagination,
    isLoading,
    error,
    setPage,
    setSearch: (s: string) => {
      setSearch(s);
      setPage(1);
    },
    setStatus: (s: string) => {
      setStatus(s);
      setPage(1);
    },
    refetch: fetchData,
  };
}

// Transactions Hook with pagination and filters
interface UseTransactionsState {
  transactions: TransactionResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  totals: {
    pending: number;
    paid: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setStatus: (status: string) => void;
  refetch: () => Promise<void>;
}

export function useTransactions(): UseTransactionsState {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });
  const [totals, setTotals] = useState({ pending: 0, paid: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getTransactions(page, 15, status);

      if (response.success && response.data) {
        const txs = response.data.transactions || [];
        setTransactions(txs);
        setPagination({
          currentPage: response.data.pagination.current_page,
          totalPages: response.data.pagination.total_pages,
          totalItems: response.data.pagination.total_items,
        });

        // Calculate totals
        const pending = txs
          .filter((t) => t.status === 'pending' || t.status === 'approved')
          .reduce((sum, t) => sum + t.commission_amount, 0);
        const paid = txs
          .filter((t) => t.status === 'paid')
          .reduce((sum, t) => sum + t.commission_amount, 0);
        setTotals({ pending, paid, total: pending + paid });
      } else {
        setError(response.error?.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    transactions,
    pagination,
    totals,
    isLoading,
    error,
    setPage,
    setStatus: (s: string) => {
      setStatus(s);
      setPage(1);
    },
    refetch: fetchData,
  };
}

// Payout Info Hook
export function usePayoutInfo(): UseApiState<PayoutInfoResponse> {
  return useApi(() => api.getPayoutInfo(), []);
}
