import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import CompletePayment from "@/pages/complete-payment";
import EmailPreview from "@/pages/email-preview";
import PendingTickets from "@/pages/pending";
import Payment from "@/pages/payment";
import BookingConfirmation from "@/pages/booking-confirmation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pending" component={PendingTickets} />
      <Route path="/payment/:reference" component={Payment} />
      <Route path="/complete-payment/:reference" component={CompletePayment} />
      <Route path="/booking-confirmation/:reference" component={BookingConfirmation} />
      <Route path="/email-preview/:reference" component={EmailPreview} />
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