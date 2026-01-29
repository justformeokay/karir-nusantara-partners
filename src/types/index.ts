export interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  accountStatus: 'active' | 'inactive' | 'pending';
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  totalJobPosts: number;
  totalRevenue: number;
  commissionEarned: number;
}

export interface Transaction {
  id: string;
  date: string;
  companyName: string;
  companyId: string;
  jobQuota: number;
  amount: number;
  commission: number;
  status: 'pending' | 'paid';
}

export interface DashboardStats {
  totalCompanies: number;
  totalTransactions: number;
  totalCommission: number;
  availableBalance: number;
  paidCommission: number;
}

export interface MonthlyData {
  month: string;
  commission: number;
  companies: number;
}

export interface PayoutInfo {
  availableBalance: number;
  pendingPayout: number;
  paidAmount: number;
  lastPayoutDate?: string;
}
