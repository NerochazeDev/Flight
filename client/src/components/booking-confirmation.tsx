
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Download, Mail, Plane, QrCode, AlertTriangle, Calendar, Clock, MapPin, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Flight, Booking } from "@shared/schema";

interface BookingConfirmationProps {
  booking: Booking;
  flight: Flight;
}

export default function BookingConfirmation({ booking, flight }: BookingConfirmationProps) {
  const { toast } = useToast();
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
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

  const generatePNR = () => {
    return booking.bookingReference;
  };

  const handleEmailTicket = async () => {
    setIsLoadingEmail(true);
    try {
      const response = await fetch(`/api/pending-payments/${booking.bookingReference}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const result = await response.json();
      
      toast({
        title: "Email Sent",
        description: "Payment reminder email has been sent successfully.",
      });
    } catch (error) {
      console.error("Email error:", error);
      toast({
        title: "Email Failed",
        description: "Unable to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const handleDownloadTicket = async () => {
    setIsLoadingDownload(true);
    try {
      const response = await fetch(`/api/pending-payments/${booking.bookingReference}/download`);

      if (!response.ok) {
        throw new Error("Failed to download ticket");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ticket-${booking.bookingReference}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Ticket Downloaded",
        description: "Your ticket has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Unable to download ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDownload(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const isPendingPayment = booking.status === "pending";
  const seat = generateSeat();
  const gate = generateGate();
  const boardingTime = generateBoardingTime();
  const pnr = generatePNR();
  const terminal = Math.floor(Math.random() * 5) + 1;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Status Message */}
      <Card className="shadow-lg">
        <CardContent className="p-6 text-center">
          {isPendingPayment ? (
            <>
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Required</h3>
              <p className="text-gray-600 mb-4">Complete payment to confirm your booking</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                <strong>CAUTION:</strong> This ticket is not valid for travel until payment is completed.
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed</h3>
              <p className="text-gray-600">Your flight has been successfully booked</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Realistic Airline Ticket */}
      <Card className="shadow-2xl bg-white overflow-hidden max-w-5xl mx-auto">
        <CardContent className="p-0">
          {/* Airline Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white relative">
            {/* Security Strip */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400"></div>
            
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-800 font-bold text-sm">{flight.airlineCode}</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">{flight.airline}</h1>
                    <p className="text-blue-200 text-xs font-medium">ELECTRONIC TICKET & RECEIPT</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-xs font-semibold">CONFIRMATION CODE</p>
                  <p className="font-mono text-lg font-bold">{pnr}</p>
                  <div className={`inline-flex px-2 py-1 rounded text-xs font-bold mt-1 ${
                    isPendingPayment ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    {isPendingPayment ? 'PAYMENT PENDING' : 'CONFIRMED'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Ticket Body */}
          <div className="flex min-h-96">
            {/* Left Section - Main Ticket */}
            <div className="flex-1 p-6 border-r-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
              {/* Passenger Info */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">PASSENGER NAME</p>
                    <p className="text-lg font-bold text-gray-900 tracking-wide">{booking.passengerName.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">E-TICKET NUMBER</p>
                    <p className="text-lg font-bold text-gray-900 font-mono">{flight.airlineCode}{Math.random().toString().substr(2, 10)}</p>
                  </div>
                </div>
              </div>

              {/* Flight Route */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 font-bold uppercase">DEPARTURE</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{flight.departureAirport}</p>
                    <p className="text-xs text-gray-600 mb-3">{getAirportName(flight.departureAirport)}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span className="text-xs">{formatDate(today)}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1 text-gray-600" />
                        <span className="text-lg font-bold text-gray-900">{formatTime(flight.departureTime)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center px-6">
                    <div className="w-12 h-px bg-gray-400 mb-1"></div>
                    <Plane className="w-6 h-6 text-blue-600 transform rotate-90" />
                    <div className="w-12 h-px bg-gray-400 mt-1"></div>
                    <p className="text-xs text-gray-500 mt-2">{flight.duration}</p>
                  </div>

                  <div className="text-center flex-1">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 font-bold uppercase">ARRIVAL</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{flight.arrivalAirport}</p>
                    <p className="text-xs text-gray-600 mb-3">{getAirportName(flight.arrivalAirport)}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span className="text-xs">{formatDate(today)}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1 text-gray-600" />
                        <span className="text-lg font-bold text-gray-900">{formatTime(flight.arrivalTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Details Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase">FLIGHT</p>
                  <p className="text-lg font-bold text-gray-900">{flight.flightNumber}</p>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase">SEAT</p>
                  <p className="text-lg font-bold text-gray-900">{seat}</p>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase">GATE</p>
                  <p className="text-lg font-bold text-gray-900">{gate}</p>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase">TERMINAL</p>
                  <p className="text-lg font-bold text-gray-900">{terminal}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase">BOARDING TIME</p>
                  <p className="text-lg font-bold text-gray-900">{boardingTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase">CLASS</p>
                  <p className="text-lg font-bold text-gray-900">
                    {parseFloat(flight.price) > 2000 ? "BUSINESS" : "ECONOMY"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase">AIRCRAFT</p>
                  <p className="text-lg font-bold text-gray-900">{flight.aircraft}</p>
                </div>
              </div>

              {/* Payment Status */}
              {isPendingPayment ? (
                <div className="bg-red-100 border-l-4 border-red-500 p-3 mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                    <p className="text-sm text-red-800 font-bold">
                      PAYMENT REQUIRED - Ticket not valid for travel
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 p-3 mb-4">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <p className="text-sm text-green-800 font-medium">
                      Payment confirmed - Valid for travel
                    </p>
                  </div>
                </div>
              )}

              {/* Important Information */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>CHECK-IN:</strong> Online check-in opens 24hrs before departure. 
                  Arrive at airport 2hrs before international flights, 1hr before domestic.
                </p>
              </div>

              {/* Booking Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">TOTAL AMOUNT</p>
                    <p className={`text-xl font-bold ${isPendingPayment ? 'text-red-600' : 'text-green-600'}`}>
                      £{booking.totalPrice}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase">REFERENCE</p>
                    <p className="text-xl font-mono font-bold text-gray-900">{pnr}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Stub */}
            <div className="w-48 p-4 bg-gradient-to-b from-gray-100 to-gray-200 relative">
              {/* Security Pattern Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-6 gap-1 h-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="bg-gray-600 rounded-full"></div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10 h-full flex flex-col">
                {/* QR Code Section */}
                <div className="text-center mb-6">
                  <p className="text-xs text-gray-600 font-bold uppercase mb-2">BOARDING PASS</p>
                  <div className="w-20 h-20 bg-white border border-gray-300 rounded flex items-center justify-center mx-auto shadow">
                    <QrCode className="w-16 h-16 text-gray-700" />
                  </div>
                </div>

                {/* Stub Information */}
                <div className="space-y-4 text-center flex-1">
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase">FLIGHT</p>
                    <p className="text-sm font-bold text-gray-900">{flight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase">SEAT</p>
                    <p className="text-sm font-bold text-gray-900">{seat}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase">GATE</p>
                    <p className="text-sm font-bold text-gray-900">{gate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase">BOARDING</p>
                    <p className="text-sm font-bold text-gray-900">{boardingTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase">STATUS</p>
                    <p className={`text-xs font-bold ${isPendingPayment ? 'text-red-600' : 'text-green-600'}`}>
                      {isPendingPayment ? 'PENDING' : 'CONFIRMED'}
                    </p>
                  </div>
                </div>

                {/* Rotated Reference */}
                <div className="text-center mt-4">
                  <div className="transform -rotate-90">
                    <p className="text-xs text-gray-600 font-mono whitespace-nowrap">
                      {pnr}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-200 px-6 py-3 flex justify-between items-center text-xs text-gray-700">
            <div className="flex items-center space-x-3">
              <p>Valid ID required</p>
              <span>•</span>
              <p>Baggage restrictions apply</p>
            </div>
            <div className="flex items-center space-x-3">
              <p>Check airline website for updates</p>
              <span>•</span>
              <p>{new Date().getFullYear()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {isPendingPayment && (
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Complete Payment
          </Button>
        )}
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleDownloadTicket}
          disabled={isLoadingDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          {isLoadingDownload ? "Downloading..." : "Download Ticket"}
        </Button>
        <Button 
          variant="outline"
          onClick={handleEmailTicket}
          disabled={isLoadingEmail}
        >
          <Mail className="w-4 h-4 mr-2" />
          {isLoadingEmail ? "Sending..." : "Email Ticket"}
        </Button>
      </div>
    </div>
  );
}
