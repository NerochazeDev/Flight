import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plane, ArrowLeftRight, Calendar, Users } from "lucide-react";
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

  return (
    <Card className="bg-white shadow-xl border-0 rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-white border-b p-4">
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
              <Plane className="h-4 w-4" />
              <span>Flights</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">
              <span>Hotels</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">
              <span>Car hire</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <div className="lg:col-span-2 grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-r border-gray-200">
                <div className="text-xs text-gray-500 mb-1">From</div>
                <Select
                  value={searchParams.from}
                  onValueChange={(value) => updateSearchParams("from", value)}
                >
                  <SelectTrigger className="border-0 p-0 h-auto text-lg font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LHR">🇬🇧 London Heathrow (LHR)</SelectItem>
                    <SelectItem value="LGW">🇬🇧 London Gatwick (LGW)</SelectItem>
                    <SelectItem value="STN">🇬🇧 London Stansted (STN)</SelectItem>
                    <SelectItem value="MAN">🇬🇧 Manchester (MAN)</SelectItem>
                    <SelectItem value="BHX">🇬🇧 Birmingham (BHX)</SelectItem>
                    <SelectItem value="EDI">🇬🇧 Edinburgh (EDI)</SelectItem>
                    <SelectItem value="DUB">🇮🇪 Dublin (DUB)</SelectItem>
                    <SelectItem value="CDG">🇫🇷 Paris Charles de Gaulle (CDG)</SelectItem>
                    <SelectItem value="FRA">🇩🇪 Frankfurt (FRA)</SelectItem>
                    <SelectItem value="AMS">🇳🇱 Amsterdam (AMS)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-400">{searchParams.from}</div>
              </div>
              <div className="p-4 relative">
                <div className="text-xs text-gray-500 mb-1">To</div>
                <Select
                  value={searchParams.to}
                  onValueChange={(value) => updateSearchParams("to", value)}
                >
                  <SelectTrigger className="border-0 p-0 h-auto text-lg font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMS">🇳🇱 Amsterdam (AMS)</SelectItem>
                    <SelectItem value="CDG">🇫🇷 Paris Charles de Gaulle (CDG)</SelectItem>
                    <SelectItem value="JFK">🇺🇸 New York JFK (JFK)</SelectItem>
                    <SelectItem value="DXB">🇦🇪 Dubai (DXB)</SelectItem>
                    <SelectItem value="BCN">🇪🇸 Barcelona (BCN)</SelectItem>
                    <SelectItem value="FCO">🇮🇹 Rome Fiumicino (FCO)</SelectItem>
                    <SelectItem value="FRA">🇩🇪 Frankfurt (FRA)</SelectItem>
                    <SelectItem value="NRT">🇯🇵 Tokyo Narita (NRT)</SelectItem>
                    <SelectItem value="SYD">🇦🇺 Sydney (SYD)</SelectItem>
                    <SelectItem value="LAX">🇺🇸 Los Angeles (LAX)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-400">{searchParams.to}</div>
                <button className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50">
                  <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Depart</div>
              <Input
                type="date"
                value={searchParams.departure}
                onChange={(e) => updateSearchParams("departure", e.target.value)}
                className="border-0 p-0 h-auto text-lg font-medium"
              />
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Return</div>
              <Input
                type="date"
                value={searchParams.return}
                onChange={(e) => updateSearchParams("return", e.target.value)}
                className="border-0 p-0 h-auto text-lg font-medium"
              />
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Passengers</div>
              <Select
                value={searchParams.passengers.toString()}
                onValueChange={(value) => updateSearchParams("passengers", parseInt(value))}
              >
                <SelectTrigger className="border-0 p-0 h-auto text-lg font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Adult</SelectItem>
                  <SelectItem value="2">2 Adults</SelectItem>
                  <SelectItem value="3">3 Adults</SelectItem>
                  <SelectItem value="4">4 Adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Class</div>
              <Select
                value={searchParams.class}
                onValueChange={(value) => updateSearchParams("class", value)}
              >
                <SelectTrigger className="border-0 p-0 h-auto text-lg font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">✈️ Economy Class</SelectItem>
                  <SelectItem value="premium">🛋️ Premium Economy</SelectItem>
                  <SelectItem value="business">💼 Business Class</SelectItem>
                  <SelectItem value="first">👑 First Class</SelectItem>
                  <SelectItem value="private">🛩️ Private Jet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search flights"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}