import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, Wifi, Coffee, Luggage, Ban, ShoppingCart, ArrowLeft } from "lucide-react";
import type { Flight } from "@shared/schema";

interface FlightResultsProps {
  flights: Flight[];
  onFlightSelect: (flight: Flight) => void;
  onBackToSearch: () => void;
}

export default function FlightResults({ flights, onFlightSelect, onBackToSearch }: FlightResultsProps) {
  const getAirlineIcon = (airlineCode: string) => {
    const colors = {
      KL: "bg-blue-600",
      BA: "bg-red-600", 
      FR: "bg-yellow-500",
      U2: "bg-orange-500",
    };
    return colors[airlineCode as keyof typeof colors] || "bg-gray-600";
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("WiFi")) return <Wifi className="w-4 h-4" />;
    if (amenity.includes("Meal") || amenity.includes("Snack")) return <Coffee className="w-4 h-4" />;
    if (amenity.includes("Checked bag")) return <Luggage className="w-4 h-4" />;
    if (amenity.includes("No checked bag")) return <Ban className="w-4 h-4 text-red-500" />;
    if (amenity.includes("Food for purchase")) return <ShoppingCart className="w-4 h-4" />;
    return null;
  };

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
        <Button onClick={onBackToSearch} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBackToSearch} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <h3 className="text-xl font-bold text-gray-900">Available Flights</h3>
        </div>
        <div className="flex items-center space-x-4">
          <Select defaultValue="price">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Sort by Price</SelectItem>
              <SelectItem value="duration">Sort by Duration</SelectItem>
              <SelectItem value="departure">Sort by Departure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {flights.map((flight) => (
        <Card key={flight.id} className="shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${getAirlineIcon(flight.airlineCode)} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{flight.airlineCode}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{flight.airline}</h4>
                  <p className="text-sm text-gray-600">{flight.flightNumber} • Economy</p>
                </div>
                {parseFloat(flight.price) < 100 && (
                  <Badge className="bg-accent-orange text-white">Best Price</Badge>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">£{flight.price}</div>
                <div className="text-sm text-gray-600">per person</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{flight.departureTime}</div>
                <div className="text-sm text-gray-600">{flight.departureAirport}</div>
                <div className="text-xs text-gray-500">
                  {flight.departureAirport === "LHR" && "London Heathrow"}
                  {flight.departureAirport === "LGW" && "London Gatwick"}
                  {flight.departureAirport === "STN" && "London Stansted"}
                  {flight.departureAirport === "MAN" && "Manchester"}
                  {flight.departureAirport === "BHX" && "Birmingham"}
                  {flight.departureAirport === "EDI" && "Edinburgh"}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-16 h-px bg-gray-300"></div>
                  <Plane className="text-primary w-4 h-4" />
                  <div className="w-16 h-px bg-gray-300"></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{flight.duration}</div>
                <div className="text-xs text-gray-500">{flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{flight.arrivalTime}</div>
                <div className="text-sm text-gray-600">{flight.arrivalAirport}</div>
                <div className="text-xs text-gray-500">
                  {flight.arrivalAirport === "AMS" && "Amsterdam"}
                  {flight.arrivalAirport === "RTM" && "Rotterdam"}
                  {flight.arrivalAirport === "EIN" && "Eindhoven"}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {flight.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => onFlightSelect(flight)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2"
              >
                Select Flight
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
