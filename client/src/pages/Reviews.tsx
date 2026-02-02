import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  MapPin,
  CreditCard
} from "lucide-react";
import RefreshControls from "@/components/RefreshControls";
import { fetchReviews, updateVerdict, type Review } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Reviews() {
  const [refreshInterval, setRefreshInterval] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reviews, isLoading, isFetching } = useQuery<Review[]>({
    queryKey: ["/reviews"],
    queryFn: fetchReviews,
    refetchInterval: refreshInterval || false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ transactionId, action }: { transactionId: string; action: "APPROVE" | "BLOCK" }) =>
      updateVerdict(transactionId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/alerts"] });
      toast({ title: "Verdict updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update verdict", variant: "destructive" });
    },
  });

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/reviews"] });
  };

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

  const reviewsList = reviews || [];
  const pendingReviews = reviewsList.filter((r) => r.status === "WARN");
  const avgScore = reviewsList.length > 0 
    ? reviewsList.reduce((sum, r) => sum + (r.ensemble_score || 0), 0) / reviewsList.length 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-[#090909]" data-testid="text-page-title">Human Review Queue</h1>
          <p className="text-base text-[#9F9F9F]">LLM-assisted transaction review with AI analysis</p>
        </div>
        <div className="flex items-center gap-3">
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
                <div className="text-2xl font-bold text-orange-500">{pendingReviews.length}</div>
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
                <div className="text-2xl font-bold text-primary">{reviewsList.length}</div>
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
                      <span className="text-xs text-muted-foreground">Ensemble Score:</span>
                      <span className={getEnsembleColor(review.ensemble_score || 0)} data-testid={`text-score-${index}`}>
                        {((review.ensemble_score || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
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
                        <span className="text-muted-foreground flex items-center gap-1">
                          <CreditCard className="w-3 h-3" /> Card Age:
                        </span>
                        <p className="font-medium">{review.Card_Age || 0} days</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-border">
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
                      <div>
                        <span className="text-muted-foreground">User:</span>
                        <p className="font-medium font-mono">{review.User_ID}</p>
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
                        onClick={() => updateMutation.mutate({ transactionId: review.Transaction_ID, action: "BLOCK" })}
                        disabled={updateMutation.isPending || review.status !== "WARN"}
                        data-testid={`button-block-${index}`}
                      >
                        <XCircle className="w-4 h-4 mr-1 text-destructive" />
                        Block
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateMutation.mutate({ transactionId: review.Transaction_ID, action: "APPROVE" })}
                        disabled={updateMutation.isPending || review.status !== "WARN"}
                        data-testid={`button-approve-${index}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-investigate-${index}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
