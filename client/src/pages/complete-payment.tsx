
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompletePayment() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingPayment, setPendingPayment] = useState<any>(null);
  const [flight, setFlight] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  useEffect(() => {
    if (reference) {
      fetchPendingPayment();
    }
  }, [reference]);

  const fetchPendingPayment = async () => {
    try {
      const response = await fetch(`/api/pending-payments/${reference}`);
      if (!response.ok) {
        throw new Error("Pending payment not found");
      }
      const payment = await response.json();
      setPendingPayment(payment);

      // Fetch flight details
      const flightResponse = await fetch(`/api/flights/${payment.flightId}`);
      if (flightResponse.ok) {
        const flightData = await flightResponse.json();
        setFlight(flightData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Unable to load payment details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      toast({
        title: "Card details required",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/pending-payments/${reference}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const result = await response.json();
      
      toast({
        title: "Payment Successful!",
        description: `Your booking is confirmed. Reference: ${result.booking.bookingReference}`,
      });

      // Redirect to confirmation page
      navigate(`/booking/${result.booking.bookingReference}`);
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

  const updateCardDetails = (key: keyof typeof cardDetails, value: string) => {
    if (key === 'number') {
      const formatted = formatCardNumber(value);
      setCardDetails(prev => ({ ...prev, [key]: formatted }));
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

  const getTimeRemaining = () => {
    if (!pendingPayment) return null;
    const now = new Date();
    const expiry = new Date(pendingPayment.expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return "EXPIRED";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!pendingPayment || !flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Payment Not Found</h2>
            <p className="text-gray-600 mb-4">This payment link may have expired or the booking reference is invalid.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timeRemaining = getTimeRemaining();
  const isExpired = timeRemaining === "EXPIRED";

  if (isExpired || pendingPayment.status !== 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Payment Expired</h2>
            <p className="text-gray-600 mb-4">This payment has expired or has already been processed.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <Button onClick={() => navigate("/")} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Flight Details */}
          <Card>
            <CardHeader>
              <CardTitle>Flight Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Flight:</span>
                <span>{flight.flightNumber} - {flight.airline}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Route:</span>
                <span>{flight.departureAirport} → {flight.arrivalAirport}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Departure:</span>
                <span>{flight.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Arrival:</span>
                <span>{flight.arrivalTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Passengers:</span>
                <span>{pendingPayment.passengers}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">£{pendingPayment.totalPrice}</span>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="text-sm font-medium text-orange-800">
                  Time remaining: {timeRemaining}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Complete Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
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
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardName">Cardholder Name *</Label>
                  <Input
                    id="cardName"
                    value={cardDetails.name}
                    onChange={(e) => updateCardDetails("name", e.target.value)}
                    placeholder="Enter name as shown on card"
                    className="uppercase"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
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
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
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

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                  disabled={isProcessing}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing Payment..." : `Pay £${pendingPayment.totalPrice}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
