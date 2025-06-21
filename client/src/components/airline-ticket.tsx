import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plane, QrCode, Download, Printer } from "lucide-react";
import { Booking, Flight } from "@/../../shared/schema";

interface AirlineTicketProps {
  booking: Booking;
  flight: Flight;
  onDownload?: () => void;
  onPrint?: () => void;
}

export default function AirlineTicket({ booking, flight, onDownload, onPrint }: AirlineTicketProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const departure = formatDateTime(flight.departureTime);
  const arrival = formatDateTime(flight.arrivalTime);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Ticket Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Electronic Ticket</h1>
          <p className="text-gray-600">Confirmation Number: {booking.bookingReference}</p>
        </div>
        <div className="flex gap-2">
          {onDownload && (
            <Button variant="outline" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          {onPrint && (
            <Button variant="outline" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          )}
        </div>
      </div>

      {/* Main Ticket */}
      <Card className="overflow-hidden border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
        <CardContent className="p-0">
          {/* Airline Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">SkyBooker Airlines</h2>
                  <p className="text-blue-100">{flight.airline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100">Flight</p>
                <p className="text-2xl font-bold">{flight.flightNumber}</p>
              </div>
            </div>
          </div>

          {/* Flight Information */}
          <div className="p-6 space-y-6">
            {/* Route and Time */}
            <div className="grid grid-cols-3 gap-4">
              {/* Departure */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{flight.departureAirport}</div>
                <div className="text-sm text-gray-600 mb-2">Departure</div>
                <div className="text-lg font-semibold text-blue-600">{departure.time}</div>
                <div className="text-sm text-gray-600">{departure.date}</div>
              </div>

              {/* Flight Path */}
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="flex-1 h-0.5 bg-blue-600"></div>
                  <Plane className="h-5 w-5 text-blue-600" />
                  <div className="flex-1 h-0.5 bg-blue-600"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{flight.arrivalAirport}</div>
                <div className="text-sm text-gray-600 mb-2">Arrival</div>
                <div className="text-lg font-semibold text-blue-600">{arrival.time}</div>
                <div className="text-sm text-gray-600">{arrival.date}</div>
              </div>
            </div>

            <Separator />

            {/* Passenger and Flight Details */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Passenger</p>
                <p className="font-semibold text-gray-900">{booking.passengerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Duration</p>
                <p className="font-semibold text-gray-900">{flight.duration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Aircraft</p>
                <p className="font-semibold text-gray-900">{flight.aircraft || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Passengers</p>
                <p className="font-semibold text-gray-900">{booking.passengers}</p>
              </div>
            </div>

            <Separator />

            {/* Booking Details */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Booking Reference</p>
                <p className="font-semibold text-gray-900 font-mono">{booking.bookingReference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Total Paid</p>
                <p className="font-semibold text-green-600 text-lg">£{booking.totalPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Status</p>
                <Badge variant="default" className="bg-green-600">
                  {booking.status?.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Booking Date</p>
                <p className="font-semibold text-gray-900">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                </p>
              </div>
            </div>

            {/* Add-ons */}
            {booking.addOns && booking.addOns.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Add-ons Included</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.addOns.map((addon, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {addon}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Contact Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Contact Details</p>
                <p className="font-semibold text-gray-900">{booking.passengerEmail}</p>
                <p className="font-semibold text-gray-900">{booking.passengerPhone}</p>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Scan for check-in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                <p><strong>Important:</strong> Please arrive at the airport at least 2 hours before departure for international flights.</p>
                <p>Check-in opens 24 hours before departure. Valid photo ID required.</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">SkyBooker Airlines</p>
                <p>www.skybooker.com</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• This e-ticket is valid only for the passenger named above and the specified flight.</p>
          <p>• Changes to bookings may incur additional charges and are subject to availability.</p>
          <p>• Baggage allowances vary by fare type. Check your booking details for specific allowances.</p>
          <p>• For cancellations and refunds, please refer to our terms and conditions on our website.</p>
          <p>• Please ensure all travel documents are valid and meet destination country requirements.</p>
        </div>
      </div>
    </div>
  );
}