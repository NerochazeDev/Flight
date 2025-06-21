
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Download, Mail, Plane, QrCode } from "lucide-react";
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

  const formatTime = (time: string) => {
    return time;
  };

  const getAirportName = (code: string) => {
    const airports = {
      LHR: "London Heathrow",
      LGW: "London Gatwick", 
      STN: "London Stansted",
      MAN: "Manchester",
      BHX: "Birmingham",
      EDI: "Edinburgh",
      AMS: "Amsterdam Schiphol",
      RTM: "Rotterdam",
      EIN: "Eindhoven",
      CDG: "Paris Charles de Gaulle",
      JFK: "New York JFK",
      DXB: "Dubai International",
      BCN: "Barcelona El Prat",
      FCO: "Rome Fiumicino",
      FRA: "Frankfurt",
      NRT: "Tokyo Narita",
      SYD: "Sydney Kingsford Smith"
    };
    return airports[code as keyof typeof airports] || code;
  };

  const generateSeat = () => {
    const rows = Math.floor(Math.random() * 30) + 10;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const letter = letters[Math.floor(Math.random() * letters.length)];
    return `${rows}${letter}`;
  };

  const generateGate = () => {
    return `${Math.floor(Math.random() * 50) + 1}`;
  };

  const generateBoardingTime = () => {
    const [hours, minutes] = flight.departureTime.split(':');
    const boardingHour = parseInt(hours) - 1;
    return `${String(boardingHour).padStart(2, '0')}:${minutes}`;
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Message */}
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-6">Your flight has been successfully booked. Please save your boarding pass below.</p>
        </CardContent>
      </Card>

      {/* Realistic Boarding Pass */}
      <Card className="shadow-xl border-2 border-gray-200 bg-white">
        <CardContent className="p-0">
          {/* Airline Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-white rounded flex items-center justify-center`}>
                  <span className="text-blue-600 font-bold text-sm">{flight.airlineCode}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{flight.airline}</h2>
                  <p className="text-blue-100 text-sm">BOARDING PASS</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">ELECTRONIC TICKET</p>
                <p className="font-mono text-lg">{booking.bookingReference}</p>
              </div>
            </div>
          </div>

          {/* Main Ticket Content */}
          <div className="flex">
            {/* Left Section - Main Ticket */}
            <div className="flex-1 p-6 border-r-2 border-dashed border-gray-300">
              {/* Passenger & Flight Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Passenger Name</label>
                  <p className="text-lg font-bold text-gray-900">{booking.passengerName.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Flight</label>
                  <p className="text-lg font-bold text-gray-900">{flight.flightNumber}</p>
                </div>
              </div>

              {/* Route Information */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">From</p>
                  <p className="text-3xl font-bold text-gray-900">{flight.departureAirport}</p>
                  <p className="text-sm text-gray-600">{getAirportName(flight.departureAirport)}</p>
                </div>
                
                <div className="flex items-center space-x-2 px-4">
                  <div className="w-8 h-px bg-gray-400"></div>
                  <Plane className="w-6 h-6 text-gray-400" />
                  <div className="w-8 h-px bg-gray-400"></div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">To</p>
                  <p className="text-3xl font-bold text-gray-900">{flight.arrivalAirport}</p>
                  <p className="text-sm text-gray-600">{getAirportName(flight.arrivalAirport)}</p>
                </div>
              </div>

              {/* Flight Details Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</label>
                  <p className="text-sm font-bold text-gray-900">{formatDate(today)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Departure</label>
                  <p className="text-sm font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Gate</label>
                  <p className="text-sm font-bold text-gray-900">{generateGate()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Seat</label>
                  <p className="text-sm font-bold text-gray-900">{generateSeat()}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Boarding</label>
                  <p className="text-sm font-bold text-gray-900">{generateBoardingTime()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Class</label>
                  <p className="text-sm font-bold text-gray-900">
                    {parseFloat(flight.price) > 2000 ? "BUSINESS" : "ECONOMY"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Terminal</label>
                  <p className="text-sm font-bold text-gray-900">{Math.floor(Math.random() * 5) + 1}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Aircraft</label>
                  <p className="text-sm font-bold text-gray-900">{flight.aircraft}</p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  <strong>IMPORTANT:</strong> Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights. 
                  Ensure you have valid identification and travel documents.
                </p>
              </div>

              {/* Booking Details */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Paid</p>
                    <p className="text-xl font-bold text-green-600">£{booking.totalPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Booking Reference</p>
                    <p className="text-lg font-mono font-bold text-gray-900">{booking.bookingReference}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Stub */}
            <div className="w-48 p-6 bg-gray-50">
              <div className="text-center mb-6">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Boarding Pass</p>
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center mx-auto mb-2">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600">Scan at security</p>
              </div>

              <div className="space-y-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Flight</p>
                  <p className="font-bold text-gray-900">{flight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Seat</p>
                  <p className="font-bold text-gray-900">{generateSeat()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Boarding</p>
                  <p className="font-bold text-gray-900">{generateBoardingTime()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Gate</p>
                  <p className="font-bold text-gray-900">{generateGate()}</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">
                  {booking.bookingReference}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-6 py-3 flex justify-between items-center text-xs text-gray-600">
            <p>Valid for travel on date shown only</p>
            <p>Keep this boarding pass until you reach your destination</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
          <Download className="w-4 h-4 mr-2" />
          Download Boarding Pass
        </Button>
        <Button variant="outline" className="px-8 py-3">
          <Mail className="w-4 h-4 mr-2" />
          Email to Me
        </Button>
      </div>
    </div>
  );
}
