import { ArrowRight, Database, RefreshCw, Shield, AlertCircle, Brain, BarChart3, Users } from "lucide-react";

export function Architecture() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-architecture-title">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-architecture-description">
            T-GUARDIAN uses a sophisticated multi-stage pipeline to detect and prevent 
            fraudulent transactions with high accuracy and minimal false positives.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center">
            <div className="lg:col-span-1 flex flex-col items-center" data-testid="step-data-sources">
              <div className="w-20 h-20 rounded-2xl bg-[hsl(217,60%,95%)] border-2 border-[hsl(217,60%,80%)] flex items-center justify-center mb-3">
                <Database className="w-10 h-10 text-[hsl(217,98%,50%)]" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">Data Sources</span>
              <span className="text-xs text-muted-foreground text-center mt-1">Database & Streams</span>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-muted-foreground/50" />
            </div>

            <div className="lg:col-span-1 flex flex-col items-center" data-testid="step-normalization">
              <div className="w-20 h-20 rounded-2xl bg-[hsl(203,60%,95%)] border-2 border-[hsl(203,60%,80%)] flex items-center justify-center mb-3">
                <RefreshCw className="w-10 h-10 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">Data Normalization</span>
              <span className="text-xs text-muted-foreground text-center mt-1">Cleanse & Transform</span>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-muted-foreground/50" />
            </div>

            <div className="lg:col-span-1 flex flex-col items-center gap-3" data-testid="step-detection">
              <div className="w-20 h-20 rounded-2xl bg-[hsl(0,60%,95%)] border-2 border-[hsl(0,60%,80%)] flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-[hsl(0,100%,44%)]" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-[hsl(122,60%,95%)] border-2 border-[hsl(122,60%,75%)] flex items-center justify-center">
                <Shield className="w-10 h-10 text-[hsl(122,100%,32%)]" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-[hsl(122,60%,95%)] border-2 border-[hsl(122,60%,75%)] flex items-center justify-center">
                <Brain className="w-10 h-10 text-[hsl(122,100%,32%)]" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">Detection Services</span>
              <span className="text-xs text-muted-foreground text-center">Dedup, Rules & AI</span>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-muted-foreground/50" />
            </div>

            <div className="lg:col-span-1 flex flex-col items-center" data-testid="step-flagging">
              <div className="w-20 h-20 rounded-2xl bg-[hsl(270,60%,95%)] border-2 border-[hsl(270,60%,80%)] flex items-center justify-center mb-3">
                <BarChart3 className="w-10 h-10 text-[hsl(270,70%,50%)]" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">Flagging Service</span>
              <span className="text-xs text-muted-foreground text-center mt-1">Risk Assessment</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[hsl(180,60%,95%)] to-[hsl(180,60%,98%)] rounded-xl p-6 border border-[hsl(180,60%,85%)]" data-testid="step-dashboard">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[hsl(180,70%,40%)] flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">User Dashboard</h4>
                  <p className="text-sm text-muted-foreground">Visual analytics for risk monitoring</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[hsl(270,60%,95%)] to-[hsl(270,60%,98%)] rounded-xl p-6 border border-[hsl(270,60%,85%)]" data-testid="step-review">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[hsl(270,70%,60%)] flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">LLM-Assisted Human Review</h4>
                  <p className="text-sm text-muted-foreground">AI-powered analysis for low confidence cases</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 flex-wrap justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[hsl(122,60%,95%)] border border-[hsl(122,60%,75%)]" />
                <span className="text-sm text-muted-foreground">High Confidence: Auto-update</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[hsl(270,60%,95%)] border border-[hsl(270,60%,85%)]" />
                <span className="text-sm text-muted-foreground">Low Confidence: Human Review</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center" data-testid="detection-split">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Split Transaction Detection</h4>
            <p className="text-sm text-muted-foreground">
              Identifies structured transactions designed to evade detection thresholds
            </p>
          </div>

          <div className="text-center" data-testid="detection-duplicate">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(45,100%,50%)]/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-[hsl(45,100%,35%)]" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Duplicate Payment Alerts</h4>
            <p className="text-sm text-muted-foreground">
              Flags potential duplicate payments based on recipient, amount, and timing
            </p>
          </div>

          <div className="text-center" data-testid="detection-behavioral">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Behavioral Anomalies</h4>
            <p className="text-sm text-muted-foreground">
              ML-based detection of unusual patterns and high-value transaction anomalies
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
