import React from 'react';
import {
  Building2,
  Receipt,
  TrendingUp,
  Wallet,
  BadgeCheck,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { CommissionChart } from '@/components/dashboard/CommissionChart';
import { CompaniesChart } from '@/components/dashboard/CompaniesChart';
import { mockStats, mockMonthlyData, formatCurrency } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your referral performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Companies Referred"
          value={mockStats.totalCompanies.toString()}
          icon={Building2}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Transactions"
          value={mockStats.totalTransactions.toString()}
          icon={Receipt}
          variant="default"
        />
        <StatCard
          title="Total Commission"
          value={formatCurrency(mockStats.totalCommission)}
          subtitle="40% of revenue"
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title="Available Balance"
          value={formatCurrency(mockStats.availableBalance)}
          subtitle="Ready for payout"
          icon={Wallet}
          variant="accent"
        />
        <StatCard
          title="Paid Commission"
          value={formatCurrency(mockStats.paidCommission)}
          subtitle="Lifetime earnings"
          icon={BadgeCheck}
          variant="default"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CommissionChart data={mockMonthlyData} />
        <CompaniesChart data={mockMonthlyData} />
      </div>

      {/* Quick Actions */}
      <div className="stat-card animate-fade-in">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/referral-link"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-secondary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Share Link</p>
              <p className="text-sm text-muted-foreground">Get your referral URL</p>
            </div>
          </a>
          <a
            href="/companies"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-secondary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Receipt className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">View Companies</p>
              <p className="text-sm text-muted-foreground">See referred businesses</p>
            </div>
          </a>
          <a
            href="/transactions"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-secondary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <TrendingUp className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="font-medium text-foreground">Transactions</p>
              <p className="text-sm text-muted-foreground">Commission history</p>
            </div>
          </a>
          <a
            href="/payouts"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-secondary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Wallet className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-foreground">Payouts</p>
              <p className="text-sm text-muted-foreground">Check payout status</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
