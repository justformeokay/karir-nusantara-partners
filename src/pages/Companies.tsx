import React, { useState } from 'react';
import { Search, Building2, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/mock-data';
import { useCompanies } from '@/hooks/use-api';

const Companies: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const { 
    companies, 
    summary, 
    pagination, 
    isLoading, 
    error, 
    setPage, 
    setSearch 
  } = useCompanies();

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      setSearch(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  if (isLoading && companies.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12" />
        <p>Failed to load companies data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Referred Companies</h1>
        <p className="mt-1 text-muted-foreground">
          Companies that registered through your referral link
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3 animate-fade-in">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Companies</p>
          <p className="text-2xl font-bold text-foreground">{summary?.total_companies || 0}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Revenue Generated</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(summary?.total_revenue || 0)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Commission (40%)</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(summary?.total_commission || 0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Company</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Job Posts</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Commission (40%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Building2 className="h-8 w-8" />
                    <p>No companies found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Building2 className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <span className="font-medium">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(company.registration_date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.status === 'active' ? 'active' : 'inactive'}>
                      {company.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {company.total_job_posts}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(company.total_revenue)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {formatCurrency(company.commission_earned)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} companies)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
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

export default Companies;
