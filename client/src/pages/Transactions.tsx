import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Eye, 
  MoreVertical, 
  Brain
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RefreshControls from "@/components/RefreshControls";
import Pagination from "@/components/Pagination";
import FilterDropdown from "@/components/FilterDropdown";
import SortableHeader from "@/components/SortableHeader";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";
import SendToLLMDialog from "@/components/SendToLLMDialog";
import { 
  fetchTransactions, 
  sendToLLM, 
  type TransactionRecord, 
  type PaginatedResponse 
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Pass", value: "PASS" },
  { label: "Flagged", value: "WARN" },
  { label: "Fraud", value: "FRAUD" },
];

const DEFAULT_REFRESH_INTERVAL = 30000;

export default function Transactions() {
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [sortBy, setSortBy] = useState("Timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [llmDialogOpen, setLlmDialogOpen] = useState(false);
  const [llmTransactionId, setLlmTransactionId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const { data, isLoading, isFetching } = useQuery<PaginatedResponse<TransactionRecord>>({
    queryKey: ["/transactions", page, perPage, debouncedSearch, statusFilter, sortBy, sortOrder],
    queryFn: () => fetchTransactions({
      page,
      perPage,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
      sortBy,
      sortOrder,
    }),
    refetchInterval: refreshInterval || false,
  });

  const llmMutation = useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: string; reason?: string }) =>
      sendToLLM(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/transactions"] });
      toast({ title: "Sent to LLM for analysis" });
      setLlmDialogOpen(false);
    },
  });

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  }, []);

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/transactions"] });
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const getScoreDisplay = (score: number) => {
    const pct = (score * 100).toFixed(0);
    if (score >= 0.8) return <Badge className="bg-destructive text-destructive-foreground">{pct}%</Badge>;
    if (score >= 0.5) return <Badge className="bg-orange-500 text-white">{pct}%</Badge>;
    return <span className="text-sm text-muted-foreground">{pct}%</span>;
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "FRAUD":
        return <Badge className="bg-destructive text-destructive-foreground">Fraud</Badge>;
      case "WARN":
        return <Badge className="bg-orange-500 text-white">Flagged</Badge>;
      case "SAFE":
        return <Badge variant="outline" className="text-[#00A307] border-[#00A307]">Safe</Badge>;
      default:
        return <span className="text-sm text-muted-foreground">PASS</span>;
    }
  };

  const transactions = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / perPage) || 1;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground" data-testid="text-page-title">Transactions</h1>
          <p className="text-base text-muted-foreground">View and search all processed transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshControls
            refreshInterval={refreshInterval}
            onRefreshIntervalChange={setRefreshInterval}
            onManualRefresh={handleManualRefresh}
            isRefreshing={isFetching}
          />
        </div>
      </div>

      <Card data-testid="card-transactions">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {totalItems.toLocaleString()} total transactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or user..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 w-64"
                  data-testid="input-search"
                />
              </div>
              <FilterDropdown
                label="Status"
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={(value) => { setStatusFilter(value); setPage(1); }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader label="Transaction ID" sortKey="Transaction_ID" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader label="User ID" sortKey="User_ID" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader label="Amount" sortKey="Transaction_Amount" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader label="Type" sortKey="Transaction_Type" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <TableHead>Location</TableHead>
                  <SortableHeader label="AI Score" sortKey="ensemble_score" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader label="Rule Score" sortKey="rule_fraud_score" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <TableHead>Status</TableHead>
                  <SortableHeader label="Timestamp" sortKey="Timestamp" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 10 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((txn, index) => (
                    <TableRow key={txn.Transaction_ID} data-testid={`row-transaction-${index}`}>
                      <TableCell className="font-mono text-sm" data-testid={`text-txn-id-${index}`}>
                        {txn.Transaction_ID}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{txn.User_ID}</TableCell>
                      <TableCell className="font-medium">
                        ${(txn.Transaction_Amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{txn.Transaction_Type}</TableCell>
                      <TableCell>{txn.Location}</TableCell>
                      <TableCell data-testid={`text-ai-score-${index}`}>{getScoreDisplay(txn.ensemble_score || 0)}</TableCell>
                      <TableCell data-testid={`text-rule-score-${index}`}>{getScoreDisplay(txn.rule_fraud_score || 0)}</TableCell>
                      <TableCell data-testid={`text-status-${index}`}>{getStatusDisplay(txn.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {txn.Timestamp ? new Date(txn.Timestamp).toLocaleString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setSelectedTransaction(txn); setDetailsOpen(true); }}
                            data-testid={`button-view-${index}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" data-testid={`button-actions-${index}`}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedTransaction(txn); setDetailsOpen(true); }}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setLlmTransactionId(txn.Transaction_ID); setLlmDialogOpen(true); }}>
                                <Brain className="h-4 w-4 mr-2" />
                                Send to LLM
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={(v) => { setPerPage(v); setPage(1); }}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />

      <SendToLLMDialog
        transactionId={llmTransactionId}
        open={llmDialogOpen}
        onClose={() => setLlmDialogOpen(false)}
        onSend={(id, reason) => llmMutation.mutate({ transactionId: id, reason })}
        isPending={llmMutation.isPending}
      />
    </div>
  );
}
