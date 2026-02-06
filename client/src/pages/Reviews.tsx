import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Sparkles,
  MapPin,
  CreditCard,
  Eye,
  Search
} from "lucide-react";
import RefreshControls from "@/components/RefreshControls";
import Pagination from "@/components/Pagination";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";
import { fetchReviews, approveReview, type Review, type PaginatedResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_REFRESH_INTERVAL = 30000;

export default function Reviews() {
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const { data, isLoading, isFetching } = useQuery<PaginatedResponse<Review>>({
    queryKey: ["/reviews", page, perPage, debouncedSearch, pendingOnly],
    queryFn: () => fetchReviews({
      page,
      perPage,
      search: debouncedSearch || undefined,
      status: pendingOnly ? "WARN" : undefined,
      sortBy: "ensemble_score",
      sortOrder: "desc",
    }),
    refetchInterval: refreshInterval || false,
  });

  const approveMutation = useMutation({
    mutationFn: ({ transactionId, approved }: { transactionId: string; approved: boolean }) => {
      const notes = reviewerNotes[transactionId];
      return approveReview(transactionId, approved, notes);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/dashboard/stats"] });
      toast({ 
        title: variables.approved ? "Transaction approved (marked SAFE)" : "Transaction blocked (marked FRAUD)" 
      });
      setReviewerNotes((prev) => {
        const updated = { ...prev };
        delete updated[variables.transactionId];
        return updated;
      });
    },
  });

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/reviews"] });
  };

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WARN":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>;
      case "FRAUD":
        return <Badge className="bg-destructive text-destructive-foreground">Blocked</Badge>;
      case "SAFE":
        return <Badge variant="outline" className="border-[#00A307] text-[#00A307]">Approved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEnsembleColor = (score: number) => {
    if (score >= 0.9) return "text-destructive font-bold";
    if (score >= 0.7) return "text-orange-500 font-semibold";
    if (score >= 0.5) return "text-yellow-600";
    return "text-[#00A307]";
  };

  const getPriorityFromScore = (score: number) => {
    if (score >= 0.9) return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>;
    if (score >= 0.7) return <Badge className="bg-orange-500 text-white">High</Badge>;
    if (score >= 0.5) return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
    return <Badge className="bg-blue-500 text-white">Low</Badge>;
  };

  const reviewsList = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  
  const pendingReviews = reviewsList.filter((r) => r.status === "WARN").length;
  const avgScore = reviewsList.length > 0 
    ? reviewsList.reduce((sum, r) => sum + (r.ensemble_score || 0), 0) / reviewsList.length 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground" data-testid="text-page-title">Human Review Queue</h1>
          <p className="text-base text-muted-foreground">LLM-assisted transaction review with AI analysis</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 w-56"
              data-testid="input-search-reviews"
            />
          </div>
          <Button
            variant={pendingOnly ? "default" : "outline"}
            size="sm"
            onClick={() => { setPendingOnly(!pendingOnly); setPage(1); }}
            data-testid="button-pending-only"
          >
            Pending Only
          </Button>
          <RefreshControls
            refreshInterval={refreshInterval}
            onRefreshIntervalChange={setRefreshInterval}
            onManualRefresh={handleManualRefresh}
            isRefreshing={isFetching}
          />
          <Badge variant="outline" className="gap-1 border-primary text-primary">
            <Brain className="w-3 h-3" />
            AI-Powered
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-pending-count">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-500">{pendingReviews}</div>
                <p className="text-xs text-muted-foreground">Awaiting human decision</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-in-progress-count">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total In Queue</CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-primary">{totalItems}</div>
                <p className="text-xs text-muted-foreground">LLM-analyzed transactions</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-avg-confidence">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Ensemble Score</CardTitle>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{(avgScore * 100).toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground">AI fraud confidence</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-review-queue">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Review Queue
          </CardTitle>
          <CardDescription>
            AI-analyzed transactions with detailed LLM explanations. Review analysis and make final decisions.
            Approve marks as SAFE, Block marks as FRAUD.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border bg-card">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))
            ) : reviewsList.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No reviews in queue
              </div>
            ) : (
              reviewsList.map((review, index) => (
                <div
                  key={review.Transaction_ID}
                  className="p-4 rounded-lg border bg-card"
                  data-testid={`card-review-${index}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold font-mono">{review.Transaction_ID}</span>
                      {getPriorityFromScore(review.ensemble_score || 0)}
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setSelectedReview(review); setDetailsOpen(true); }}
                        data-testid={`button-view-${index}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">Ensemble Score:</span>
                      <span className={getEnsembleColor(review.ensemble_score || 0)} data-testid={`text-score-${index}`}>
                        {((review.ensemble_score || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Transaction Details</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <p className="font-semibold">${(review.Transaction_Amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{review.Transaction_Type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Location:
                        </span>
                        <p className="font-medium">{review.Location}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Card Type:</span>
                        <p className="font-medium">{review.Card_Type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-border">
                      <div>
                        <span className="text-muted-foreground">Card Age:</span>
                        <p className="font-medium">{review.Card_Age || 0} days</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Daily Count:</span>
                        <p className="font-medium">{review.Daily_Transaction_Count || 0} txns</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Distance:</span>
                        <p className="font-medium">{(review.Transaction_Distance || 0).toLocaleString()} km</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Auth Method:</span>
                        <p className="font-medium">{review.Authentication_Method}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-border">
                      <div>
                        <span className="text-muted-foreground">Device Type:</span>
                        <p className="font-medium">{review.Device_Type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Merchant:</span>
                        <p className="font-medium">{review.Merchant_Category}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">User:</span>
                        <p className="font-medium font-mono">{review.User_ID}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rule Fraud Score:</span>
                        <p className="font-medium">{((review.rule_fraud_score || 0) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm text-primary">LLM Analysis</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed" data-testid={`text-analysis-${index}`}>
                      {review.llm_analysis || "No LLM analysis available"}
                    </p>
                  </div>

                  {review.status === "WARN" && (
                    <div className="mb-4">
                      <Label htmlFor={`notes-${review.Transaction_ID}`} className="text-sm font-medium">
                        Reviewer Notes (Optional)
                      </Label>
                      <Textarea
                        id={`notes-${review.Transaction_ID}`}
                        placeholder="Add your notes about this transaction..."
                        value={reviewerNotes[review.Transaction_ID] || ""}
                        onChange={(e) => setReviewerNotes(prev => ({ ...prev, [review.Transaction_ID]: e.target.value }))}
                        className="mt-1 min-h-[60px]"
                        data-testid={`textarea-notes-${index}`}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {review.reviewed_at ? new Date(review.reviewed_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => approveMutation.mutate({ transactionId: review.Transaction_ID, approved: false })}
                        disabled={approveMutation.isPending || review.status !== "WARN"}
                        data-testid={`button-block-${index}`}
                      >
                        <XCircle className="w-4 h-4 mr-1 text-destructive" />
                        Block (FRAUD)
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate({ transactionId: review.Transaction_ID, approved: true })}
                        disabled={approveMutation.isPending || review.status !== "WARN"}
                        data-testid={`button-approve-${index}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve (SAFE)
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={(newPerPage) => { setPerPage(newPerPage); setPage(1); }}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <TransactionDetailsModal
        transaction={selectedReview as any}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}
