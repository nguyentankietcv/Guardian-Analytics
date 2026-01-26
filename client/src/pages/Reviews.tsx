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
  ArrowRight
} from "lucide-react";
import { mockReviews, mockTransactions, type ReviewItem } from "@/lib/mockData";

export default function Reviews() {
  const getPriorityBadge = (priority: ReviewItem["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-destructive text-destructive-foreground">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-orange-500 text-white">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500 text-white">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: ReviewItem["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>;
      case "in_review":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">In Review</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-green-500 text-green-600">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-500";
    if (confidence >= 75) return "text-blue-500";
    if (confidence >= 50) return "text-yellow-500";
    return "text-orange-500";
  };

  const getTransaction = (transactionId: string) => {
    return mockTransactions.find(t => t.transactionId === transactionId);
  };

  const pendingReviews = mockReviews.filter(r => r.status === "pending");
  const inProgressReviews = mockReviews.filter(r => r.status === "in_review");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Human Review Queue</h1>
          <p className="text-muted-foreground">LLM-assisted transaction review with AI recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
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
            <CardTitle className="text-sm font-medium">Avg AI Confidence</CardTitle>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockReviews.reduce((sum, r) => sum + r.confidence, 0) / mockReviews.length)}%
            </div>
            <p className="text-xs text-muted-foreground">LLM recommendation accuracy</p>
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
            AI-analyzed transactions requiring human verification. Review LLM suggestions and make final decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockReviews.map((review) => {
              const transaction = getTransaction(review.transactionId);
              return (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border bg-card"
                  data-testid={`card-review-${review.id}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{review.id}</span>
                      {getPriorityBadge(review.priority)}
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">AI Confidence:</span>
                      <span className={`font-bold ${getConfidenceColor(review.confidence)}`} data-testid={`text-confidence-${review.id}`}>
                        {review.confidence}%
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
                          <span className="text-muted-foreground">ID:</span>
                          <p className="font-medium">{transaction.transactionId}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <p className="font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: transaction.currency,
                            }).format(transaction.amount)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sender:</span>
                          <p className="font-medium truncate" title={transaction.sender}>{transaction.sender}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk Score:</span>
                          <p className="font-bold text-destructive">{transaction.riskScore}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm text-primary">LLM Recommendation</span>
                    </div>
                    <p className="text-sm text-foreground" data-testid={`text-suggestion-${review.id}`}>
                      {review.llmSuggestion}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(review.createdAt).toLocaleString()}
                      </span>
                      {review.assignee && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {review.assignee}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-reject-${review.id}`}>
                        <XCircle className="w-4 h-4 mr-1 text-destructive" />
                        Reject
                      </Button>
                      <Button size="sm" data-testid={`button-approve-${review.id}`}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-investigate-${review.id}`}>
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
