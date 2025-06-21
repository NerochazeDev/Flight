import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Lock, ArrowLeft, Calendar, User } from "lucide-react";
import { PendingPayment, Flight } from "@/../../shared/schema";

interface PaymentFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function Payment() {
  const [, params] = useRoute("/payment/:reference");
  const reference = params?.reference;
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'GB'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!reference) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/pending-payments/${reference}`);

        if (!response.ok) {
          throw new Error("Pending payment not found");
        }

        const data = await response.json();
        setPendingPayment(data);

        // Fetch flight details
        const flightResponse = await fetch(`/api/flights/${data.flightId}`);
        if (flightResponse.ok) {
          const flightData = await flightResponse.json();
          setFlight(flightData);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        toast({
          title: "Error",
          description: "Unable to load payment details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [reference, toast]);

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    handleInputChange('cardNumber', formatted);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pendingPayment) return;

    // Basic validation
    if (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || 
        !formData.cvv || !formData.cardholderName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required payment fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch(`/api/pending-payments/${reference}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: 'credit_card',
          cardLast4: formData.cardNumber.slice(-4),
          cardholderName: formData.cardholderName
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      const booking = await response.json();
      
      toast({
        title: "Payment Successful!",
        description: `Your booking ${booking.booking.bookingReference} has been confirmed.`,
      });

      // Redirect back to pending page after successful payment
      setTimeout(() => {
        window.location.href = '/pending';
      }, 2000);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description: "Unable to process your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading payment details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!pendingPayment || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Payment Not Found</h2>
              <p className="text-gray-600 mb-4">
                The payment reference could not be found or has expired.
              </p>
              <Button onClick={() => window.location.href = '/pending'}>
                Return to Pending Tickets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isExpired = new Date(pendingPayment.expiresAt) < new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/pending'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pending Tickets
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-gray-600">Secure payment for ticket {reference}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Enter your payment information to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Card Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Select 
                        value={formData.expiryMonth} 
                        onValueChange={(value) => handleInputChange('expiryMonth', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <Select 
                        value={formData.expiryYear} 
                        onValueChange={(value) => handleInputChange('expiryYear', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                              {new Date().getFullYear() + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="Full name as on card"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Separator />

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Billing Address</h3>
                  
                  <div>
                    <Label htmlFor="billingAddress">Address</Label>
                    <Input
                      id="billingAddress"
                      placeholder="Street address"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="Postal code"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Your payment information is encrypted and secure
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isProcessing || isExpired}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay £{pendingPayment.totalPrice}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Review your flight details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flight Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {flight.departureAirport} → {flight.arrivalAirport}
                    </span>
                    <span className="text-sm text-gray-600">{flight.flightNumber}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(flight.departureTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{pendingPayment.passengerName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Base fare ({pendingPayment.passengers} passenger{pendingPayment.passengers !== 1 ? 's' : ''})</span>
                  <span>£{flight.price}</span>
                </div>
                {pendingPayment.addOns && pendingPayment.addOns.length > 0 && (
                  <div className="flex justify-between">
                    <span>Add-ons</span>
                    <span>Included</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>£{pendingPayment.totalPrice}</span>
                </div>
              </div>

              {/* Payment Expiry */}
              {!isExpired && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Payment expires:</strong> {new Date(pendingPayment.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}