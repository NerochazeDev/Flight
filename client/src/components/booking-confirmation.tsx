import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Download, Mail } from "lucide-react";
import type { Flight, Booking } from "@shared/schema";

interface BookingConfirmationProps {
  booking: Booking;
  flight: Flight;
}

export default function BookingConfirmation({ booking, flight }: BookingConfirmationProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAirportName = (code: string) => {
    const airports = {
      LHR: "London Heathrow",
      LGW: "London Gatwick", 
      STN: "London Stansted",
      MAN: "Manchester",
      BHX: "Birmingham",
      EDI: "Edinburgh",
      AMS: "Amsterdam",
      RTM: "Rotterdam",
      EIN: "Eindhoven",
    };
    return airports[code as keyof typeof airports] || code;
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600 mb-6">Your flight has been successfully booked</p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Reference:</span>
              <span className="font-medium">{booking.bookingReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Flight:</span>
              <span className="font-medium">{flight.flightNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">
                {getAirportName(flight.departureAirport)} ({flight.departureAirport}) → {getAirportName(flight.arrivalAirport)} ({flight.arrivalAirport})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Departure:</span>
              <span className="font-medium">{flight.departureTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Passenger:</span>
              <span className="font-medium">{booking.passengerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-bold text-primary">£{booking.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary hover:bg-primary-dark text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Tickets
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email Confirmation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
