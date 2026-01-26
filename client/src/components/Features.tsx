import { Card, CardContent } from "@/components/ui/card";
import { 
  Database, 
  Copy, 
  ShieldAlert, 
  BarChart3,
  Clock,
  Zap,
  Brain,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Database,
    title: "Automated Data Ingestion",
    description: "Scheduled ingestion from PostgreSQL transaction logs. Data is automatically cleansed, normalized, and stored in a separate analytics repository for efficient processing.",
    highlight: "Real-time Sync"
  },
  {
    icon: Copy,
    title: "Duplicate Payment Detection",
    description: "Intelligent detection of potential duplicate transactions without invoice numbers. Uses advanced correlation of recipient ID, amount, and timestamp patterns.",
    highlight: "Smart Matching"
  },
  {
    icon: ShieldAlert,
    title: "Fraud & Anomaly Detection",
    description: "Hybrid engine combining rule-based and ML algorithms. Detects split/structured transactions, high-value anomalies, and behavioral deviations in real-time.",
    highlight: "AI-Powered"
  },
  {
    icon: BarChart3,
    title: "Risk Monitoring Dashboard",
    description: "Comprehensive dashboard for Risk Analysts & Auditors. Displays alerts, risk scores, and flagged transactions with clear alert type indicators.",
    highlight: "Visual Analytics"
  }
];

const capabilities = [
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description: "Round-the-clock transaction surveillance"
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Real-time notifications for suspicious activity"
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Self-improving detection algorithms"
  },
  {
    icon: AlertTriangle,
    title: "Risk Scoring",
    description: "Intelligent risk assessment per transaction"
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-features-title">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-features-description">
            T-GUARDIAN provides comprehensive transaction monitoring and fraud detection 
            capabilities designed for enterprise-grade security requirements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
                data-testid={`card-feature-${index}`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[hsl(217,98%,50%)]" />
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {feature.highlight}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-[hsl(217,98%,50%)]/5 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-foreground text-center mb-10" data-testid="text-capabilities-title">
            Additional Capabilities
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-background rounded-xl shadow-sm"
                data-testid={`card-capability-${index}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <capability.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{capability.title}</h4>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
