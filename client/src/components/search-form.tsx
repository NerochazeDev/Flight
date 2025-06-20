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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-6">
            <div className="lg:col-span-5 grid grid-cols-2 border border-gray-200 rounded-l-lg lg:rounded-r-none overflow-hidden">
              <div className="p-4 border-r border-gray-200 min-h-[80px] flex flex-col justify-center">
                <div className="text-xs text-gray-500 mb-2">From</div>
                <Select
                  value={searchParams.from}
                  onValueChange={(value) => updateSearchParams("from", value)}
                >
                  <SelectTrigger className="border-0 p-0 h-auto text-base font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LHR">London Heathrow</SelectItem>
                    <SelectItem value="LGW">London Gatwick</SelectItem>
                    <SelectItem value="STN">London Stansted</SelectItem>
                    <SelectItem value="MAN">Manchester</SelectItem>
                    <SelectItem value="BHX">Birmingham</SelectItem>
                    <SelectItem value="EDI">Edinburgh</SelectItem>
                    <SelectItem value="GLA">Glasgow</SelectItem>
                    <SelectItem value="LTN">London Luton</SelectItem>
                    <SelectItem value="BRS">Bristol</SelectItem>
                    <SelectItem value="LPL">Liverpool</SelectItem>
                    <SelectItem value="NCL">Newcastle</SelectItem>
                    <SelectItem value="LBA">Leeds Bradford</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-400 mt-1">{searchParams.from}</div>
              </div>
              <div className="p-4 relative min-h-[80px] flex flex-col justify-center">
                <div className="text-xs text-gray-500 mb-2">To</div>
                <Select
                  value={searchParams.to}
                  onValueChange={(value) => updateSearchParams("to", value)}
                >
                  <SelectTrigger className="border-0 p-0 h-auto text-base font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMS">Amsterdam</SelectItem>
                    <SelectItem value="RTM">Rotterdam</SelectItem>
                    <SelectItem value="EIN">Eindhoven</SelectItem>
                    <SelectItem value="CDG">Paris Charles de Gaulle</SelectItem>
                    <SelectItem value="ORY">Paris Orly</SelectItem>
                    <SelectItem value="FRA">Frankfurt</SelectItem>
                    <SelectItem value="MUC">Munich</SelectItem>
                    <SelectItem value="BER">Berlin</SelectItem>
                    <SelectItem value="FCO">Rome Fiumicino</SelectItem>
                    <SelectItem value="BCN">Barcelona</SelectItem>
                    <SelectItem value="MAD">Madrid</SelectItem>
                    <SelectItem value="LIS">Lisbon</SelectItem>
                    <SelectItem value="VIE">Vienna</SelectItem>
                    <SelectItem value="ZUR">Zurich</SelectItem>
                    <SelectItem value="CPH">Copenhagen</SelectItem>
                    <SelectItem value="ARN">Stockholm</SelectItem>
                    <SelectItem value="OSL">Oslo</SelectItem>
                    <SelectItem value="HEL">Helsinki</SelectItem>
                    <SelectItem value="WAW">Warsaw</SelectItem>
                    <SelectItem value="PRG">Prague</SelectItem>
                    <SelectItem value="BUD">Budapest</SelectItem>
                    <SelectItem value="ATH">Athens</SelectItem>
                    <SelectItem value="IST">Istanbul</SelectItem>
                    <SelectItem value="DUB">Dublin</SelectItem>
                    <SelectItem value="BRU">Brussels</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-400 mt-1">{searchParams.to}</div>
                <button className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 z-10">
                  <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 border-t border-r border-b border-gray-200 lg:border-t lg:border-b p-4 min-h-[80px] flex flex-col justify-center">
              <div className="text-xs text-gray-500 mb-2">Depart</div>
              <Input
                type="date"
                value={searchParams.departure}
                onChange={(e) => updateSearchParams("departure", e.target.value)}
                className="border-0 p-0 h-auto text-base font-medium"
              />
            </div>

            <div className="lg:col-span-2 border-t border-r border-b border-gray-200 lg:border-t lg:border-b p-4 min-h-[80px] flex flex-col justify-center">
              <div className="text-xs text-gray-500 mb-2">Return</div>
              <Input
                type="date"
                value={searchParams.return}
                onChange={(e) => updateSearchParams("return", e.target.value)}
                className="border-0 p-0 h-auto text-base font-medium"
              />
            </div>

            <div className="lg:col-span-3 border border-gray-200 rounded-r-lg lg:rounded-l-none p-4 min-h-[80px] flex flex-col justify-center">
              <div className="text-xs text-gray-500 mb-2">Passengers</div>
              <Select
                value={searchParams.passengers.toString()}
                onValueChange={(value) => updateSearchParams("passengers", parseInt(value))}
              >
                <SelectTrigger className="border-0 p-0 h-auto text-base font-medium">
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
