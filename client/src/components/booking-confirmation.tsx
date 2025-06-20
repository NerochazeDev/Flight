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
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Booking confirmed!</h3>
          <p className="text-lg text-gray-600 mb-8">Your flight booking has been successfully confirmed</p>
          
          <div className="bg-blue-50 rounded-lg p-8 mb-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500 block">Booking reference</span>
                  <span className="text-lg font-bold text-gray-900">{booking.bookingReference}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Flight</span>
                  <span className="text-base font-medium text-gray-900">{flight.airline} {flight.flightNumber}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Route</span>
                  <span className="text-base font-medium text-gray-900">
                    {getAirportName(flight.departureAirport)} → {getAirportName(flight.arrivalAirport)}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500 block">Departure time</span>
                  <span className="text-base font-medium text-gray-900">{flight.departureTime}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Passenger</span>
                  <span className="text-base font-medium text-gray-900">{booking.passengerName}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Total paid</span>
                  <span className="text-xl font-bold text-blue-600">£{booking.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-8 py-3 rounded-full font-semibold shadow-md">
              <Download className="w-5 h-5 mr-2" />
              Download boarding pass
            </Button>
            <Button variant="outline" className="px-8 py-3 rounded-full font-semibold border-gray-300">
              <Mail className="w-5 h-5 mr-2" />
              Email confirmation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
