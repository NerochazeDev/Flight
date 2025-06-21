import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Eye } from "lucide-react";

export default function EmailPreview() {
  const [, params] = useRoute("/email-preview/:reference");
  const reference = params?.reference;
  const [emailData, setEmailData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmailData = async () => {
      if (!reference) return;

      try {
        setIsLoading(true);

        // Try to get pending payment data first
        let response = await fetch(`/api/pending-payments/${reference}`);

        if (!response.ok) {
          // If not found in pending payments, try regular bookings
          response = await fetch(`/api/bookings/${reference}`);
        }

        if (response.ok) {
          const bookingData = await response.json();

          // Get email preview - this endpoint doesn't actually send email, just returns preview
          const emailResponse = await fetch(`/api/pending-payments/${reference}/send-email`, {
            method: "POST"
          });

          if (emailResponse.ok) {
            const emailResult = await emailResponse.json();
            setEmailData({
              ...bookingData,
              emailPreview: emailResult.emailPreview
            });
          } else {
            // Fallback to booking data without email preview
            setEmailData(bookingData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch email data:", error);
        toast({
          title: "Error",
          description: "Failed to load email preview",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmailData();
  }, [reference, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading email preview...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!emailData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Email Preview Not Available</h2>
              <p className="text-gray-600 mb-4">
                Unable to load email preview for reference: {reference}
              </p>
              <Button onClick={() => window.location.href = '/'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6" />
              Email Preview
            </h1>
            <p className="text-gray-600">Reference: {reference}</p>
          </div>
        </div>

        {/* Email Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Payment Reminder Email
            </CardTitle>
            <CardDescription>
              Preview of the email that would be sent to the customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailData.emailPreview ? (
              <div className="bg-gray-50 border rounded-lg p-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div dangerouslySetInnerHTML={{ __html: emailData.emailPreview }} />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Complete Your Flight Booking Payment</h2>
                  
                  <p className="mb-4">Dear Customer,</p>
                  
                  <p className="mb-4">
                    Thank you for choosing our airline for your upcoming trip. We're writing to remind you 
                    that your booking payment is still pending and requires completion.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-2">Booking Details:</h3>
                    <ul className="space-y-1 text-sm">
                      <li><strong>Reference:</strong> {reference}</li>
                      <li><strong>Amount:</strong> £{emailData.totalAmount}</li>
                      <li><strong>Passengers:</strong> {emailData.passengers}</li>
                      {emailData.expiresAt && (
                        <li><strong>Payment Expires:</strong> {new Date(emailData.expiresAt).toLocaleString()}</li>
                      )}
                    </ul>
                  </div>
                  
                  <p className="mb-4">
                    To complete your payment and secure your booking, please click the link below:
                  </p>
                  
                  <div className="text-center mb-4">
                    <Badge variant="outline" className="px-4 py-2">
                      Complete Payment Link
                    </Badge>
                  </div>
                  
                  <p className="mb-4 text-sm text-gray-600">
                    If you have any questions or need assistance, please don't hesitate to contact our 
                    customer service team.
                  </p>
                  
                  <p className="text-sm">
                    Best regards,<br />
                    SkyBooker Airlines Team
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Reference:</strong> {reference}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <Badge variant={emailData.status === 'completed' ? 'default' : 'secondary'}>
                  {emailData.status || 'pending'}
                </Badge>
              </div>
              <div>
                <strong>Passengers:</strong> {emailData.passengers}
              </div>
              <div>
                <strong>Total Amount:</strong> £{emailData.totalAmount}
              </div>
              {emailData.addOns && emailData.addOns.length > 0 && (
                <div className="col-span-2">
                  <strong>Add-ons:</strong> {emailData.addOns.join(", ")}
                </div>
              )}
              {emailData.expiresAt && (
                <div className="col-span-2">
                  <strong>Expires:</strong> {new Date(emailData.expiresAt).toLocaleString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}