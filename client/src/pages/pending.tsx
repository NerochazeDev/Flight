import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Clock, CreditCard, Plane, Mail, Calendar, Users, Package } from "lucide-react";
import { PendingPayment, Flight } from "@/../../shared/schema";

interface PendingTicketWithFlight extends PendingPayment {
  flight?: Flight;
}

export default function PendingTickets() {
  const [pendingTickets, setPendingTickets] = useState<PendingTicketWithFlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingTickets();
  }, []);

  const fetchPendingTickets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/pending-payments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending tickets');
      }

      const tickets = await response.json();
      
      // Fetch flight details for each ticket
      const ticketsWithFlights = await Promise.all(
        tickets.map(async (ticket: PendingPayment) => {
          try {
            const flightResponse = await fetch(`/api/flights/${ticket.flightId}`);
            if (flightResponse.ok) {
              const flight = await flightResponse.json();
              return { ...ticket, flight };
            }
            return ticket;
          } catch (error) {
            console.error(`Failed to fetch flight ${ticket.flightId}:`, error);
            return ticket;
          }
        })
      );

      setPendingTickets(ticketsWithFlights);
    } catch (error) {
      console.error('Error fetching pending tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load pending tickets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletePayment = (reference: string) => {
    // Redirect to the payment form page
    window.location.href = `/payment/${reference}`;
  };

  const calculateWorkingDaysRemaining = (expiresAt: Date) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading pending tickets...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
            <Clock className="h-8 w-8" />
            Pending Tickets
          </h1>
          <p className="text-gray-600">Complete your payment to secure your booking</p>
        </div>

        {/* Pending Tickets List */}
        {pendingTickets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Pending Tickets</h2>
              <p className="text-gray-600">You don't have any pending payment tickets at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingTickets.map((ticket) => {
              const workingDaysLeft = calculateWorkingDaysRemaining(ticket.expiresAt);
              const expired = isExpired(ticket.expiresAt);
              
              return (
                <Card key={ticket.ticketReference} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Plane className="h-5 w-5" />
                          Ticket Reference: {ticket.ticketReference}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Payment due in {workingDaysLeft} working days
                        </CardDescription>
                      </div>
                      <Badge variant={expired ? "destructive" : workingDaysLeft <= 1 ? "destructive" : "secondary"}>
                        {expired ? "Expired" : ticket.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Professional Email Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900 mb-2">Payment Reminder</h3>
                          <p className="text-blue-800 text-sm leading-relaxed">
                            Dear {ticket.passengerName},<br /><br />
                            Thank you for choosing our airline services. This is a friendly reminder that your flight booking 
                            payment is pending completion. To secure your reservation and avoid cancellation, please complete 
                            your payment within <strong>{workingDaysLeft} working days</strong>.
                            <br /><br />
                            Should you have any questions or require assistance, please don't hesitate to contact our 
                            customer service team.
                            <br /><br />
                            Best regards,<br />
                            <em>SkyBooker Airlines Team</em>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Flight Details */}
                    {ticket.flight && (
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Plane className="h-4 w-4" />
                          Flight Details
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {ticket.flight.departureAirport} → {ticket.flight.arrivalAirport}
                            </span>
                            <Badge variant="outline">{ticket.flight.flightNumber}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Departure: {new Date(ticket.flight.departureTime).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Duration: {ticket.flight.duration}</span>
                            </div>
                            <div>
                              <span>Aircraft: {ticket.flight.aircraft || "N/A"}</span>
                            </div>
                            <div>
                              <span>Airline: {ticket.flight.airline}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Booking Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Passengers:</span>
                          <span className="text-sm">{ticket.passengers}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Add-ons:</span>
                          <span className="text-sm">
                            {(ticket.addOns && ticket.addOns.length > 0) ? ticket.addOns.join(", ") : "None"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          £{ticket.totalPrice}
                        </div>
                        <div className="text-sm text-gray-500">
                          Total Amount
                        </div>
                      </div>
                    </div>

                    {/* Expiry Information */}
                    <div className={`p-3 rounded-lg ${
                      expired ? 'bg-red-50 border border-red-200' : 
                      workingDaysLeft <= 1 ? 'bg-yellow-50 border border-yellow-200' : 
                      'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${
                          expired ? 'text-red-600' : 
                          workingDaysLeft <= 1 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          expired ? 'text-red-800' : 
                          workingDaysLeft <= 1 ? 'text-yellow-800' : 
                          'text-green-800'
                        }`}>
                          {expired ? 
                            `Expired on ${new Date(ticket.expiresAt).toLocaleDateString()}` :
                            `Payment expires on ${new Date(ticket.expiresAt).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                      {!expired && (
                        <Button 
                          onClick={() => handleCompletePayment(ticket.ticketReference)}
                          disabled={processingPayment === ticket.ticketReference}
                          className="flex-1"
                        >
                          {processingPayment === ticket.ticketReference ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Complete Payment - £{ticket.totalPrice}
                            </>
                          )}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.href = `/email-preview/${ticket.ticketReference}`}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        View Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}