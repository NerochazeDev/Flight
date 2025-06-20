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
  const getAirlineLogo = (airlineCode: string) => {
    // In a real implementation, these would be actual airline logos
    const colors = {
      KL: "bg-sky-600",
      BA: "bg-blue-800", 
      FR: "bg-yellow-400",
      U2: "bg-orange-500",
    };
    return colors[airlineCode as keyof typeof colors] || "bg-gray-600";
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
      <div className="space-y-4">
        {flights.map((flight) => (
          <Card key={flight.id} className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  {/* Left side - Flight details */}
                  <div className="flex items-center space-x-6 flex-1">
                    {/* Airline logo */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 ${getAirlineLogo(flight.airlineCode)} rounded-lg flex items-center justify-center shadow-sm`}>
                        <span className="text-white font-bold text-sm">{flight.airlineCode}</span>
                      </div>
                    </div>
                    
                    {/* Flight times and route */}
                    <div className="flex items-center space-x-12 flex-1">
                      {/* Departure */}
                      <div className="text-left min-w-[100px]">
                        <div className="text-2xl font-bold text-gray-900">{flight.departureTime}</div>
                        <div className="text-sm text-gray-600 font-medium">{flight.departureAirport}</div>
                      </div>
                      
                      {/* Flight duration and route */}
                      <div className="flex flex-col items-center space-y-2 flex-1 min-w-[120px]">
                        <div className="text-xs text-gray-500 font-medium">{flight.duration}</div>
                        <div className="flex items-center space-x-3 w-full">
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <Plane className="w-4 h-4 text-gray-400 transform rotate-90" />
                          <div className="flex-1 h-px bg-gray-300"></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {(flight.stops || 0) === 0 ? "Direct" : `${flight.stops} stop${(flight.stops || 0) > 1 ? 's' : ''}`}
                        </div>
                      </div>
                      
                      {/* Arrival */}
                      <div className="text-right min-w-[100px]">
                        <div className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</div>
                        <div className="text-sm text-gray-600 font-medium">{flight.arrivalAirport}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Price and select button */}
                  <div className="flex items-center space-x-6 flex-shrink-0 ml-8">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">£{flight.price}</div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                    <Button
                      onClick={() => onFlightSelect(flight)}
                      className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom section with airline details */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700 font-medium">{flight.airline}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    {flight.amenities?.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="text-xs text-gray-500">{amenity}</span>
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
