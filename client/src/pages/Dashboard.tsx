import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  AlertTriangle, 
  ShieldAlert, 
  Copy, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2,
  Database,
  Cpu,
  BarChart3,
  UserCheck
} from "lucide-react";
import { dashboardStats, mockAlerts } from "@/lib/mockData";

export default function Dashboard() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "fraud": return <ShieldAlert className="w-4 h-4" />;
      case "duplicate": return <Copy className="w-4 h-4" />;
      case "anomaly": return <Activity className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Dashboard</h1>
          <p className="text-muted-foreground">Real-time transaction monitoring and fraud detection</p>
        </div>
        <Badge variant="outline" className="gap-1" data-testid="badge-live">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
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
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="stat-active-alerts">{dashboardStats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">5 critical, 7 high</p>
          </CardContent>
        </Card>

        <Card data-testid="card-pending-reviews">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-pending-reviews">{dashboardStats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">LLM-assisted queue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-fraud-detected">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Detected</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.fraudDetected}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-destructive h-2 rounded-full" style={{ width: "21%" }} />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-duplicates">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duplicates Found</CardTitle>
            <Copy className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.duplicatesFound}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: "30%" }} />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-anomalies">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
            <Activity className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.anomaliesDetected}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "48%" }} />
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
                      <Badge variant="outline" className="text-green-600" data-testid="badge-status-normalization">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Processing incoming streams</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-deduplication">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center z-10">
                    <Copy className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-deduplication">Deduplication Check</span>
                      <Badge variant="outline" className="text-green-600" data-testid="badge-status-deduplication">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">7 duplicates flagged today</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-rule-fraud">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center z-10">
                    <Cpu className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-rule-fraud">Rule-based Fraud Check</span>
                      <Badge variant="outline" className="text-green-600" data-testid="badge-status-rule-fraud">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">156 rules evaluated</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-ai-fraud">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center z-10">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-ai-fraud">AI-based Fraud Check</span>
                      <Badge variant="outline" className="text-green-600" data-testid="badge-status-ai-fraud">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">ML model v2.4.1</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-flagging">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center z-10">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-flagging">Flagging Service</span>
                      <Badge variant="outline" className="text-green-600" data-testid="badge-status-flagging">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">23 flagged this session</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-dashboard">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center z-10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium" data-testid="text-pipeline-dashboard">User Dashboard</span>
                      <Badge variant="outline" className="text-green-600" data-testid="badge-status-dashboard">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Visual analytics & monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-recent-alerts">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest flagged transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50" data-testid={`card-recent-alert-${alert.id}`}>
                  <div className="mt-0.5">
                    {getAlertTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm" data-testid={`text-alert-txn-${alert.id}`}>{alert.transactionId}</span>
                      <Badge className={getSeverityColor(alert.severity)} data-testid={`badge-severity-${alert.id}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2" data-testid={`text-alert-message-${alert.id}`}>{alert.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span data-testid={`text-alert-time-${alert.id}`}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
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
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{dashboardStats.approvalRate}%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card data-testid="card-processing-time">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.avgProcessingTime}s</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card data-testid="card-risk-score">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.riskScoreAvg}</div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
