import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Flight, Booking } from "@shared/schema";

interface PassengerFormProps {
  flight: Flight;
  passengers: number;
  onBookingComplete: (totalAmount: string) => void;
  onBack: () => void;
}

interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AddOns {
  extraBaggage: boolean;
  seatSelection: boolean;
  travelInsurance: boolean;
}

export default function PassengerForm({ flight, passengers, onBookingComplete, onBack }: PassengerFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [addOns, setAddOns] = useState<AddOns>({
    extraBaggage: false,
    seatSelection: false,
    travelInsurance: false,
  });

  const calculateTotal = () => {
    let total = parseFloat(flight.price) * passengers;
    if (addOns.extraBaggage) total += 25;
    if (addOns.seatSelection) total += 15;
    if (addOns.travelInsurance) total += 12;
    return total.toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedAddOns = [];
      if (addOns.extraBaggage) selectedAddOns.push("Extra baggage");
      if (addOns.seatSelection) selectedAddOns.push("Seat selection");
      if (addOns.travelInsurance) selectedAddOns.push("Travel insurance");

      const bookingData = {
        flightId: flight.id,
        passengerName: `${passengerDetails.firstName} ${passengerDetails.lastName}`,
        passengerEmail: passengerDetails.email,
        passengerPhone: passengerDetails.phone,
        passengers,
        totalPrice: calculateTotal(),
        addOns: selectedAddOns,
        status: "confirmed",
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      // Pass total amount to proceed to payment
      onBookingComplete(calculateTotal());
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePassengerDetails = (key: keyof PassengerDetails, value: string) => {
    setPassengerDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateAddOns = (key: keyof AddOns, checked: boolean) => {
    setAddOns(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">Passenger details</h3>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First name *</Label>
                <Input
                  id="firstName"
                  value={passengerDetails.firstName}
                  onChange={(e) => updatePassengerDetails("firstName", e.target.value)}
                  placeholder="First name"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last name *</Label>
                <Input
                  id="lastName"
                  value={passengerDetails.lastName}
                  onChange={(e) => updatePassengerDetails("lastName", e.target.value)}
                  placeholder="Last name"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={passengerDetails.email}
                  onChange={(e) => updatePassengerDetails("email", e.target.value)}
                  placeholder="Email address"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={passengerDetails.phone}
                  onChange={(e) => updatePassengerDetails("phone", e.target.value)}
                  placeholder="Phone number"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Extras</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="extraBaggage"
                      checked={addOns.extraBaggage}
                      onCheckedChange={(checked) => updateAddOns("extraBaggage", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="extraBaggage" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Extra baggage
                      </Label>
                      <p className="text-xs text-gray-500">Additional 20kg checked bag</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">+£25</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="seatSelection"
                      checked={addOns.seatSelection}
                      onCheckedChange={(checked) => updateAddOns("seatSelection", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="seatSelection" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Seat selection
                      </Label>
                      <p className="text-xs text-gray-500">Choose your preferred seat</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">+£15</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="travelInsurance"
                      checked={addOns.travelInsurance}
                      onCheckedChange={(checked) => updateAddOns("travelInsurance", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="travelInsurance" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Travel insurance
                      </Label>
                      <p className="text-xs text-gray-500">Coverage for trip cancellation and medical expenses</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">+£12</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Total price</p>
                    <p className="text-sm text-gray-600">{passengers} passenger{passengers > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">£{calculateTotal()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="px-6 py-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-8 py-3 rounded-full font-semibold shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue to payment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
