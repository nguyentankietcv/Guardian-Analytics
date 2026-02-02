import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Eye, MoreHorizontal, MapPin, Smartphone, ChevronLeft, ChevronRight, AlertTriangle, RefreshCcw } from "lucide-react";
import RefreshControls from "@/components/RefreshControls";
import { fetchTransactions, type TransactionRecord } from "@/lib/api";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [refreshInterval, setRefreshInterval] = useState(0);
  const perPage = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError, refetch } = useQuery<{ data: TransactionRecord[]; count: number; page: number }>({
    queryKey: ["/transactions", page, perPage, searchTerm],
    queryFn: () => fetchTransactions(page, perPage, searchTerm || undefined),
    refetchInterval: refreshInterval || false,
  });

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/transactions"] });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const transactions = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / perPage) || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FRAUD":
        return <Badge className="bg-destructive text-destructive-foreground">Fraud</Badge>;
      case "WARN":
        return <Badge className="bg-orange-500 text-white">Flagged</Badge>;
      case "SAFE":
        return <Badge variant="outline" className="text-[#00A307] border-[#00A307]">Safe</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEnsembleColor = (score: number) => {
    if (score >= 0.8) return "text-destructive font-bold";
    if (score >= 0.5) return "text-orange-500 font-semibold";
    if (score >= 0.3) return "text-yellow-600";
    return "text-[#00A307]";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-[#090909]" data-testid="text-page-title">Transactions</h1>
          <p className="text-base text-[#9F9F9F]">Monitor and review all financial transactions</p>
        </div>
        <RefreshControls
          refreshInterval={refreshInterval}
          onRefreshIntervalChange={setRefreshInterval}
          onManualRefresh={handleManualRefresh}
          isRefreshing={isFetching}
        />
      </div>

      {isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>Unable to fetch transactions. Make sure the backend is running at localhost:9000.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card data-testid="card-transactions-table">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${totalCount} total transactions`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or User..."
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <Button variant="outline" size="icon" data-testid="button-filter">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F6F6F6]">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Card</TableHead>
                  <TableHead>Ensemble Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: perPage }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction: TransactionRecord) => (
                    <TableRow key={transaction.Transaction_ID} data-testid={`row-transaction-${transaction.Transaction_ID}`}>
                      <TableCell className="font-medium font-mono text-sm" data-testid={`text-txn-id-${transaction.Transaction_ID}`}>
                        {transaction.Transaction_ID}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {transaction.User_ID}
                      </TableCell>
                      <TableCell data-testid={`text-amount-${transaction.Transaction_ID}`}>
                        <span className="font-semibold">
                          ${(transaction.Transaction_Amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Smartphone className="w-4 h-4" />
                          {transaction.Transaction_Type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {transaction.Location}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{transaction.Card_Type}</span>
                      </TableCell>
                      <TableCell>
                        <span className={getEnsembleColor(transaction.ensemble_score || 0)} data-testid={`text-score-${transaction.Transaction_ID}`}>
                          {((transaction.ensemble_score || 0) * 100).toFixed(0)}%
                        </span>
                      </TableCell>
                      <TableCell data-testid={`badge-status-${transaction.Transaction_ID}`}>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {transaction.Timestamp ? new Date(transaction.Timestamp).toLocaleString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" data-testid={`button-view-${transaction.Transaction_ID}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-more-${transaction.Transaction_ID}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} ({totalCount} total)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                data-testid="button-next-page"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
