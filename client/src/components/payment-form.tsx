import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Gift, Lock, Check } from "lucide-react";
import { Flight, Booking } from "@shared/schema";

interface PaymentFormProps {
  flight: Flight;
  passengers: number;
  totalAmount: string;
  onPaymentComplete: (booking: Booking) => void;
  onBack: () => void;
}

export default function PaymentForm({ flight, passengers, totalAmount, onPaymentComplete, onBack }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "giftcard">("card");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Mock booking creation - always successful
      const mockBooking: Booking = {
        id: Math.floor(Math.random() * 10000),
        bookingReference: generateBookingReference(),
        flightId: flight.id,
        passengerName: "John Doe", // This would come from passenger form
        passengerEmail: "john@example.com",
        passengerPhone: "+44 20 7946 0958",
        passengers: passengers,
        totalPrice: totalAmount,
        addOns: [],
        status: "confirmed",
        createdAt: new Date()
      };

      setIsProcessing(false);
      onPaymentComplete(mockBooking);
    }, 2000);
  };

  const generateBookingReference = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">Payment details</h3>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handlePayment} className="space-y-8">
            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Choose payment method</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "giftcard" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("giftcard")}
                >
                  <div className="flex items-center space-x-3">
                    <Gift className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Gift Card</p>
                      <p className="text-sm text-gray-500">Redeem your gift card</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Form */}
            {paymentMethod === "card" ? (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Card details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="cardName" className="text-sm font-medium text-gray-700">
                      Cardholder name *
                    </Label>
                    <Input
                      id="cardName"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      placeholder="Enter cardholder name"
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                      Card number *
                    </Label>
                    <Input
                      id="cardNumber"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-sm font-medium text-gray-700">
                      Expiry date *
                    </Label>
                    <Input
                      id="expiry"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      placeholder="MM/YY"
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                      CVV *
                    </Label>
                    <Input
                      id="cvv"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      placeholder="123"
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Gift card details</h4>
                <div className="space-y-2">
                  <Label htmlFor="giftcard" className="text-sm font-medium text-gray-700">
                    Gift card code *
                  </Label>
                  <Input
                    id="giftcard"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    placeholder="Enter your gift card code"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Enter any code - all gift cards are accepted for demonstration
                  </p>
                </div>
              </div>
            )}

            {/* Booking Summary */}
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight</span>
                    <span className="font-medium">{flight.airline} {flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route</span>
                    <span className="font-medium">{flight.departureAirport} → {flight.arrivalAirport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers</span>
                    <span className="font-medium">{passengers}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">£{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="px-6 py-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-8 py-3 rounded-full font-semibold shadow-md"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete booking
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}