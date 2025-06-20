import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Flight, Booking } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    name: ""
  });
  const [giftCardCode, setGiftCardCode] = useState("");
  const [selectedGiftCard, setSelectedGiftCard] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === "gift") {
      if (!selectedGiftCard) {
        toast({
          title: "Gift card type required",
          description: "Please select a gift card type",
          variant: "destructive",
        });
        return;
      }
      if (!giftCardCode.trim()) {
        toast({
          title: "Gift card code required", 
          description: "Please enter a gift card code",
          variant: "destructive",
        });
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
        paymentMethod: paymentMethod === "gift" ? `Gift Card: ${giftCardCode}` : "Credit Card",
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
        description: `Your booking reference is ${booking.bookingReference}`,
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

  const updateCardDetails = (key: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="shadow-lg mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h3>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">£{totalAmount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                  <CreditCard className="w-5 h-5" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="gift" id="gift" />
                <Label htmlFor="gift" className="flex items-center space-x-2 cursor-pointer">
                  <Gift className="w-5 h-5" />
                  <span>Gift Card</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name *</Label>
                <Input
                  id="cardName"
                  value={cardDetails.name}
                  onChange={(e) => updateCardDetails("name", e.target.value)}
                  placeholder="Enter cardholder name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  value={cardDetails.number}
                  onChange={(e) => updateCardDetails("number", e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    value={cardDetails.expiry}
                    onChange={(e) => updateCardDetails("expiry", e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={cardDetails.cvv}
                    onChange={(e) => updateCardDetails("cvv", e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "gift" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="giftcard-type">Gift Card Type</Label>
                <Select value={selectedGiftCard} onValueChange={setSelectedGiftCard}>
                  <SelectTrigger className="mt-1">
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
                  required
                />
              </div>
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <strong>Note:</strong> Any gift card code will be accepted for demonstration purposes.
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay £${totalAmount}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}