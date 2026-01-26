import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TMALogo } from "@/components/TMALogo";
import { Shield } from "lucide-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Alerts from "@/pages/Alerts";
import Reviews from "@/pages/Reviews";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between gap-4 px-4 py-3 bg-gradient-to-r from-[#0573FD] to-[#1EB2FF]" data-testid="header-main">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="text-white hover:bg-white/10" data-testid="button-sidebar-toggle" />
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold text-white" data-testid="text-header-title">T-GUARDIAN Dashboard</span>
                  </div>
                </div>
                <TMALogo variant="light" size="sm" testId="tma-logo-header" />
              </header>
              <main className="flex-1 overflow-auto bg-muted/30">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
