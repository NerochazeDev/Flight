import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, ArrowLeft, Filter, SlidersHorizontal } from "lucide-react";
import type { Flight } from "@shared/schema";

interface FlightResultsProps {
  flights: Flight[];
  onFlightSelect: (flight: Flight) => void;
  onBackToSearch: () => void;
}

export default function FlightResults({ flights, onFlightSelect, onBackToSearch }: FlightResultsProps) {
  const getAirlineLogo = (code: string) => {
    const logos = {
      KL: "bg-blue-600",
      BA: "bg-red-600", 
      FR: "bg-yellow-500",
      U2: "bg-orange-500",
      EK: "bg-red-700",
      AF: "bg-blue-800",
      VS: "bg-red-500",
      VY: "bg-purple-600",
      AZ: "bg-green-600",
      LH: "bg-yellow-600",
      JL: "bg-red-800",
      QF: "bg-orange-600",
    };
    return logos[code as keyof typeof logos] || "bg-gray-600";
  };

  const isPremiumFlight = (price: string) => {
    return parseFloat(price) > 2000;
  };

  const getFlightClass = (price: string, amenities: string[]) => {
    const priceNum = parseFloat(price);
    if (priceNum > 4000) return "First Class";
    if (priceNum > 2000) return "Business Class";
    if (amenities.some(a => a.includes("Premium"))) return "Premium Economy";
    return "Economy";
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center space-x-4">
          <Button onClick={onBackToSearch} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Edit search
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">Choose a departing flight</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="text-gray-600">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      {/* Sort options */}
      <div className="flex space-x-2 mb-6">
        <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">
          Best
        </Button>
        <Button variant="outline" size="sm" className="text-gray-600">
          Cheapest
        </Button>
        <Button variant="outline" size="sm" className="text-gray-600">
          Fastest
        </Button>
      </div>

      {/* Flight Cards */}
      <div className="space-y-3">
        {flights.map((flight) => (
          <Card key={flight.id} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Airline Logo & Times */}
                <div className="flex items-center space-x-6">
                  <div className={`w-8 h-8 ${getAirlineLogo(flight.airlineCode)} rounded flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">{flight.airlineCode}</span>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{flight.departureTime}</div>
                      <div className="text-sm text-gray-500">{flight.departureAirport}</div>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <div className="text-xs text-gray-500">{flight.duration}</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-px bg-gray-300"></div>
                        <Plane className="w-4 h-4 text-gray-400" />
                        <div className="w-16 h-px bg-gray-300"></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {(flight.stops || 0) === 0 ? "Direct" : `${flight.stops} stop${(flight.stops || 0) > 1 ? 's' : ''}`}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{flight.arrivalTime}</div>
                      <div className="text-sm text-gray-500">{flight.arrivalAirport}</div>
                    </div>
                  </div>
                </div>

                {/* Price & Select */}
                <div className="flex items-center space-x-4">
                  <div className="text-right min-w-[120px]">
                    <div className="text-2xl font-bold text-gray-900">£{flight.price}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                  <Button
                    onClick={() => onFlightSelect(flight)}
                    className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-6 py-2 rounded-full font-medium whitespace-nowrap"
                  >
                    Select
                  </Button>
                </div>
              </div>

              {/* Airline name and details */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{flight.airline} • {flight.flightNumber}</span>
                  <div className="flex items-center space-x-4">
                    {flight.amenities?.slice(0, 2).map((amenity, index) => (
                      <span key={index} className="text-xs">{amenity}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}