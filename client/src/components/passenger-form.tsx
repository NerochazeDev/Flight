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
  onContinueToPayment: (details: PassengerDetails, addOns: string[], total: string) => void;
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
  priorityBoarding: boolean;
  loungeAccess: boolean;
  mealUpgrade: boolean;
  extraLegroom: boolean;
}

export default function PassengerForm({ flight, passengers, onContinueToPayment, onBack }: PassengerFormProps) {
  const { toast } = useToast();
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
    priorityBoarding: false,
    loungeAccess: false,
    mealUpgrade: false,
    extraLegroom: false,
  });

  const calculateTotal = () => {
    let total = parseFloat(flight.price) * passengers;
    if (addOns.extraBaggage) total += 35;
    if (addOns.seatSelection) total += 25;
    if (addOns.travelInsurance) total += 18;
    if (addOns.priorityBoarding) total += 15;
    if (addOns.loungeAccess) total += 45;
    if (addOns.mealUpgrade) total += 28;
    if (addOns.extraLegroom) total += 40;
    return total.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAddOns = [];
    if (addOns.extraBaggage) selectedAddOns.push("Extra baggage");
    if (addOns.seatSelection) selectedAddOns.push("Seat selection");
    if (addOns.travelInsurance) selectedAddOns.push("Travel insurance");
    if (addOns.priorityBoarding) selectedAddOns.push("Priority boarding");
    if (addOns.loungeAccess) selectedAddOns.push("Lounge access");
    if (addOns.mealUpgrade) selectedAddOns.push("Meal upgrade");
    if (addOns.extraLegroom) selectedAddOns.push("Extra legroom");

    onContinueToPayment(passengerDetails, selectedAddOns, calculateTotal());
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
            <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">✈️ Flight Add-ons & Upgrades</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  id="extraBaggage"
                  checked={addOns.extraBaggage}
                  onCheckedChange={(checked) => updateAddOns("extraBaggage", checked as boolean)}
                />
                <Label htmlFor="extraBaggage" className="text-sm font-medium cursor-pointer">
                  🧳 Extra baggage (+£35)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  id="seatSelection"
                  checked={addOns.seatSelection}
                  onCheckedChange={(checked) => updateAddOns("seatSelection", checked as boolean)}
                />
                <Label htmlFor="seatSelection" className="text-sm font-medium cursor-pointer">
                  💺 Seat selection (+£25)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  id="travelInsurance"
                  checked={addOns.travelInsurance}
                  onCheckedChange={(checked) => updateAddOns("travelInsurance", checked as boolean)}
                />
                <Label htmlFor="travelInsurance" className="text-sm font-medium cursor-pointer">
                  🛡️ Travel insurance (+£18)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  id="priorityBoarding"
                  checked={addOns.priorityBoarding}
                  onCheckedChange={(checked) => updateAddOns("priorityBoarding", checked as boolean)}
                />
                <Label htmlFor="priorityBoarding" className="text-sm font-medium cursor-pointer">
                  🚶‍♂️ Priority boarding (+£15)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  id="loungeAccess"
                  checked={addOns.loungeAccess}
                  onCheckedChange={(checked) => updateAddOns("loungeAccess", checked as boolean)}
                />
                <Label htmlFor="loungeAccess" className="text-sm font-medium cursor-pointer">
                  🍸 Airport lounge access (+£45)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  id="mealUpgrade"
                  checked={addOns.mealUpgrade}
                  onCheckedChange={(checked) => updateAddOns("mealUpgrade", checked as boolean)}
                />
                <Label htmlFor="mealUpgrade" className="text-sm font-medium cursor-pointer">
                  🍽️ Premium meal upgrade (+£28)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  id="extraLegroom"
                  checked={addOns.extraLegroom}
                  onCheckedChange={(checked) => updateAddOns("extraLegroom", checked as boolean)}
                />
                <Label htmlFor="extraLegroom" className="text-sm font-medium cursor-pointer">
                  📏 Extra legroom seat (+£40)
                </Label>
              </div>
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
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}