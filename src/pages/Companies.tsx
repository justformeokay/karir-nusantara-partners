import React, { useState, useMemo } from 'react';
import { Search, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { mockCompanies, formatCurrency, formatDate } from '@/lib/mock-data';

const ITEMS_PER_PAGE = 15;

const Companies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalStats = useMemo(() => {
    return filteredCompanies.reduce(
      (acc, company) => ({
        totalRevenue: acc.totalRevenue + company.totalRevenue,
        totalCommission: acc.totalCommission + company.commissionEarned,
        totalJobPosts: acc.totalJobPosts + company.totalJobPosts,
      }),
      { totalRevenue: 0, totalCommission: 0, totalJobPosts: 0 }
    );
  }, [filteredCompanies]);

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
          <p className="text-2xl font-bold text-foreground">{filteredCompanies.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Revenue Generated</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalStats.totalRevenue)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Commission (40%)</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalStats.totalCommission)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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
            {paginatedCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Building2 className="h-8 w-8" />
                    <p>No companies found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCompanies.map((company) => (
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
                    {formatDate(company.registrationDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.status === 'active' ? 'active' : 'inactive'}>
                      {company.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {company.totalJobPosts}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(company.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {formatCurrency(company.commissionEarned)}
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
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)} of{' '}
              {filteredCompanies.length} companies
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

export default Companies;
