

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Download, Mail, Plane, QrCode, AlertTriangle, Calendar, Clock, MapPin } from "lucide-react";
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
  const isPendingPayment = booking.status === "pending";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Message or Payment Warning */}
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          {isPendingPayment ? (
            <>
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Required!</h3>
              <p className="text-gray-600 mb-6">Your booking has been created but payment is still required. Please complete payment before your flight date to avoid cancellation.</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <strong>CAUTION:</strong> This ticket is not valid for travel until payment is completed. You must pay before {formatDate(today)} to secure your seat.
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your flight has been successfully booked and paid. Please save your boarding pass below.</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Realistic Boarding Pass */}
      <Card className="shadow-2xl border-2 border-gray-300 bg-white overflow-hidden">
        <CardContent className="p-0">
          {/* Airline Header with Security Strip */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-blue-700 font-bold text-lg">{flight.airlineCode}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{flight.airline}</h2>
                    <p className="text-blue-200 text-sm font-medium">ELECTRONIC BOARDING PASS</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">E-TICKET RECEIPT</p>
                  <p className="font-mono text-xl font-bold">{booking.bookingReference}</p>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                    isPendingPayment ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {isPendingPayment ? 'PAYMENT PENDING' : 'PAID'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Ticket Content */}
          <div className="flex">
            {/* Left Section - Main Ticket */}
            <div className="flex-1 p-8 border-r-2 border-dashed border-gray-400 bg-gradient-to-br from-gray-50 to-white">
              {/* Passenger & Flight Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Passenger Name</label>
                  <p className="text-xl font-bold text-gray-900 tracking-wide">{booking.passengerName.toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-1">Adult</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Flight Number</label>
                  <p className="text-xl font-bold text-gray-900">{flight.flightNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">Operated by {flight.airline}</p>
                </div>
              </div>

              {/* Route Information with Enhanced Design */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Departure</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{flight.departureAirport}</p>
                    <p className="text-sm text-gray-600 font-medium">{getAirportName(flight.departureAirport)}</p>
                    <div className="mt-3 flex items-center justify-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{formatDate(today)}</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-600 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-lg font-bold">{formatTime(flight.departureTime)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center px-8">
                    <div className="w-16 h-px bg-gray-400 mb-2"></div>
                    <Plane className="w-8 h-8 text-blue-600 transform rotate-90" />
                    <div className="w-16 h-px bg-gray-400 mt-2"></div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">{flight.duration}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Arrival</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{flight.arrivalAirport}</p>
                    <p className="text-sm text-gray-600 font-medium">{getAirportName(flight.arrivalAirport)}</p>
                    <div className="mt-3 flex items-center justify-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{formatDate(today)}</span>
                    </div>
                    <div className="flex items-center justify-center text-gray-600 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-lg font-bold">{formatTime(flight.arrivalTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Details Grid */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Gate</label>
                  <p className="text-2xl font-bold text-gray-900">{generateGate()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Seat</label>
                  <p className="text-2xl font-bold text-gray-900">{generateSeat()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Boarding</label>
                  <p className="text-2xl font-bold text-gray-900">{generateBoardingTime()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Class</label>
                  <p className="text-lg font-bold text-gray-900">
                    {parseFloat(flight.price) > 2000 ? "BUSINESS" : "ECONOMY"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Terminal</label>
                  <p className="text-lg font-bold text-gray-900">{Math.floor(Math.random() * 5) + 1}</p>
                </div>
                <div className="text-center">
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Aircraft</label>
                  <p className="text-lg font-bold text-gray-900">{flight.aircraft}</p>
                </div>
                <div className="text-center">
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sequence</label>
                  <p className="text-lg font-bold text-gray-900">{Math.floor(Math.random() * 200) + 1}</p>
                </div>
              </div>

              {/* Important Notices */}
              {isPendingPayment ? (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-800 font-bold">
                      PAYMENT REQUIRED: This ticket is not valid for travel until payment is completed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Payment confirmed. This ticket is valid for travel.
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-xs text-blue-800 font-medium">
                  <strong>CHECK-IN REQUIREMENTS:</strong> Online check-in opens 24 hours before departure. 
                  Airport check-in closes 40 minutes before domestic flights, 60 minutes before international flights.
                  Valid photo ID required for all passengers.
                </p>
              </div>

              {/* Booking Details */}
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Amount</p>
                    <p className={`text-2xl font-bold ${isPendingPayment ? 'text-red-600' : 'text-green-600'}`}>
                      £{booking.totalPrice}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {isPendingPayment ? 'Payment Pending' : 'Paid in Full'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Confirmation Code</p>
                    <p className="text-2xl font-mono font-bold text-gray-900">{booking.bookingReference}</p>
                    <p className="text-xs text-gray-500 mt-1">Keep this reference safe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Enhanced Stub */}
            <div className="w-56 p-6 bg-gradient-to-b from-gray-100 to-gray-200 relative">
              {/* Security Pattern */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="grid grid-cols-8 gap-1 h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="bg-gray-600 rounded-full"></div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-3">Boarding Pass</p>
                  <div className="w-28 h-28 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <QrCode className="w-20 h-20 text-gray-700" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Security Checkpoint</p>
                </div>

                <div className="space-y-6 text-center">
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Flight</p>
                    <p className="text-lg font-bold text-gray-900">{flight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Seat</p>
                    <p className="text-lg font-bold text-gray-900">{generateSeat()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Boarding</p>
                    <p className="text-lg font-bold text-gray-900">{generateBoardingTime()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Gate</p>
                    <p className="text-lg font-bold text-gray-900">{generateGate()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Status</p>
                    <p className={`text-sm font-bold ${isPendingPayment ? 'text-red-600' : 'text-green-600'}`}>
                      {isPendingPayment ? 'PENDING' : 'CONFIRMED'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="transform -rotate-90 origin-center">
                    <p className="text-xs text-gray-600 font-mono whitespace-nowrap">
                      {booking.bookingReference}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-8 py-4 flex justify-between items-center text-xs text-gray-700">
            <div className="flex items-center space-x-4">
              <p className="font-medium">Valid for travel on date shown only</p>
              <span>•</span>
              <p>Baggage restrictions apply</p>
            </div>
            <div className="flex items-center space-x-4">
              <p>Visit airline website for updates</p>
              <span>•</span>
              <p className="font-mono">{new Date().getFullYear()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {isPendingPayment && (
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Complete Payment
          </Button>
        )}
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

