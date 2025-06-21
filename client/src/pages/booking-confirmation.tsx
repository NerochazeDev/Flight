import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowLeft, Home } from "lucide-react";
import { Booking, Flight } from "@/../../shared/schema";
import AirlineTicket from "@/components/airline-ticket";

export default function BookingConfirmation() {
  const [, params] = useRoute("/booking-confirmation/:reference");
  const reference = params?.reference;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!reference) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/bookings/${reference}`);

        if (!response.ok) {
          throw new Error("Booking not found");
        }

        const bookingData = await response.json();
        setBooking(bookingData);

        // Fetch flight details
        const flightResponse = await fetch(`/api/flights/${bookingData.flightId}`);
        if (flightResponse.ok) {
          const flightData = await flightResponse.json();
          setFlight(flightData);
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast({
          title: "Error",
          description: "Unable to load booking details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [reference, toast]);

  const handleDownloadTicket = () => {
    // Generate PDF download (simplified implementation)
    window.print();
  };

  const handlePrintTicket = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading booking confirmation...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!booking || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
              <p className="text-gray-600 mb-4">
                The booking reference could not be found.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Success Header */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Booking Confirmed!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your flight has been successfully booked. Your confirmation number is{" "}
              <span className="font-semibold">{booking.bookingReference}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Book Another Flight
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/pending'}
              >
                View Pending Tickets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Airline Ticket */}
        <AirlineTicket 
          booking={booking}
          flight={flight}
          onDownload={handleDownloadTicket}
          onPrint={handlePrintTicket}
        />

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Before Your Flight</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check-in online 24 hours before departure</li>
                  <li>• Arrive at airport 2 hours before international flights</li>
                  <li>• Ensure your passport is valid for at least 6 months</li>
                  <li>• Check visa requirements for your destination</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customer Service: +44 20 7946 0958</li>
                  <li>• Email: support@skybooker.com</li>
                  <li>• Website: www.skybooker.com</li>
                  <li>• Emergency: Available 24/7</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}