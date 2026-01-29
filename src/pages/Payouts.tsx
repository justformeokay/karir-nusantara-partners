import React from 'react';
import {
  Wallet,
  Clock,
  CheckCircle2,
  CreditCard,
  Download,
  Bell,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPayoutInfo, mockUser, formatCurrency, formatDate } from '@/lib/mock-data';
import { toast } from 'sonner';

const Payouts: React.FC = () => {
  const handleDownload = (type: 'pdf' | 'csv') => {
    toast.success(`Downloading ${type.toUpperCase()} report...`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Payout Information</h1>
        <p className="mt-1 text-muted-foreground">
          View your balance and payout status
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-3 animate-fade-in">
        <div className="stat-card border-l-4 border-l-primary">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Available Balance</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(mockPayoutInfo.availableBalance)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Ready for payout</p>
        </div>

        <div className="stat-card border-l-4 border-l-warning">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Pending Payout</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(mockPayoutInfo.pendingPayout)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Processing</p>
        </div>

        <div className="stat-card border-l-4 border-l-success">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Paid Amount</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(mockPayoutInfo.paidAmount)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Lifetime earnings</p>
        </div>
      </div>

      {/* Payout Method & Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payout Method */}
        <div className="stat-card animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <CreditCard className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Payout Method</h2>
                <p className="text-sm text-muted-foreground">Your registered bank account</p>
              </div>
            </div>
            <Badge variant="success">Verified</Badge>
          </div>

          {mockUser.bankAccount ? (
            <div className="space-y-4 rounded-lg bg-secondary/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bank Name</span>
                <span className="text-sm font-medium">{mockUser.bankAccount.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account Number</span>
                <span className="text-sm font-medium font-mono">
                  {mockUser.bankAccount.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account Holder</span>
                <span className="text-sm font-medium">{mockUser.bankAccount.accountHolder}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <CreditCard className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No bank account registered
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Contact admin to update bank information</span>
          </div>
        </div>

        {/* Download Reports */}
        <div className="stat-card animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <Download className="h-6 w-6 text-info" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Download Reports</h2>
              <p className="text-sm text-muted-foreground">Export your payout history</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDownload('pdf')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF Summary
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDownload('csv')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV Export
            </Button>
          </div>

          {mockPayoutInfo.lastPayoutDate && (
            <p className="mt-4 text-sm text-muted-foreground">
              Last payout: {formatDate(mockPayoutInfo.lastPayoutDate)}
            </p>
          )}
        </div>
      </div>

      {/* Recent Notification */}
      <div className="stat-card animate-fade-in bg-success/5 border-success/20">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-success/10">
            <Bell className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Payout Completed!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your commission of {formatCurrency(7600000)} has been transferred to your bank
              account on {formatDate('2025-01-20')}.
            </p>
          </div>
        </div>
      </div>

      {/* Payout Schedule Info */}
      <div className="stat-card animate-fade-in">
        <h3 className="font-semibold text-foreground mb-4">Payout Schedule</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Processing Day</p>
            <p className="mt-1 font-medium">Every 20th</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Minimum Payout</p>
            <p className="mt-1 font-medium">{formatCurrency(500000)}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Transfer Time</p>
            <p className="mt-1 font-medium">1-3 Business Days</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Commission Rate</p>
            <p className="mt-1 font-medium">40% of Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payouts;
