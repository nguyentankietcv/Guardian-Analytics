import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  AlertTriangle, 
  ShieldAlert, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2,
  Database,
  Cpu,
  BarChart3,
  UserCheck,
  Bot,
  Gavel
} from "lucide-react";
import { dashboardStats, mockVerdicts } from "@/lib/mockData";

export default function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "rejected": return "bg-destructive text-destructive-foreground";
      case "reviewing": return "bg-orange-500 text-white";
      case "pending": return "bg-yellow-500 text-white";
      case "approved": return "bg-[#00A307] text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#090909]" data-testid="text-page-title">Dashboard</h1>
          <p className="text-base text-[#9F9F9F]">Real-time transaction monitoring and fraud detection</p>
        </div>
        <Badge variant="outline" className="gap-1 border-[#00A307] text-[#00A307]" data-testid="badge-live">
          <span className="w-2 h-2 rounded-full bg-[#00A307] animate-pulse" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-total-transactions">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-transactions">{dashboardStats.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-[#00A307] mr-1" />
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-flagged">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500" data-testid="stat-flagged">{dashboardStats.flaggedTransactions}</div>
            <p className="text-xs text-muted-foreground">Requiring review</p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-alerts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Verdicts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="stat-active-alerts">{dashboardStats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Pending decision</p>
          </CardContent>
        </Card>

        <Card data-testid="card-pending-reviews">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LLM Reviews</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-pending-reviews">{dashboardStats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">AI-assisted queue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-fraud-detected">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Fraud</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.fraudDetected}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-destructive h-2 rounded-full" style={{ width: `${(dashboardStats.fraudDetected / dashboardStats.flaggedTransactions) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-rule-flagged">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rule-Flagged</CardTitle>
            <Gavel className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.ruleFlagged}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(dashboardStats.ruleFlagged / dashboardStats.flaggedTransactions) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-ai-flagged">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI-Flagged</CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.aiFlagged}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${(dashboardStats.aiFlagged / dashboardStats.flaggedTransactions) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-pipeline">
          <CardHeader>
            <CardTitle>Detection Pipeline</CardTitle>
            <CardDescription>Real-time processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />
              <div className="space-y-4 relative">
                <div className="flex items-center gap-4" data-testid="pipeline-step-normalization">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center z-10">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-normalization">Data Normalization</span>
                      <Badge variant="outline" className="text-[#00A307]" data-testid="badge-status-normalization">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Processing incoming streams</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-deduplication">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center z-10">
                    <Activity className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-deduplication">Deduplication Check</span>
                      <Badge variant="outline" className="text-[#00A307]" data-testid="badge-status-deduplication">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Identifying duplicate transactions</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-rule-fraud">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center z-10">
                    <Gavel className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-rule-fraud">Rule-based Fraud Check</span>
                      <Badge variant="outline" className="text-[#00A307]" data-testid="badge-status-rule-fraud">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dashboardStats.ruleFlagged} rule violations detected</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-ai-fraud">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center z-10">
                    <Cpu className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-ai-fraud">AI-based Fraud Check</span>
                      <Badge variant="outline" className="text-[#00A307]" data-testid="badge-status-ai-fraud">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">XGBoost + Random Forest + Neural Net ensemble</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-flagging">
                  <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center z-10">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-flagging">Flagging Service</span>
                      <Badge variant="outline" className="text-[#00A307]" data-testid="badge-status-flagging">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dashboardStats.flaggedTransactions} flagged this session</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-dashboard">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center z-10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-dashboard">LLM-Assist Human Review</span>
                      <Badge variant="outline" className="text-[#00A307]" data-testid="badge-status-dashboard">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dashboardStats.pendingReviews} pending reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-recent-verdicts">
          <CardHeader>
            <CardTitle>Recent Verdicts</CardTitle>
            <CardDescription>Latest flagged transactions with scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVerdicts.slice(0, 5).map((verdict) => (
                <div key={verdict.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50" data-testid={`card-recent-verdict-${verdict.id}`}>
                  <div className="mt-0.5">
                    {verdict.ai_flagged && verdict.rule_flagged ? (
                      <ShieldAlert className="w-4 h-4 text-destructive" />
                    ) : verdict.ai_flagged ? (
                      <Cpu className="w-4 h-4 text-purple-500" />
                    ) : (
                      <Gavel className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm font-mono" data-testid={`text-verdict-txn-${verdict.id}`}>{verdict.Transaction_ID}</span>
                      <Badge className={getStatusColor(verdict.status)} data-testid={`badge-status-${verdict.id}`}>
                        {verdict.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs">
                      <span className="text-muted-foreground">Ensemble: <span className="font-semibold text-foreground">{(verdict.ensemble_score * 100).toFixed(0)}%</span></span>
                      <span className="text-muted-foreground">Rule: <span className="font-semibold text-foreground">{(verdict.rule_fraud_score * 100).toFixed(0)}%</span></span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2" data-testid={`text-verdict-reason-${verdict.id}`}>{verdict.reason_trail}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span data-testid={`text-verdict-time-${verdict.id}`}>{new Date(verdict.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-approval-rate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#00A307]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00A307]">{dashboardStats.approvalRate}%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-ensemble">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Ensemble Score</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(dashboardStats.avgEnsembleScore * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">AI model confidence</p>
          </CardContent>
        </Card>

        <Card data-testid="card-risk-score">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(dashboardStats.avgRiskScore * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Transaction risk level</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
