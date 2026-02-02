import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Shield, 
  Database,
  Cpu,
  RefreshCcw,
  AlertTriangle,
  Save,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  fetchNotificationSettings,
  fetchDetectionSettings,
  fetchDataIntegrationStatus,
  updateNotificationSettings,
  updateDetectionSettings,
  type NotificationSettings,
  type DetectionSettings,
  type DataIntegrationStatus,
} from "@/lib/api";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notificationSettings, isLoading: notifLoading, isError: notifError, refetch: refetchNotif } = useQuery<NotificationSettings>({
    queryKey: ["/settings/notifications"],
    queryFn: fetchNotificationSettings,
  });

  const { data: detectionSettings, isLoading: detectLoading, isError: detectError, refetch: refetchDetect } = useQuery<DetectionSettings>({
    queryKey: ["/settings/detection"],
    queryFn: fetchDetectionSettings,
  });

  const { data: integrationStatus, isLoading: integrationLoading, isError: integrationError, refetch: refetchIntegration } = useQuery<DataIntegrationStatus>({
    queryKey: ["/settings/data-integration"],
    queryFn: fetchDataIntegrationStatus,
  });

  const [localNotif, setLocalNotif] = useState<Partial<NotificationSettings>>({});
  const [localDetect, setLocalDetect] = useState<Partial<DetectionSettings>>({});

  useEffect(() => {
    if (notificationSettings) {
      setLocalNotif({
        critical_alert_emails_enabled: notificationSettings.critical_alert_emails_enabled,
        high_priority_notifications_enabled: notificationSettings.high_priority_notifications_enabled,
        alert_email_address: notificationSettings.alert_email_address || "",
        daily_summary_report_enabled: notificationSettings.daily_summary_report_enabled,
        slack_webhook_url: notificationSettings.slack_webhook_url || "",
        sms_phone_number: notificationSettings.sms_phone_number || "",
        risk_score_threshold_for_critical: notificationSettings.risk_score_threshold_for_critical,
        risk_score_threshold_for_high: notificationSettings.risk_score_threshold_for_high,
      });
    }
  }, [notificationSettings]);

  useEffect(() => {
    if (detectionSettings) {
      setLocalDetect({
        ai_enhanced_detection_enabled: detectionSettings.ai_enhanced_detection_enabled,
      });
    }
  }, [detectionSettings]);

  const notifMutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/settings/notifications"] });
      toast({ title: "Success", description: "Notification settings saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save notification settings", variant: "destructive" });
    },
  });

  const detectMutation = useMutation({
    mutationFn: updateDetectionSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/settings/detection"] });
      toast({ title: "Success", description: "Detection settings saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save detection settings", variant: "destructive" });
    },
  });

  const handleSaveAll = () => {
    notifMutation.mutate(localNotif);
    detectMutation.mutate(localDetect);
  };

  const handleRefresh = () => {
    refetchNotif();
    refetchDetect();
    refetchIntegration();
  };

  const isLoading = notifLoading || detectLoading || integrationLoading;
  const isError = notifError || detectError || integrationError;
  const isSaving = notifMutation.isPending || detectMutation.isPending;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONNECTED":
      case "ACTIVE":
      case "ONLINE":
        return "text-[#00A307]";
      case "DISCONNECTED":
      case "OFFLINE":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONNECTED":
        return "Connected";
      case "ACTIVE":
        return "Active";
      case "ONLINE":
        return "Online";
      case "DISCONNECTED":
        return "Disconnected";
      case "OFFLINE":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground" data-testid="text-page-title">Settings</h1>
          <p className="text-base text-muted-foreground">Configure T-GUARDIAN detection parameters and alerts</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} data-testid="button-refresh-settings">
          <RefreshCcw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>Unable to fetch settings from the API. Make sure the backend is running at localhost:9000.</span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-detection-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Detection Settings
            </CardTitle>
            <CardDescription>Configure fraud detection options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detectLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI-Enhanced Detection</Label>
                  <p className="text-xs text-muted-foreground">Use ML models for fraud detection</p>
                </div>
                <Switch 
                  checked={localDetect.ai_enhanced_detection_enabled ?? true}
                  onCheckedChange={(checked) => setLocalDetect({ ...localDetect, ai_enhanced_detection_enabled: checked })}
                  data-testid="switch-ai-detection" 
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-notification-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure alert notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Critical Alert Emails</Label>
                    <p className="text-xs text-muted-foreground">Send email for critical alerts</p>
                  </div>
                  <Switch 
                    checked={localNotif.critical_alert_emails_enabled ?? true}
                    onCheckedChange={(checked) => setLocalNotif({ ...localNotif, critical_alert_emails_enabled: checked })}
                    data-testid="switch-critical-emails" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Priority Notifications</Label>
                    <p className="text-xs text-muted-foreground">Push notifications for high priority</p>
                  </div>
                  <Switch 
                    checked={localNotif.high_priority_notifications_enabled ?? true}
                    onCheckedChange={(checked) => setLocalNotif({ ...localNotif, high_priority_notifications_enabled: checked })}
                    data-testid="switch-high-priority" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-email">Alert Email Address</Label>
                  <Input 
                    id="alert-email" 
                    type="email" 
                    value={localNotif.alert_email_address ?? ""}
                    onChange={(e) => setLocalNotif({ ...localNotif, alert_email_address: e.target.value })}
                    placeholder="alerts@company.com"
                    data-testid="input-alert-email"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Summary Report</Label>
                    <p className="text-xs text-muted-foreground">Receive daily digest of alerts</p>
                  </div>
                  <Switch 
                    checked={localNotif.daily_summary_report_enabled ?? false}
                    onCheckedChange={(checked) => setLocalNotif({ ...localNotif, daily_summary_report_enabled: checked })}
                    data-testid="switch-daily-summary" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input 
                    id="slack-webhook" 
                    type="url" 
                    value={localNotif.slack_webhook_url ?? ""}
                    onChange={(e) => setLocalNotif({ ...localNotif, slack_webhook_url: e.target.value })}
                    placeholder="https://hooks.slack.com/services/..."
                    data-testid="input-slack-webhook"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-phone">SMS Phone Number</Label>
                  <Input 
                    id="sms-phone" 
                    type="tel" 
                    value={localNotif.sms_phone_number ?? ""}
                    onChange={(e) => setLocalNotif({ ...localNotif, sms_phone_number: e.target.value })}
                    placeholder="+1234567890"
                    data-testid="input-sms-phone"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="threshold-critical">Critical Threshold</Label>
                    <Input 
                      id="threshold-critical" 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="1"
                      value={localNotif.risk_score_threshold_for_critical ?? 0.80}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0 && val <= 1) {
                          setLocalNotif({ ...localNotif, risk_score_threshold_for_critical: val });
                        }
                      }}
                      data-testid="input-threshold-critical"
                    />
                    <p className="text-xs text-muted-foreground">Risk score for critical alerts (0-1)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold-high">High Threshold</Label>
                    <Input 
                      id="threshold-high" 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="1"
                      value={localNotif.risk_score_threshold_for_high ?? 0.70}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0 && val <= 1) {
                          setLocalNotif({ ...localNotif, risk_score_threshold_for_high: val });
                        }
                      }}
                      data-testid="input-threshold-high"
                    />
                    <p className="text-xs text-muted-foreground">Risk score for high alerts (0-1)</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-integration-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Data Integration
            </CardTitle>
            <CardDescription>Database connection status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrationLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : integrationStatus ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Database Connection</Label>
                    <p className="text-xs text-muted-foreground">{integrationStatus.database_connection.name}</p>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(integrationStatus.database_connection.status)}`}>
                    {getStatusText(integrationStatus.database_connection.status)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Unable to load integration status</p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-model-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              AI/ML Model Info
            </CardTitle>
            <CardDescription>Model information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Current Model Version</Label>
                <p className="text-xs text-muted-foreground">Fraud detection model</p>
              </div>
              <span className="text-sm font-medium">v2.4.1</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ensemble Models</Label>
                <p className="text-xs text-muted-foreground">Active detection models</p>
              </div>
              <span className="text-sm font-medium text-muted-foreground">XGBoost, RF, Neural Net</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          onClick={handleSaveAll} 
          disabled={isSaving || isLoading}
          data-testid="button-save"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
