import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Clock, 
  User, 
  DollarSign,
  Shield,
  AlertTriangle,
  Sparkles,
  Cpu,
  Gavel
} from "lucide-react";
import type { TransactionRecord, Alert } from "@/lib/api";

interface TransactionDetailsModalProps {
  transaction: TransactionRecord | Alert | null;
  open: boolean;
  onClose: () => void;
}

export default function TransactionDetailsModal({ 
  transaction, 
  open, 
  onClose 
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FRAUD":
        return <Badge className="bg-destructive text-destructive-foreground">Fraud</Badge>;
      case "WARN":
        return <Badge className="bg-orange-500 text-white">Flagged</Badge>;
      case "SAFE":
        return <Badge variant="outline" className="text-[#00A307] border-[#00A307]">Safe</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEnsembleColor = (score: number) => {
    if (score >= 0.8) return "text-destructive font-bold";
    if (score >= 0.5) return "text-orange-500 font-semibold";
    if (score >= 0.3) return "text-yellow-600";
    return "text-[#00A307]";
  };

  const ensembleScore = transaction.ensemble_score || 0;
  const ruleFraudScore = transaction.rule_fraud_score || 0;
  const modelScores = transaction.model_scores;
  const reasonTrail = transaction.reason_trail;
  const llmAnalysis = transaction.llm_analysis;

  const MODEL_LABELS: Record<string, string> = {
    dnn: "DNN",
    xgboost: "XGBoost",
    graphsage: "GraphSAGE",
    iso_forest: "Iso Forest",
    rule_check: "Rule Check",
    transformer: "Transformer",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            Full details and analysis for transaction {transaction.Transaction_ID}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-mono font-semibold text-lg" data-testid="text-modal-txn-id">
                {transaction.Transaction_ID}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(transaction.status)}
              <Badge variant="outline" className={getEnsembleColor(ensembleScore)}>
                Risk: {(ensembleScore * 100).toFixed(0)}%
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold">
                  ${(transaction.Transaction_Amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{transaction.User_ID}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Transaction Type</p>
                <p className="font-medium">{transaction.Transaction_Type}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{transaction.Location}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Card Type</p>
                <p className="font-medium">{transaction.Card_Type}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Timestamp</p>
                <p className="font-medium text-sm">
                  {transaction.Timestamp ? new Date(transaction.Timestamp).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Device Type</p>
              <p className="font-medium">{transaction.Device_Type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Merchant Category</p>
              <p className="font-medium">{transaction.Merchant_Category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Txn Count</p>
              <p className="font-medium">{transaction.Daily_Transaction_Count}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distance</p>
              <p className="font-medium">{transaction.Transaction_Distance?.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Auth Method</p>
              <p className="font-medium">{transaction.Authentication_Method}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Card Age</p>
              <p className="font-medium">{transaction.Card_Age} days</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Account Balance</p>
              <p className="font-medium">${(transaction.Account_Balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unusual IP</p>
              <p className="font-medium">{transaction.IP_Address_Flag ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prior Fraud</p>
              <p className="font-medium">{transaction.Previous_Fraudulent_Activity ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg 7-Day Amount</p>
              <p className="font-medium">${(transaction.Avg_Transaction_Amount_7d || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed Txn (7d)</p>
              <p className="font-medium">{transaction.Failed_Transaction_Count_7d || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weekend Transaction</p>
              <p className="font-medium">{transaction.Is_Weekend ? "Yes" : "No"}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Detection Scores
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Ensemble Score</p>
                <p className={`text-lg font-bold ${getEnsembleColor(ensembleScore)}`}>
                  {(ensembleScore * 100).toFixed(0)}%
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Gavel className="w-3 h-3" /> Rule Score
                </p>
                <p className="text-lg font-bold">
                  {(ruleFraudScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {modelScores && Object.keys(modelScores).length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Model Breakdown</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(modelScores).map(([model, score]) => (
                    <div key={model} className="text-center bg-background rounded-md p-2">
                      <p className="text-xs text-muted-foreground">{MODEL_LABELS[model] || model}</p>
                      <p className="font-semibold">{((score || 0) * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {reasonTrail && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Reason Trail
                </h4>
                <p className="text-sm bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  {reasonTrail}
                </p>
              </div>
            </>
          )}

          {llmAnalysis && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  LLM Analysis
                </h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{llmAnalysis}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
