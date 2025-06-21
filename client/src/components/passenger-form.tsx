
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Flight, Booking } from "@shared/schema";

interface PassengerFormProps {
  flight: Flight;
  passengers: number;
  onContinueToPayment: (details: PassengerDetails, addOns: string[], total: string) => void;
  onBack: () => void;
}

interface PassengerDetails {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  specialRequests: string;
  frequentFlyer: string;
}

interface AddOns {
  extraBaggage: boolean;
  seatSelection: boolean;
  travelInsurance: boolean;
  priorityBoarding: boolean;
  loungeAccess: boolean;
  mealUpgrade: boolean;
  extraLegroom: boolean;
  wifiAccess: boolean;
}

export default function PassengerForm({ flight, passengers, onContinueToPayment, onBack }: PassengerFormProps) {
  const { toast } = useToast();
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails>({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    email: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    specialRequests: "",
    frequentFlyer: "",
  });
  
  const [addOns, setAddOns] = useState<AddOns>({
    extraBaggage: false,
    seatSelection: false,
    travelInsurance: false,
    priorityBoarding: false,
    loungeAccess: false,
    mealUpgrade: false,
    extraLegroom: false,
    wifiAccess: false,
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const calculateTotal = () => {
    let total = parseFloat(flight.price) * passengers;
    if (addOns.extraBaggage) total += 45;
    if (addOns.seatSelection) total += 35;
    if (addOns.travelInsurance) total += 28;
    if (addOns.priorityBoarding) total += 25;
    if (addOns.loungeAccess) total += 65;
    if (addOns.mealUpgrade) total += 38;
    if (addOns.extraLegroom) total += 55;
    if (addOns.wifiAccess) total += 18;
    return total.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: "Terms and Conditions Required",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive",
      });
      return;
    }

    const selectedAddOns = [];
    if (addOns.extraBaggage) selectedAddOns.push("Extra baggage");
    if (addOns.seatSelection) selectedAddOns.push("Seat selection");
    if (addOns.travelInsurance) selectedAddOns.push("Travel insurance");
    if (addOns.priorityBoarding) selectedAddOns.push("Priority boarding");
    if (addOns.loungeAccess) selectedAddOns.push("Lounge access");
    if (addOns.mealUpgrade) selectedAddOns.push("Meal upgrade");
    if (addOns.extraLegroom) selectedAddOns.push("Extra legroom");
    if (addOns.wifiAccess) selectedAddOns.push("WiFi access");

    onContinueToPayment(passengerDetails, selectedAddOns, calculateTotal());
  };

  const updatePassengerDetails = (key: keyof PassengerDetails, value: string) => {
    setPassengerDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateAddOns = (key: keyof AddOns, checked: boolean) => {
    setAddOns(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="space-y-6">
      {/* Passenger Information */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="flex items-center text-xl text-gray-900">
            <User className="w-5 h-5 mr-2" />
            Passenger Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Please ensure all details match your passport or travel document exactly
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">Personal Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Select value={passengerDetails.title} onValueChange={(value) => updatePassengerDetails("title", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Miss">Miss</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={passengerDetails.firstName}
                    onChange={(e) => updatePassengerDetails("firstName", e.target.value)}
                    placeholder="As shown on passport"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={passengerDetails.middleName}
                    onChange={(e) => updatePassengerDetails("middleName", e.target.value)}
                    placeholder="If applicable"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={passengerDetails.lastName}
                    onChange={(e) => updatePassengerDetails("lastName", e.target.value)}
                    placeholder="As shown on passport"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={passengerDetails.dateOfBirth}
                      onChange={(e) => updatePassengerDetails("dateOfBirth", e.target.value)}
                      className="pl-10"
                      max={new Date(Date.now() - 567648000000).toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select value={passengerDetails.nationality} onValueChange={(value) => updatePassengerDetails("nationality", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="IE">Ireland</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="ES">Spain</SelectItem>
                      <SelectItem value="IT">Italy</SelectItem>
                      <SelectItem value="NL">Netherlands</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Travel Document */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">Travel Document</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number *</Label>
                  <Input
                    id="passportNumber"
                    value={passengerDetails.passportNumber}
                    onChange={(e) => updatePassengerDetails("passportNumber", e.target.value)}
                    placeholder="Enter passport number"
                    className="uppercase"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passportExpiry">Passport Expiry *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="passportExpiry"
                      type="date"
                      value={passengerDetails.passportExpiry}
                      onChange={(e) => updatePassengerDetails("passportExpiry", e.target.value)}
                      className="pl-10"
                      min={new Date(Date.now() + 15552000000).toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Important:</p>
                    <p>Your passport must be valid for at least 6 months from your travel date. Ensure all details match your passport exactly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={passengerDetails.email}
                      onChange={(e) => updatePassengerDetails("email", e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={passengerDetails.phone}
                      onChange={(e) => updatePassengerDetails("phone", e.target.value)}
                      placeholder="+44 7XXX XXX XXX"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={passengerDetails.emergencyContact}
                    onChange={(e) => updatePassengerDetails("emergencyContact", e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={passengerDetails.emergencyPhone}
                    onChange={(e) => updatePassengerDetails("emergencyPhone", e.target.value)}
                    placeholder="+44 7XXX XXX XXX"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">Additional Information</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequentFlyer">Frequent Flyer Number (Optional)</Label>
                  <Input
                    id="frequentFlyer"
                    value={passengerDetails.frequentFlyer}
                    onChange={(e) => updatePassengerDetails("frequentFlyer", e.target.value)}
                    placeholder="Enter your frequent flyer number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Input
                    id="specialRequests"
                    value={passengerDetails.specialRequests}
                    onChange={(e) => updatePassengerDetails("specialRequests", e.target.value)}
                    placeholder="Dietary requirements, wheelchair assistance, etc."
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add-ons and Extras */}
      <Card className="shadow-lg">
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="text-xl text-gray-900">Enhance Your Journey</CardTitle>
          <p className="text-sm text-gray-600">
            Add extra services to make your trip more comfortable
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="extraBaggage"
                  checked={addOns.extraBaggage}
                  onCheckedChange={(checked) => updateAddOns("extraBaggage", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="extraBaggage" className="font-medium cursor-pointer">
                    Extra Checked Baggage
                  </Label>
                  <p className="text-sm text-gray-600">Additional 23kg checked bag</p>
                </div>
                <span className="font-bold text-green-600">+£45</span>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="seatSelection"
                  checked={addOns.seatSelection}
                  onCheckedChange={(checked) => updateAddOns("seatSelection", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="seatSelection" className="font-medium cursor-pointer">
                    Seat Selection
                  </Label>
                  <p className="text-sm text-gray-600">Choose your preferred seat</p>
                </div>
                <span className="font-bold text-green-600">+£35</span>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="travelInsurance"
                  checked={addOns.travelInsurance}
                  onCheckedChange={(checked) => updateAddOns("travelInsurance", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="travelInsurance" className="font-medium cursor-pointer">
                    Travel Insurance
                  </Label>
                  <p className="text-sm text-gray-600">Comprehensive travel protection</p>
                </div>
                <span className="font-bold text-green-600">+£28</span>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="priorityBoarding"
                  checked={addOns.priorityBoarding}
                  onCheckedChange={(checked) => updateAddOns("priorityBoarding", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="priorityBoarding" className="font-medium cursor-pointer">
                    Priority Boarding
                  </Label>
                  <p className="text-sm text-gray-600">Board the aircraft first</p>
                </div>
                <span className="font-bold text-green-600">+£25</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="loungeAccess"
                  checked={addOns.loungeAccess}
                  onCheckedChange={(checked) => updateAddOns("loungeAccess", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="loungeAccess" className="font-medium cursor-pointer">
                    Airport Lounge Access
                  </Label>
                  <p className="text-sm text-gray-600">Relax in comfort before your flight</p>
                </div>
                <span className="font-bold text-green-600">+£65</span>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="mealUpgrade"
                  checked={addOns.mealUpgrade}
                  onCheckedChange={(checked) => updateAddOns("mealUpgrade", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="mealUpgrade" className="font-medium cursor-pointer">
                    Premium Meal Service
                  </Label>
                  <p className="text-sm text-gray-600">Gourmet dining experience</p>
                </div>
                <span className="font-bold text-green-600">+£38</span>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="extraLegroom"
                  checked={addOns.extraLegroom}
                  onCheckedChange={(checked) => updateAddOns("extraLegroom", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="extraLegroom" className="font-medium cursor-pointer">
                    Extra Legroom Seat
                  </Label>
                  <p className="text-sm text-gray-600">More space to stretch out</p>
                </div>
                <span className="font-bold text-green-600">+£55</span>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="wifiAccess"
                  checked={addOns.wifiAccess}
                  onCheckedChange={(checked) => updateAddOns("wifiAccess", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="wifiAccess" className="font-medium cursor-pointer">
                    In-flight WiFi
                  </Label>
                  <p className="text-sm text-gray-600">Stay connected during your flight</p>
                </div>
                <span className="font-bold text-green-600">+£18</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Total */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox 
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
                required
              />
              <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                I accept the <a href="#" className="text-blue-600 underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>
              </Label>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-3xl font-bold text-blue-600">£{calculateTotal()}</span>
              </div>

              <div className="flex items-center justify-between">
                <Button type="button" variant="outline" onClick={onBack} className="px-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Results
                </Button>
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
