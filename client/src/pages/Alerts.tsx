import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import RefreshControls from "@/components/RefreshControls";
import { fetchAlerts, updateVerdict, type Alert } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Alerts() {
  const [refreshInterval, setRefreshInterval] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: alerts, isLoading, isFetching } = useQuery<Alert[]>({
    queryKey: ["/alerts"],
    queryFn: () => fetchAlerts(0.7),
    refetchInterval: refreshInterval || false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ transactionId, action }: { transactionId: string; action: "APPROVE" | "BLOCK" }) =>
      updateVerdict(transactionId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/alerts"] });
      toast({ title: "Verdict updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update verdict", variant: "destructive" });
    },
  });

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/alerts"] });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WARN":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Warning</Badge>;
      case "FRAUD":
        return <Badge className="bg-destructive text-destructive-foreground">Fraud</Badge>;
      case "SAFE":
        return <Badge variant="outline" className="border-[#00A307] text-[#00A307]">Safe</Badge>;
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

  const alertsList = alerts || [];
  const criticalAlerts = alertsList.filter((a) => a.ensemble_score >= 0.9);
  const highAlerts = alertsList.filter((a) => a.ensemble_score >= 0.7 && a.ensemble_score < 0.9);
  const reviewingAlerts = alertsList.filter((a) => a.status === "WARN");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-[#090909]" data-testid="text-page-title">Alerts</h1>
          <p className="text-base text-[#9F9F9F]">Flagged transactions requiring review</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshControls
            refreshInterval={refreshInterval}
            onRefreshIntervalChange={setRefreshInterval}
            onManualRefresh={handleManualRefresh}
            isRefreshing={isFetching}
          />
          <Badge variant="outline" className="gap-1 border-destructive text-destructive">
            <AlertTriangle className="w-3 h-3" />
            {alertsList.length} Active
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
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-destructive">{criticalAlerts.length}</div>
                <p className="text-xs text-muted-foreground">Immediate action required</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-high-alerts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority (70-90%)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-500">{highAlerts.length}</div>
                <p className="text-xs text-muted-foreground">Review within 1 hour</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-reviewing">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-primary">{reviewingAlerts.length}</div>
                <p className="text-xs text-muted-foreground">Currently being analyzed</p>
              </>
            )}
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-5 h-5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              ))
            ) : alertsList.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No flagged transactions found
              </div>
            ) : (
              alertsList.map((alert, index) => (
                <div
                  key={alert.Transaction_ID}
                  className="p-4 rounded-lg border bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                  data-testid={`card-alert-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      <ShieldAlert className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-semibold font-mono">{alert.Transaction_ID}</span>
                        {getEnsembleScoreBadge(alert.ensemble_score || 0)}
                        {getStatusBadge(alert.status)}
                        <Badge variant="outline" className="gap-1">
                          <Gavel className="w-3 h-3" />
                          Rule
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Cpu className="w-3 h-3" />
                          AI
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm mb-2 text-muted-foreground flex-wrap">
                        <span>Amount: <span className="font-semibold text-foreground">${(alert.Transaction_Amount || 0).toLocaleString()}</span></span>
                        <span>Location: <span className="font-medium text-foreground">{alert.Location}</span></span>
                        <span>Type: <span className="font-medium text-foreground">{alert.Transaction_Type}</span></span>
                      </div>
                      
                      <p className="text-sm text-foreground mb-2">{alert.reason_trail || "No reason trail available"}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.Timestamp ? new Date(alert.Timestamp).toLocaleString() : 'N/A'}
                        </span>
                        <span>Rule Score: <span className="font-semibold">{((alert.rule_fraud_score || 0) * 100).toFixed(0)}%</span></span>
                        {alert.model_scores && (
                          <span>Model Scores: XGB {((alert.model_scores.xgboost || 0) * 100).toFixed(0)}% | RF {((alert.model_scores.random_forest || 0) * 100).toFixed(0)}% | NN {((alert.model_scores.neural_net || 0) * 100).toFixed(0)}%</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateMutation.mutate({ transactionId: alert.Transaction_ID, action: "APPROVE" })}
                        disabled={updateMutation.isPending}
                        data-testid={`button-approve-${index}`}
                      >
                        <CheckCircle className="h-4 w-4 text-[#00A307]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateMutation.mutate({ transactionId: alert.Transaction_ID, action: "BLOCK" })}
                        disabled={updateMutation.isPending}
                        data-testid={`button-reject-${index}`}
                      >
                        <XCircle className="h-4 w-4 text-destructive" />
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
