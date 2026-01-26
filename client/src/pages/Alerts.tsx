import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  Copy, 
  Activity, 
  Clock, 
  User,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { mockAlerts, type Alert } from "@/lib/mockData";

export default function Alerts() {
  const getSeverityBadge = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500 text-white">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500 text-white">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: Alert["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Open</Badge>;
      case "investigating":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Investigating</Badge>;
      case "resolved":
        return <Badge variant="outline" className="border-green-500 text-green-600">Resolved</Badge>;
      case "dismissed":
        return <Badge variant="outline" className="text-muted-foreground">Dismissed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: Alert["type"]) => {
    switch (type) {
      case "fraud":
        return <ShieldAlert className="w-5 h-5 text-destructive" />;
      case "duplicate":
        return <Copy className="w-5 h-5 text-orange-500" />;
      case "anomaly":
        return <Activity className="w-5 h-5 text-yellow-500" />;
      default:
        return <ShieldAlert className="w-5 h-5" />;
    }
  };

  const getTypeBgColor = (type: Alert["type"]) => {
    switch (type) {
      case "fraud":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
      case "duplicate":
        return "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800";
      case "anomaly":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-muted";
    }
  };

  const openAlerts = mockAlerts.filter(a => a.status === "open" || a.status === "investigating");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Alerts</h1>
          <p className="text-muted-foreground">Risk alerts requiring attention</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            {openAlerts.length} Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-critical-alerts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockAlerts.filter(a => a.severity === "critical").length}
            </div>
            <p className="text-xs text-muted-foreground">Immediate action required</p>
          </CardContent>
        </Card>

        <Card data-testid="card-high-alerts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {mockAlerts.filter(a => a.severity === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Review within 1 hour</p>
          </CardContent>
        </Card>

        <Card data-testid="card-investigating">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockAlerts.filter(a => a.status === "investigating").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently being reviewed</p>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-alerts-list">
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>All alerts requiring review or action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getTypeBgColor(alert.type)}`}
                data-testid={`card-alert-${alert.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-semibold">{alert.id}</span>
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                      <Badge variant="outline" className="capitalize">{alert.type}</Badge>
                    </div>
                    <p className="text-sm text-foreground mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                      <span className="font-medium">{alert.transactionId}</span>
                      {alert.assignee && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {alert.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" data-testid={`button-resolve-${alert.id}`}>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="icon" data-testid={`button-dismiss-${alert.id}`}>
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
