import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp,
  Clock,
  CheckCircle2,
  Database,
  Cpu,
  BarChart3,
  UserCheck,
  Gavel,
  Activity,
  RefreshCcw,
  Search
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RefreshControls from "@/components/RefreshControls";
import { fetchDashboardStats, fetchRecentVerdicts, fetchTrends, fetchSystemHealth, type DashboardStats, type RecentVerdict, type TrendData, type SystemHealth } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Dashboard() {
  const [refreshInterval, setRefreshInterval] = useState(0);
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading, isFetching: statsFetching, isError: statsError, refetch: refetchStats } = useQuery<DashboardStats | null>({
    queryKey: ["/dashboard/stats"],
    queryFn: fetchDashboardStats,
    refetchInterval: refreshInterval || false,
  });

  const { data: recentVerdicts, isLoading: verdictsLoading, isError: verdictsError, refetch: refetchVerdicts } = useQuery<RecentVerdict[]>({
    queryKey: ["/dashboard/recent"],
    queryFn: () => fetchRecentVerdicts(5),
    refetchInterval: refreshInterval || false,
  });

  const { data: trends, isLoading: trendsLoading, isError: trendsError, refetch: refetchTrends } = useQuery<TrendData>({
    queryKey: ["/dashboard/trends"],
    queryFn: fetchTrends,
    refetchInterval: refreshInterval || false,
  });

  const { data: systemHealth, isLoading: healthLoading, isError: healthError, refetch: refetchHealth } = useQuery<SystemHealth>({
    queryKey: ["/system/health"],
    queryFn: fetchSystemHealth,
    refetchInterval: refreshInterval || false,
  });

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/dashboard/stats"] });
    queryClient.invalidateQueries({ queryKey: ["/dashboard/recent"] });
    queryClient.invalidateQueries({ queryKey: ["/dashboard/trends"] });
    queryClient.invalidateQueries({ queryKey: ["/system/health"] });
  };

  const chartData = trends?.labels?.map((label, index) => ({
    time: label,
    transactions: trends.datasets?.[0]?.data?.[index] || 0,
    fraud: trends.datasets?.[1]?.data?.[index] || 0,
  })) || [];

  const getModuleStatus = (moduleName: string): "ONLINE" | "OFFLINE" | undefined => {
    return systemHealth?.modules?.[moduleName];
  };

  const getStatusBadge = (moduleName: string) => {
    if (healthLoading) return <Skeleton className="h-5 w-12" />;
    const status = getModuleStatus(moduleName);
    if (status === "ONLINE") {
      return <Badge variant="outline" className="text-[#00A307] border-[#00A307]">Online</Badge>;
    } else if (status === "OFFLINE") {
      return <Badge variant="outline" className="text-destructive border-destructive">Offline</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground">Unknown</Badge>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FRAUD": return "bg-destructive text-destructive-foreground";
      case "WARN": return "bg-orange-500 text-white";
      case "SAFE": return "bg-[#00A307] text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const safeStats = stats || {
    total_transactions: 0,
    flagged_transactions: 0,
    active_verdicts: 0,
    confirmed_fraud: 0,
    approval_rate: 0,
    avg_ensemble_score: 0,
    avg_risk_score: 0,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-[#090909]" data-testid="text-page-title">Dashboard</h1>
          <p className="text-base text-[#9F9F9F]">Real-time transaction monitoring and fraud detection</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshControls
            refreshInterval={refreshInterval}
            onRefreshIntervalChange={setRefreshInterval}
            onManualRefresh={handleManualRefresh}
            isRefreshing={statsFetching}
          />
          <Badge variant="outline" className="gap-1 border-[#00A307] text-[#00A307]" data-testid="badge-live">
            <span className="w-2 h-2 rounded-full bg-[#00A307] animate-pulse" />
            Live
          </Badge>
        </div>
      </div>

      {(statsError || verdictsError || trendsError || healthError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>Unable to fetch data from the API. Make sure the backend is running at localhost:9000.</span>
            <Button variant="outline" size="sm" onClick={() => { refetchStats(); refetchVerdicts(); refetchTrends(); refetchHealth(); }}>
              <RefreshCcw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-total-transactions">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold" data-testid="stat-total-transactions">
                  {safeStats.total_transactions?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-[#00A307] mr-1" />
                  +12% from last hour
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-flagged">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-500" data-testid="stat-flagged">
                  {safeStats.flagged_transactions || 0}
                </div>
                <p className="text-xs text-muted-foreground">Requiring review</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-active-alerts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Verdicts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-destructive" data-testid="stat-active-alerts">
                  {safeStats.active_verdicts || 0}
                </div>
                <p className="text-xs text-muted-foreground">Pending decision</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-pending-reviews">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Fraud</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-primary" data-testid="stat-pending-reviews">
                  {safeStats.confirmed_fraud || 0}
                </div>
                <p className="text-xs text-muted-foreground">Fraud confirmed</p>
              </>
            )}
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
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#00A307]">
                  {safeStats.approval_rate?.toFixed(1) || 0}%
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-avg-ensemble">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Ensemble Score</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {((safeStats.avg_ensemble_score || 0) * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground">AI model confidence</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-risk-score">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {((safeStats.avg_risk_score || 0) * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground">Transaction risk level</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-trends" className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <CardTitle>Transaction & Fraud Trends (24h)</CardTitle>
              <CardDescription>Hourly transaction volume and fraud incidents</CardDescription>
            </div>
            {systemHealth && (
              <Badge 
                variant="outline" 
                className={systemHealth.system_state === "HEALTHY" ? "text-[#00A307] border-[#00A307]" : "text-orange-500 border-orange-500"}
              >
                System: {systemHealth.system_state}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {trendsLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  name="Total Transactions"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="fraud" 
                  name="Fraud Incidents"
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No trend data available
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-pipeline">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <CardTitle>Detection Pipeline</CardTitle>
                <CardDescription>Real-time processing status from /system/health</CardDescription>
              </div>
              {systemHealth && (
                <Badge 
                  variant="outline" 
                  className={systemHealth.system_state === "HEALTHY" ? "text-[#00A307] border-[#00A307]" : "text-orange-500 border-orange-500"}
                >
                  {Object.values(systemHealth.modules || {}).filter(s => s === "ONLINE").length}/{Object.keys(systemHealth.modules || {}).length} Online
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />
              <div className="space-y-4 relative">
                <div className="flex items-center gap-4" data-testid="pipeline-step-ingestion">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center z-10">
                    <Database className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">Data Ingestion</span>
                      {getStatusBadge("module_ingestion")}
                    </div>
                    <p className="text-sm text-muted-foreground">Receiving transaction streams</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-preprocessing">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center z-10">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">Preprocessing</span>
                      {getStatusBadge("module_preprocessing")}
                    </div>
                    <p className="text-sm text-muted-foreground">Data normalization & validation</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-deduplication">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center z-10">
                    <Search className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">Deduplication Check</span>
                      {getStatusBadge("module_deduplication")}
                    </div>
                    <p className="text-sm text-muted-foreground">Identifying duplicate transactions</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-rule-check">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center z-10">
                    <Gavel className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">Rule-based Fraud Check</span>
                      {getStatusBadge("module_rule_check")}
                    </div>
                    <p className="text-sm text-muted-foreground">Rule violations detected</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-ai-check">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center z-10">
                    <Cpu className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">AI-based Fraud Check</span>
                      {getStatusBadge("module_ai_check")}
                    </div>
                    <p className="text-sm text-muted-foreground">XGBoost + Random Forest + Neural Net ensemble</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-flagger">
                  <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center z-10">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">Flagging Service</span>
                      {getStatusBadge("module_flagger")}
                    </div>
                    <p className="text-sm text-muted-foreground">{safeStats.flagged_transactions || 0} flagged this session</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-query">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center z-10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">Query Service</span>
                      {getStatusBadge("module_query")}
                    </div>
                    <p className="text-sm text-muted-foreground">Dashboard API & LLM Review</p>
                  </div>
                </div>

                <div className="flex items-center gap-4" data-testid="pipeline-step-logging">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
                    <Activity className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium">Logging Service</span>
                      {getStatusBadge("module_logging")}
                    </div>
                    <p className="text-sm text-muted-foreground">System monitoring & logs</p>
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
              {verdictsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Skeleton className="w-4 h-4 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              ) : recentVerdicts && recentVerdicts.length > 0 ? (
                recentVerdicts.map((verdict, index) => (
                  <div key={verdict.Transaction_ID} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50" data-testid={`card-recent-verdict-${index}`}>
                    <div className="mt-0.5">
                      <ShieldAlert className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm font-mono" data-testid={`text-verdict-txn-${index}`}>{verdict.Transaction_ID}</span>
                        <Badge className={getStatusColor(verdict.status)} data-testid={`badge-status-${index}`}>
                          {verdict.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs">
                        <span className="text-muted-foreground">Ensemble: <span className="font-semibold text-foreground">{((verdict.ensemble_score || 0) * 100).toFixed(0)}%</span></span>
                        <span className="text-muted-foreground">Rule: <span className="font-semibold text-foreground">{((verdict.rule_fraud_score || 0) * 100).toFixed(0)}%</span></span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>${(verdict.Transaction_Amount || 0).toLocaleString()}</span>
                        <span>{verdict.Location}</span>
                        <span>{verdict.Transaction_Type}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span data-testid={`text-verdict-time-${index}`}>{verdict.created_at ? new Date(verdict.created_at).toLocaleString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent verdicts available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
