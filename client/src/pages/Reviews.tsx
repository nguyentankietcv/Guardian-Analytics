import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { mockLLMReviews, mockTransactions, type LLMReview } from "@/lib/mockData";

export default function Reviews() {
  const getStatusBadge = (status: LLMReview["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>;
      case "in_review":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">In Review</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-[#00A307] text-[#00A307]">Completed</Badge>;
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

  const getTransaction = (transactionId: string) => {
    return mockTransactions.find(t => t.Transaction_ID === transactionId);
  };

  const pendingReviews = mockLLMReviews.filter(r => r.status === "pending");
  const inProgressReviews = mockLLMReviews.filter(r => r.status === "in_review");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#090909]" data-testid="text-page-title">Human Review Queue</h1>
          <p className="text-base text-[#9F9F9F]">LLM-assisted transaction review with AI analysis</p>
        </div>
        <div className="flex items-center gap-2">
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
            <div className="text-2xl font-bold text-orange-500">{pendingReviews.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting human decision</p>
          </CardContent>
        </Card>

        <Card data-testid="card-in-progress-count">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{inProgressReviews.length}</div>
            <p className="text-xs text-muted-foreground">Currently being reviewed</p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-confidence">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Ensemble Score</CardTitle>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(mockLLMReviews.reduce((sum, r) => sum + r.ensemble_score, 0) / mockLLMReviews.length * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">AI fraud confidence</p>
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
            {mockLLMReviews.map((review) => {
              const transaction = getTransaction(review.Transaction_ID);
              return (
                <div
                  key={review.Transaction_ID}
                  className="p-4 rounded-lg border bg-card"
                  data-testid={`card-review-${review.Transaction_ID}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold font-mono">{review.Transaction_ID}</span>
                      {getPriorityFromScore(review.ensemble_score)}
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Ensemble Score:</span>
                      <span className={getEnsembleColor(review.ensemble_score)} data-testid={`text-score-${review.Transaction_ID}`}>
                        {(review.ensemble_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {transaction && (
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-sm">Transaction Details</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <p className="font-semibold">${transaction.Transaction_Amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium">{transaction.Transaction_Type}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Location:
                          </span>
                          <p className="font-medium">{transaction.Location}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> Card:
                          </span>
                          <p className="font-medium">{transaction.Card_Type} ({transaction.Card_Age} days old)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-border">
                        <div>
                          <span className="text-muted-foreground">Risk Score:</span>
                          <p className={`font-bold ${transaction.Risk_Score >= 0.7 ? 'text-destructive' : 'text-foreground'}`}>
                            {(transaction.Risk_Score * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Daily Count:</span>
                          <p className="font-medium">{transaction.Daily_Transaction_Count} txns</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Distance:</span>
                          <p className="font-medium">{transaction.Transaction_Distance.toLocaleString()} km</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Auth Method:</span>
                          <p className="font-medium">{transaction.Authentication_Method}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm text-primary">LLM Analysis</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed" data-testid={`text-analysis-${review.Transaction_ID}`}>
                      {review.llm_analysis}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(review.reviewed_at).toLocaleString()}
                      </span>
                      <span className="font-mono">{review.User_ID}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-reject-${review.Transaction_ID}`}>
                        <XCircle className="w-4 h-4 mr-1 text-destructive" />
                        Block
                      </Button>
                      <Button size="sm" data-testid={`button-approve-${review.Transaction_ID}`}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-investigate-${review.Transaction_ID}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
