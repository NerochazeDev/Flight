import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import EmailPreview from "@/pages/email-preview";
import CompletePayment from "@/pages/complete-payment";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/email-preview/:reference" component={EmailPreview} />
      <Route path="/complete-payment/:reference" component={CompletePayment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;