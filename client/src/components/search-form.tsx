
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plane, ArrowLeftRight, Calendar, Users, MapPin } from "lucide-react";
import type { SearchParams } from "@/pages/home";

interface SearchFormProps {
  searchParams: SearchParams;
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
}

export default function SearchForm({ searchParams, onSearch, isSearching }: SearchFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const updateSearchParams = (key: keyof SearchParams, value: string | number) => {
    onSearch({ ...searchParams, [key]: value });
  };

  const [tripType, setTripType] = useState("round-trip");

  return (
    <Card className="bg-white shadow-xl border-0 rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h2 className="text-2xl font-bold mb-4">Book Your Flight</h2>
          
          {/* Trip Type Selection */}
          <RadioGroup value={tripType} onValueChange={setTripType} className="flex space-x-6 mb-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="round-trip" id="round-trip" className="border-white text-white" />
              <Label htmlFor="round-trip" className="text-white cursor-pointer">Round trip</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-way" id="one-way" className="border-white text-white" />
              <Label htmlFor="one-way" className="text-white cursor-pointer">One way</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multi-city" id="multi-city" className="border-white text-white" />
              <Label htmlFor="multi-city" className="text-white cursor-pointer">Multi-city</Label>
            </div>
          </RadioGroup>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Origin and Destination */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Flying from</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Select
                  value={searchParams.from}
                  onValueChange={(value) => updateSearchParams("from", value)}
                >
                  <SelectTrigger className="pl-10 h-12 border-gray-300">
                    <SelectValue placeholder="Select departure city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LHR">London Heathrow (LHR)</SelectItem>
                    <SelectItem value="LGW">London Gatwick (LGW)</SelectItem>
                    <SelectItem value="STN">London Stansted (STN)</SelectItem>
                    <SelectItem value="MAN">Manchester (MAN)</SelectItem>
                    <SelectItem value="BHX">Birmingham (BHX)</SelectItem>
                    <SelectItem value="EDI">Edinburgh (EDI)</SelectItem>
                    <SelectItem value="DUB">Dublin (DUB)</SelectItem>
                    <SelectItem value="CDG">Paris Charles de Gaulle (CDG)</SelectItem>
                    <SelectItem value="FRA">Frankfurt (FRA)</SelectItem>
                    <SelectItem value="AMS">Amsterdam (AMS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Flying to</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Select
                  value={searchParams.to}
                  onValueChange={(value) => updateSearchParams("to", value)}
                >
                  <SelectTrigger className="pl-10 h-12 border-gray-300">
                    <SelectValue placeholder="Select destination city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMS">Amsterdam (AMS)</SelectItem>
                    <SelectItem value="CDG">Paris Charles de Gaulle (CDG)</SelectItem>
                    <SelectItem value="JFK">New York JFK (JFK)</SelectItem>
                    <SelectItem value="DXB">Dubai (DXB)</SelectItem>
                    <SelectItem value="BCN">Barcelona (BCN)</SelectItem>
                    <SelectItem value="FCO">Rome Fiumicino (FCO)</SelectItem>
                    <SelectItem value="FRA">Frankfurt (FRA)</SelectItem>
                    <SelectItem value="NRT">Tokyo Narita (NRT)</SelectItem>
                    <SelectItem value="SYD">Sydney (SYD)</SelectItem>
                    <SelectItem value="LAX">Los Angeles (LAX)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Departure date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={searchParams.departure}
                  onChange={(e) => updateSearchParams("departure", e.target.value)}
                  className="pl-10 h-12 border-gray-300"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {tripType === "round-trip" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Return date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={searchParams.return}
                    onChange={(e) => updateSearchParams("return", e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                    min={searchParams.departure}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Select
                  value={searchParams.passengers.toString()}
                  onValueChange={(value) => updateSearchParams("passengers", parseInt(value))}
                >
                  <SelectTrigger className="pl-10 h-12 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Adult</SelectItem>
                    <SelectItem value="2">2 Adults</SelectItem>
                    <SelectItem value="3">3 Adults</SelectItem>
                    <SelectItem value="4">4 Adults</SelectItem>
                    <SelectItem value="5">5 Adults</SelectItem>
                    <SelectItem value="6">6 Adults</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Class</Label>
              <Select
                value={searchParams.class}
                onValueChange={(value) => updateSearchParams("class", value)}
              >
                <SelectTrigger className="h-12 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy Class</SelectItem>
                  <SelectItem value="premium">Premium Economy</SelectItem>
                  <SelectItem value="business">Business Class</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Preferences (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Preferred airline</Label>
                <Select>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Any airline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any airline</SelectItem>
                    <SelectItem value="BA">British Airways</SelectItem>
                    <SelectItem value="VS">Virgin Atlantic</SelectItem>
                    <SelectItem value="EK">Emirates</SelectItem>
                    <SelectItem value="LH">Lufthansa</SelectItem>
                    <SelectItem value="AF">Air France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Maximum stops</Label>
                <Select>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="0">Non-stop only</SelectItem>
                    <SelectItem value="1">Up to 1 stop</SelectItem>
                    <SelectItem value="2">Up to 2 stops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Departure time</Label>
                <Select>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                    <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 text-lg font-semibold shadow-lg rounded-lg"
              disabled={isSearching}
            >
              <Plane className="w-5 h-5 mr-2" />
              {isSearching ? "Searching flights..." : "Search flights"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
