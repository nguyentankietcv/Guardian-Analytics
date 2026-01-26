import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Cpu,
  Mail
} from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">Settings</h1>
        <p className="text-muted-foreground">Configure T-GUARDIAN detection parameters and alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-detection-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Detection Settings
            </CardTitle>
            <CardDescription>Configure fraud detection thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="risk-threshold">Risk Score Threshold</Label>
              <Input 
                id="risk-threshold" 
                type="number" 
                defaultValue="70" 
                data-testid="input-risk-threshold"
              />
              <p className="text-xs text-muted-foreground">
                Transactions above this score will be flagged
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duplicate-window">Duplicate Detection Window (hours)</Label>
              <Input 
                id="duplicate-window" 
                type="number" 
                defaultValue="24" 
                data-testid="input-duplicate-window"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI-Enhanced Detection</Label>
                <p className="text-xs text-muted-foreground">Use ML models for fraud detection</p>
              </div>
              <Switch defaultChecked data-testid="switch-ai-detection" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Real-time Processing</Label>
                <p className="text-xs text-muted-foreground">Process transactions immediately</p>
              </div>
              <Switch defaultChecked data-testid="switch-realtime" />
            </div>
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
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Critical Alert Emails</Label>
                <p className="text-xs text-muted-foreground">Send email for critical alerts</p>
              </div>
              <Switch defaultChecked data-testid="switch-critical-emails" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Priority Notifications</Label>
                <p className="text-xs text-muted-foreground">Push notifications for high priority</p>
              </div>
              <Switch defaultChecked data-testid="switch-high-priority" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-email">Alert Email Address</Label>
              <Input 
                id="alert-email" 
                type="email" 
                defaultValue="alerts@company.com" 
                data-testid="input-alert-email"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Summary Report</Label>
                <p className="text-xs text-muted-foreground">Receive daily digest of alerts</p>
              </div>
              <Switch data-testid="switch-daily-summary" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-integration-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Data Integration
            </CardTitle>
            <CardDescription>Configure data sources and connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Database Connection</Label>
                <p className="text-xs text-muted-foreground">PostgreSQL primary database</p>
              </div>
              <span className="text-sm text-green-500 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Stream</Label>
                <p className="text-xs text-muted-foreground">Real-time transaction feed</p>
              </div>
              <span className="text-sm text-green-500 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>External API</Label>
                <p className="text-xs text-muted-foreground">Third-party verification</p>
              </div>
              <span className="text-sm text-green-500 font-medium">Connected</span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-model-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              AI/ML Model Settings
            </CardTitle>
            <CardDescription>Configure AI model parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Current Model Version</Label>
                <p className="text-xs text-muted-foreground">Fraud detection model</p>
              </div>
              <span className="text-sm font-medium">v2.4.1</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence-threshold">LLM Confidence Threshold (%)</Label>
              <Input 
                id="confidence-threshold" 
                type="number" 
                defaultValue="85" 
                data-testid="input-confidence-threshold"
              />
              <p className="text-xs text-muted-foreground">
                Suggestions below this confidence require human review
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve Low Risk</Label>
                <p className="text-xs text-muted-foreground">Automatically approve low-risk transactions</p>
              </div>
              <Switch data-testid="switch-auto-approve" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" data-testid="button-reset">Reset to Defaults</Button>
        <Button data-testid="button-save">Save Changes</Button>
      </div>
    </div>
  );
}
