import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plane, PlaneTakeoff, PlaneLanding, Search } from "lucide-react";
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
    <Card className="shadow-lg mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Flight</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <div className="relative">
                <Select
                  value={searchParams.from}
                  onValueChange={(value) => updateSearchParams("from", value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LHR">London Heathrow (LHR)</SelectItem>
                    <SelectItem value="LGW">London Gatwick (LGW)</SelectItem>
                    <SelectItem value="STN">London Stansted (STN)</SelectItem>
                    <SelectItem value="MAN">Manchester (MAN)</SelectItem>
                    <SelectItem value="BHX">Birmingham (BHX)</SelectItem>
                    <SelectItem value="EDI">Edinburgh (EDI)</SelectItem>
                  </SelectContent>
                </Select>
                <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <div className="relative">
                <Select
                  value={searchParams.to}
                  onValueChange={(value) => updateSearchParams("to", value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMS">Amsterdam (AMS)</SelectItem>
                    <SelectItem value="RTM">Rotterdam (RTM)</SelectItem>
                    <SelectItem value="EIN">Eindhoven (EIN)</SelectItem>
                  </SelectContent>
                </Select>
                <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departure">Departure</Label>
              <Input
                type="date"
                value={searchParams.departure}
                onChange={(e) => updateSearchParams("departure", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="return">Return</Label>
              <Input
                type="date"
                value={searchParams.return}
                onChange={(e) => updateSearchParams("return", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <Label htmlFor="passengers">Passengers</Label>
                <Select
                  value={searchParams.passengers.toString()}
                  onValueChange={(value) => updateSearchParams("passengers", parseInt(value))}
                >
                  <SelectTrigger className="w-32">
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
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={searchParams.class}
                  onValueChange={(value) => updateSearchParams("class", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3"
              disabled={isSearching}
            >
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? "Searching..." : "Search Flights"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
