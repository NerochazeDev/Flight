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
  onBookingComplete: (booking: Booking) => void;
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

      const booking = await response.json();
      onBookingComplete(booking);
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking reference is ${booking.bookingReference}`,
      });
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
    <Card className="shadow-lg mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Passenger Details</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={passengerDetails.firstName}
                onChange={(e) => updatePassengerDetails("firstName", e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={passengerDetails.lastName}
                onChange={(e) => updatePassengerDetails("lastName", e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={passengerDetails.email}
                onChange={(e) => updatePassengerDetails("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={passengerDetails.phone}
                onChange={(e) => updatePassengerDetails("phone", e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Add-ons</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="extraBaggage"
                  checked={addOns.extraBaggage}
                  onCheckedChange={(checked) => updateAddOns("extraBaggage", checked as boolean)}
                />
                <Label htmlFor="extraBaggage" className="text-sm text-gray-700">
                  Extra baggage (+£25)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="seatSelection"
                  checked={addOns.seatSelection}
                  onCheckedChange={(checked) => updateAddOns("seatSelection", checked as boolean)}
                />
                <Label htmlFor="seatSelection" className="text-sm text-gray-700">
                  Seat selection (+£15)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="travelInsurance"
                  checked={addOns.travelInsurance}
                  onCheckedChange={(checked) => updateAddOns("travelInsurance", checked as boolean)}
                />
                <Label htmlFor="travelInsurance" className="text-sm text-gray-700">
                  Travel insurance (+£12)
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">£{calculateTotal()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
