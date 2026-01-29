import React, { useState, useMemo } from 'react';
import { Search, Receipt, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTransactions, formatCurrency, formatDate } from '@/lib/mock-data';

const ITEMS_PER_PAGE = 15;

const Transactions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      const matchesSearch = transaction.companyName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || transaction.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totals = useMemo(() => {
    const pending = filteredTransactions
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + t.commission, 0);
    const paid = filteredTransactions
      .filter((t) => t.status === 'paid')
      .reduce((sum, t) => sum + t.commission, 0);
    return { pending, paid, total: pending + paid };
  }, [filteredTransactions]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Transaction History</h1>
        <p className="mt-1 text-muted-foreground">
          View all transactions and commission earnings
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3 animate-fade-in">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Commission</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totals.total)}</p>
        </div>
        <div className="stat-card border-l-4 border-l-warning">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-warning">{formatCurrency(totals.pending)}</p>
        </div>
        <div className="stat-card border-l-4 border-l-success">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(totals.paid)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-in">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Job Quota</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Commission (40%)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Receipt className="h-8 w-8" />
                    <p>No transactions found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.companyName}</TableCell>
                  <TableCell className="text-right">{transaction.jobQuota}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {formatCurrency(transaction.commission)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.status === 'paid' ? 'success' : 'warning'}
                    >
                      {transaction.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
