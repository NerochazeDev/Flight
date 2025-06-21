import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plane, Clock, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { PendingPayment, Flight } from "@/../../shared/schema";

export default function CompletePayment() {
  const [, params] = useRoute("/complete-payment/:reference");
  const reference = params?.reference;
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPendingPayment = async () => {
      if (!reference) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/pending-payments/${reference}`);

        if (!response.ok) {
          throw new Error("Pending payment not found");
        }

        const data = await response.json();

        // Check if payment is still pending
        if (data.status !== 'pending') {
          toast({
            title: "Payment Status",
            description: `This payment has already been ${data.status}`,
            variant: data.status === 'completed' ? 'default' : 'destructive',
          });
        }

        setPendingPayment(data);

        // Fetch flight details
        const flightResponse = await fetch(`/api/flights/${data.flightId}`);
        if (flightResponse.ok) {
          const flightData = await flightResponse.json();
          setFlight(flightData);
        }
      } catch (error) {
        console.error("Error fetching pending payment:", error);
        toast({
          title: "Error",
          description: "Unable to load pending payment details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingPayment();
  }, [reference, toast]);

  const handleCompletePayment = async () => {
    if (!pendingPayment) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`/api/pending-payments/${reference}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to complete payment");
      }

      const booking = await response.json();
      
      toast({
        title: "Payment Successful!",
        description: `Your booking ${booking.reference} has been confirmed.`,
      });

      // Redirect to booking confirmation or home
      window.location.href = '/';
    } catch (error) {
      console.error("Error completing payment:", error);
      toast({
        title: "Payment Failed",
        description: "Unable to process your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading payment details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!pendingPayment || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Payment Not Found</h2>
              <p className="text-gray-600 mb-4">
                The payment reference could not be found or has expired.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isExpired = new Date(pendingPayment.expiresAt) < new Date();
  const isCompleted = pendingPayment.status === 'completed';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Your Payment
            </CardTitle>
            <CardDescription>
              Review your booking details and complete your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Status */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Payment Status:</span>
              <Badge variant={
                isCompleted ? "default" : 
                isExpired ? "destructive" : 
                "secondary"
              }>
                {isCompleted ? "Completed" : isExpired ? "Expired" : "Pending"}
              </Badge>
            </div>

            {/* Flight Details */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Flight Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{flight.departureAirport} → {flight.arrivalAirport}</span>
                  <Badge variant="outline">{flight.flightNumber}</Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Departure: {new Date(flight.departureTime).toLocaleString()}</span>
                  <span>Duration: {flight.duration}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Aircraft: {flight.aircraft || "N/A"}</span>
                  <span>Airline: {flight.airline}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Booking Details */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Passengers:</span>
                <span>{pendingPayment.passengers}</span>
              </div>
              <div className="flex justify-between">
                <span>Add-ons:</span>
                <span>{(pendingPayment.addOns && pendingPayment.addOns.length > 0) ? pendingPayment.addOns.join(", ") : "None"}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount:</span>
                <span>£{pendingPayment.totalPrice}</span>
              </div>
            </div>

            {/* Expiry Warning */}
            {!isCompleted && !isExpired && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Payment expires on:</span>
                  <span>{new Date(pendingPayment.expiresAt).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {!isCompleted && !isExpired && (
                <Button 
                  onClick={handleCompletePayment}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete Payment
                    </>
                  )}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}