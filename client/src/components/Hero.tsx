import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section 
      id="home" 
      className="relative overflow-hidden bg-gradient-to-br from-primary via-[hsl(210,100%,45%)] to-[hsl(217,98%,50%)] py-20 lg:py-32"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
            data-testid="badge-product"
          >
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">TMA Innovation Product</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" 
            data-testid="text-title"
          >
            T-GUARDIAN
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-white/90 font-medium mb-4" 
            data-testid="text-subtitle"
          >
            Transaction Guardian
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed" 
            data-testid="text-description"
          >
            Protect your financial transactions with AI-powered fraud detection, 
            duplicate payment identification, and real-time risk monitoring. 
            Built for risk analysts and auditors who demand excellence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="bg-white text-primary font-semibold px-8"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white bg-transparent font-semibold px-8"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white" data-testid="stat-accuracy">99.9%</div>
              <div className="text-sm text-white/70 mt-1">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white" data-testid="stat-response">{"<1s"}</div>
              <div className="text-sm text-white/70 mt-1">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white" data-testid="stat-transactions">10M+</div>
              <div className="text-sm text-white/70 mt-1">Transactions/Day</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white" data-testid="stat-savings">$50M+</div>
              <div className="text-sm text-white/70 mt-1">Fraud Prevented</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
