
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Shield, Lock, AlertTriangle, Building, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Flight, Booking } from "@shared/schema";

interface PaymentFormProps {
  flight: Flight;
  passengers: number;
  totalAmount: string;
  passengerDetails: any;
  addOns: string[];
  onPaymentComplete: (booking: Booking) => void;
  onBack: () => void;
}

export default function PaymentForm({
  flight,
  passengers,
  totalAmount,
  passengerDetails,
  addOns,
  onPaymentComplete,
  onBack
}: PaymentFormProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    type: ""
  });
  const [billingAddress, setBillingAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: ""
  });
  const [giftCardCode, setGiftCardCode] = useState("");
  const [selectedGiftCard, setSelectedGiftCard] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the booking terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === "gift") {
      if (!selectedGiftCard || !giftCardCode.trim()) {
        toast({
          title: "Gift card details required",
          description: "Please select a gift card type and enter the code",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
    } else if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast({
          title: "Card details required",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
    }

    try {
      const bookingData = {
        flightId: flight.id,
        passengerName: `${passengerDetails.firstName} ${passengerDetails.lastName}`,
        passengerEmail: passengerDetails.email,
        passengerPhone: passengerDetails.phone,
        passengers,
        totalPrice: totalAmount,
        addOns,
        status: "confirmed",
        paymentMethod: paymentMethod === "gift" ? `Gift Card: ${selectedGiftCard}` : `Card ending ${cardDetails.number.slice(-4)}`,
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
      onPaymentComplete(booking);

      toast({
        title: "Payment Successful!",
        description: `Your booking confirmation is ${booking.bookingReference}`,
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipPayment = async () => {
    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the booking terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const bookingData = {
        flightId: flight.id,
        passengerName: `${passengerDetails.firstName} ${passengerDetails.lastName}`,
        passengerEmail: passengerDetails.email,
        passengerPhone: passengerDetails.phone,
        passengers,
        totalPrice: totalAmount,
        addOns,
        status: "pending",
        paymentMethod: "Pending Payment",
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
      onPaymentComplete(booking);

      toast({
        title: "Booking Reserved",
        description: `Reference: ${booking.bookingReference}. Complete payment within 24 hours.`,
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.match(/^4/)) return 'visa';
    if (cleanNumber.match(/^5[1-5]/)) return 'mastercard';
    if (cleanNumber.match(/^3[47]/)) return 'amex';
    return '';
  };

  const updateCardDetails = (key: keyof typeof cardDetails, value: string) => {
    if (key === 'number') {
      const formatted = formatCardNumber(value);
      const type = detectCardType(formatted);
      setCardDetails(prev => ({ ...prev, [key]: formatted, type }));
    } else if (key === 'expiry') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
      }
      setCardDetails(prev => ({ ...prev, [key]: formatted }));
    } else {
      setCardDetails(prev => ({ ...prev, [key]: value }));
    }
  };

  const updateBillingAddress = (key: keyof typeof billingAddress, value: string) => {
    setBillingAddress(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-xl text-gray-900">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Flight ({flight.flightNumber})</span>
              <span>£{flight.price}</span>
            </div>
            {passengers > 1 && (
              <div className="flex justify-between">
                <span>Additional passengers ({passengers - 1})</span>
                <span>£{((passengers - 1) * parseFloat(flight.price)).toFixed(2)}</span>
              </div>
            )}
            {addOns.map((addon, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-600">
                <span>{addon}</span>
                <span>Included</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">£{totalAmount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="shadow-lg">
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="flex items-center text-xl text-gray-900">
            <Lock className="w-5 h-5 mr-2" />
            Secure Payment
          </CardTitle>
          <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5" />
                    <span>Credit/Debit Card</span>
                  </Label>
                  <div className="flex space-x-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="gift" id="gift" />
                  <Label htmlFor="gift" className="flex items-center space-x-2 cursor-pointer">
                    <Building className="w-5 h-5" />
                    <span>Gift Card</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800 font-medium">
                      Your card details are protected with 256-bit SSL encryption
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cardNumber"
                        value={cardDetails.number}
                        onChange={(e) => updateCardDetails("number", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="pl-10"
                        maxLength={19}
                        required
                      />
                      {cardDetails.type && (
                        <div className="absolute right-3 top-3">
                          <span className="text-xs font-medium text-gray-500 uppercase">{cardDetails.type}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cardName"
                        value={cardDetails.name}
                        onChange={(e) => updateCardDetails("name", e.target.value)}
                        placeholder="Enter name as shown on card"
                        className="pl-10 uppercase"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="expiry"
                          value={cardDetails.expiry}
                          onChange={(e) => updateCardDetails("expiry", e.target.value)}
                          placeholder="MM/YY"
                          className="pl-10"
                          maxLength={5}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">Security Code *</Label>
                      <Input
                        id="cvv"
                        value={cardDetails.cvv}
                        onChange={(e) => updateCardDetails("cvv", e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="saveCard" checked={saveCard} onCheckedChange={setSaveCard} />
                    <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                      Save this card for future bookings
                    </Label>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Billing Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address1">Address Line 1 *</Label>
                      <Input
                        id="address1"
                        value={billingAddress.address1}
                        onChange={(e) => updateBillingAddress("address1", e.target.value)}
                        placeholder="Street address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        value={billingAddress.address2}
                        onChange={(e) => updateBillingAddress("address2", e.target.value)}
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={billingAddress.city}
                        onChange={(e) => updateBillingAddress("city", e.target.value)}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode *</Label>
                      <Input
                        id="postcode"
                        value={billingAddress.postcode}
                        onChange={(e) => updateBillingAddress("postcode", e.target.value)}
                        placeholder="Postcode"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select value={billingAddress.country} onValueChange={(value) => updateBillingAddress("country", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "gift" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="giftcard-type">Gift Card Type *</Label>
                  <Select value={selectedGiftCard} onValueChange={setSelectedGiftCard} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gift card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple Gift Card</SelectItem>
                      <SelectItem value="google">Google Play Gift Card</SelectItem>
                      <SelectItem value="amazon">Amazon Gift Card</SelectItem>
                      <SelectItem value="netflix">Netflix Gift Card</SelectItem>
                      <SelectItem value="spotify">Spotify Gift Card</SelectItem>
                      <SelectItem value="steam">Steam Gift Card</SelectItem>
                      <SelectItem value="xbox">Xbox Gift Card</SelectItem>
                      <SelectItem value="playstation">PlayStation Gift Card</SelectItem>
                      <SelectItem value="visa">Visa Gift Card</SelectItem>
                      <SelectItem value="mastercard">Mastercard Gift Card</SelectItem>
                      <SelectItem value="american-express">American Express Gift Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="giftCode">Gift Card Code *</Label>
                  <Input
                    id="giftCode"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    placeholder="Enter gift card code"
                    className="uppercase"
                    required
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    Any valid gift card code will be accepted for demonstration purposes.
                  </p>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox 
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onCheckedChange={setAgreeToTerms}
                  required
                />
                <div className="text-sm">
                  <Label htmlFor="agreeTerms" className="cursor-pointer">
                    I agree to the booking <a href="#" className="text-blue-600 underline">Terms and Conditions</a>, 
                    <a href="#" className="text-blue-600 underline"> Fare Rules</a>, and 
                    <a href="#" className="text-blue-600 underline"> Privacy Policy</a>
                  </Label>
                  <p className="text-gray-600 mt-1">
                    By proceeding, you confirm that all information provided is accurate and you understand the cancellation policy.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={onBack} className="px-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSkipPayment}
                  disabled={isProcessing}
                  className="px-6"
                >
                  Reserve Booking
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  disabled={isProcessing}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : `Pay £${totalAmount}`}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
