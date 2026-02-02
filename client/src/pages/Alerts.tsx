import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  Cpu, 
  Gavel, 
  Clock, 
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle
} from "lucide-react";
import { mockVerdicts, mockTransactions, type Verdict } from "@/lib/mockData";

export default function Alerts() {
  const getStatusBadge = (status: Verdict["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>;
      case "reviewing":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Reviewing</Badge>;
      case "approved":
        return <Badge variant="outline" className="border-[#00A307] text-[#00A307]">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEnsembleScoreBadge = (score: number) => {
    if (score >= 0.9) {
      return <Badge className="bg-destructive text-destructive-foreground">Critical ({(score * 100).toFixed(0)}%)</Badge>;
    }
    if (score >= 0.7) {
      return <Badge className="bg-orange-500 text-white">High ({(score * 100).toFixed(0)}%)</Badge>;
    }
    if (score >= 0.5) {
      return <Badge className="bg-yellow-500 text-white">Medium ({(score * 100).toFixed(0)}%)</Badge>;
    }
    return <Badge className="bg-blue-500 text-white">Low ({(score * 100).toFixed(0)}%)</Badge>;
  };

  const getFlagIcon = (verdict: Verdict) => {
    if (verdict.ai_flagged && verdict.rule_flagged) {
      return <ShieldAlert className="w-5 h-5 text-destructive" />;
    }
    if (verdict.ai_flagged) {
      return <Cpu className="w-5 h-5 text-purple-500" />;
    }
    return <Gavel className="w-5 h-5 text-orange-500" />;
  };

  const getFlagBgColor = (verdict: Verdict) => {
    if (verdict.ai_flagged && verdict.rule_flagged) {
      return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
    }
    if (verdict.ai_flagged) {
      return "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800";
    }
    return "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800";
  };

  const getTransaction = (transactionId: string) => {
    return mockTransactions.find(t => t.Transaction_ID === transactionId);
  };

  const pendingVerdicts = mockVerdicts.filter(v => v.status === "pending" || v.status === "reviewing");
  const criticalVerdicts = mockVerdicts.filter(v => v.ensemble_score >= 0.9);
  const highVerdicts = mockVerdicts.filter(v => v.ensemble_score >= 0.7 && v.ensemble_score < 0.9);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#090909]" data-testid="text-page-title">Alerts</h1>
          <p className="text-base text-[#9F9F9F]">Flagged transactions requiring review</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-destructive text-destructive">
            <AlertTriangle className="w-3 h-3" />
            {pendingVerdicts.length} Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-critical-alerts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical (90%+)</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {criticalVerdicts.length}
            </div>
            <p className="text-xs text-muted-foreground">Immediate action required</p>
          </CardContent>
        </Card>

        <Card data-testid="card-high-alerts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority (70-90%)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {highVerdicts.length}
            </div>
            <p className="text-xs text-muted-foreground">Review within 1 hour</p>
          </CardContent>
        </Card>

        <Card data-testid="card-reviewing">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockVerdicts.filter(v => v.status === "reviewing").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently being analyzed</p>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-alerts-list">
        <CardHeader>
          <CardTitle>Flagged Transactions</CardTitle>
          <CardDescription>All transactions flagged by rule-based or AI-based detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockVerdicts.map((verdict) => {
              const transaction = getTransaction(verdict.Transaction_ID);
              return (
                <div
                  key={verdict.id}
                  className={`p-4 rounded-lg border ${getFlagBgColor(verdict)}`}
                  data-testid={`card-verdict-${verdict.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {getFlagIcon(verdict)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-semibold font-mono">{verdict.Transaction_ID}</span>
                        {getEnsembleScoreBadge(verdict.ensemble_score)}
                        {getStatusBadge(verdict.status)}
                        {verdict.rule_flagged === 1 && (
                          <Badge variant="outline" className="gap-1">
                            <Gavel className="w-3 h-3" />
                            Rule
                          </Badge>
                        )}
                        {verdict.ai_flagged === 1 && (
                          <Badge variant="outline" className="gap-1">
                            <Cpu className="w-3 h-3" />
                            AI
                          </Badge>
                        )}
                      </div>
                      
                      {transaction && (
                        <div className="flex items-center gap-4 text-sm mb-2 text-muted-foreground">
                          <span>Amount: <span className="font-semibold text-foreground">${transaction.Transaction_Amount.toLocaleString()}</span></span>
                          <span>Location: <span className="font-medium text-foreground">{transaction.Location}</span></span>
                          <span>Type: <span className="font-medium text-foreground">{transaction.Transaction_Type}</span></span>
                        </div>
                      )}
                      
                      <p className="text-sm text-foreground mb-2">{verdict.reason_trail}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(verdict.created_at).toLocaleString()}
                        </span>
                        <span>Rule Score: <span className="font-semibold">{(verdict.rule_fraud_score * 100).toFixed(0)}%</span></span>
                        <span>Model Scores: XGB {(verdict.model_scores.xgboost * 100).toFixed(0)}% | RF {(verdict.model_scores.random_forest * 100).toFixed(0)}% | NN {(verdict.model_scores.neural_net * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" data-testid={`button-approve-${verdict.id}`}>
                        <CheckCircle className="h-4 w-4 text-[#00A307]" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-reject-${verdict.id}`}>
                        <XCircle className="h-4 w-4 text-destructive" />
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
