import { User, Company, Transaction, DashboardStats, MonthlyData, PayoutInfo } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Ahmad Pratama',
  email: 'ahmad.pratama@email.com',
  referralCode: 'AHMAD2024',
  accountStatus: 'active',
  bankAccount: {
    bankName: 'Bank Central Asia',
    accountNumber: '****4521',
    accountHolder: 'Ahmad Pratama',
  },
  createdAt: '2024-01-15',
};

export const mockStats: DashboardStats = {
  totalCompanies: 24,
  totalTransactions: 156,
  totalCommission: 47850000,
  availableBalance: 12500000,
  paidCommission: 35350000,
};

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Jul', commission: 3200000, companies: 2 },
  { month: 'Aug', commission: 4500000, companies: 3 },
  { month: 'Sep', commission: 5100000, companies: 4 },
  { month: 'Oct', commission: 6800000, companies: 5 },
  { month: 'Nov', commission: 8200000, companies: 4 },
  { month: 'Dec', commission: 9500000, companies: 6 },
  { month: 'Jan', commission: 10550000, companies: 5 },
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'PT Teknologi Maju',
    registrationDate: '2024-01-20',
    status: 'active',
    totalJobPosts: 45,
    totalRevenue: 22500000,
    commissionEarned: 9000000,
  },
  {
    id: '2',
    name: 'CV Kreatif Digital',
    registrationDate: '2024-02-05',
    status: 'active',
    totalJobPosts: 28,
    totalRevenue: 14000000,
    commissionEarned: 5600000,
  },
  {
    id: '3',
    name: 'PT Solusi Bisnis',
    registrationDate: '2024-02-18',
    status: 'active',
    totalJobPosts: 32,
    totalRevenue: 16000000,
    commissionEarned: 6400000,
  },
  {
    id: '4',
    name: 'PT Global Inovasi',
    registrationDate: '2024-03-10',
    status: 'inactive',
    totalJobPosts: 12,
    totalRevenue: 6000000,
    commissionEarned: 2400000,
  },
  {
    id: '5',
    name: 'CV Sukses Mandiri',
    registrationDate: '2024-03-22',
    status: 'active',
    totalJobPosts: 22,
    totalRevenue: 11000000,
    commissionEarned: 4400000,
  },
  {
    id: '6',
    name: 'PT Karya Nusantara',
    registrationDate: '2024-04-05',
    status: 'active',
    totalJobPosts: 38,
    totalRevenue: 19000000,
    commissionEarned: 7600000,
  },
  {
    id: '7',
    name: 'CV Digital Prima',
    registrationDate: '2024-04-18',
    status: 'active',
    totalJobPosts: 15,
    totalRevenue: 7500000,
    commissionEarned: 3000000,
  },
  {
    id: '8',
    name: 'PT Mitra Sejahtera',
    registrationDate: '2024-05-02',
    status: 'inactive',
    totalJobPosts: 8,
    totalRevenue: 4000000,
    commissionEarned: 1600000,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-01-28',
    companyName: 'PT Teknologi Maju',
    companyId: '1',
    jobQuota: 10,
    amount: 5000000,
    commission: 2000000,
    status: 'pending',
  },
  {
    id: '2',
    date: '2025-01-25',
    companyName: 'CV Kreatif Digital',
    companyId: '2',
    jobQuota: 5,
    amount: 2500000,
    commission: 1000000,
    status: 'pending',
  },
  {
    id: '3',
    date: '2025-01-20',
    companyName: 'PT Solusi Bisnis',
    companyId: '3',
    jobQuota: 15,
    amount: 7500000,
    commission: 3000000,
    status: 'paid',
  },
  {
    id: '4',
    date: '2025-01-15',
    companyName: 'PT Karya Nusantara',
    companyId: '6',
    jobQuota: 8,
    amount: 4000000,
    commission: 1600000,
    status: 'paid',
  },
  {
    id: '5',
    date: '2025-01-10',
    companyName: 'CV Digital Prima',
    companyId: '7',
    jobQuota: 5,
    amount: 2500000,
    commission: 1000000,
    status: 'paid',
  },
  {
    id: '6',
    date: '2025-01-05',
    companyName: 'PT Teknologi Maju',
    companyId: '1',
    jobQuota: 20,
    amount: 10000000,
    commission: 4000000,
    status: 'paid',
  },
  {
    id: '7',
    date: '2024-12-28',
    companyName: 'CV Sukses Mandiri',
    companyId: '5',
    jobQuota: 12,
    amount: 6000000,
    commission: 2400000,
    status: 'paid',
  },
  {
    id: '8',
    date: '2024-12-20',
    companyName: 'PT Global Inovasi',
    companyId: '4',
    jobQuota: 6,
    amount: 3000000,
    commission: 1200000,
    status: 'paid',
  },
];

export const mockPayoutInfo: PayoutInfo = {
  availableBalance: 12500000,
  pendingPayout: 3000000,
  paidAmount: 35350000,
  lastPayoutDate: '2025-01-20',
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
