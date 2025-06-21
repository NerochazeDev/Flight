
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, AlertTriangle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EmailPreview() {
  const { reference } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [emailData, setEmailData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reference) {
      fetchEmailPreview();
    }
  }, [reference]);

  const fetchEmailPreview = async () => {
    try {
      const response = await fetch(`/api/pending-payments/${reference}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch email preview");
      }

      const result = await response.json();
      setEmailData(result.emailPreview);
    } catch (error) {
      console.error("Email preview error:", error);
      toast({
        title: "Error",
        description: "Unable to load email preview",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysRemaining = () => {
    if (!emailData) return 0;
    const expiryMatch = emailData.text.match(/completed by (.+?)\./);
    if (expiryMatch) {
      const expiryDate = new Date(expiryMatch[1]);
      const now = new Date();
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    return 4; // Default to 4 days
  };

  const daysRemaining = getDaysRemaining();
  const isUrgent = daysRemaining <= 4;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading email preview...</p>
        </div>
      </div>
    );
  }

  if (!emailData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Email Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load email preview for this booking reference.</p>
            <Button onClick={() => setLocation("/")} variant="outline">
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
        <div className="mb-6">
          <Button onClick={() => setLocation("/")} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Preview</h1>
              <p className="text-gray-600">Payment reminder for booking {reference}</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isUrgent ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <Clock className="w-4 h-4 mr-1" />
                {daysRemaining} days remaining
              </div>
            </div>
          </div>
        </div>

        {isUrgent && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h3 className="font-bold text-red-800">URGENT: Payment Required</h3>
                  <p className="text-red-700 text-sm">
                    This booking will expire in {daysRemaining} days. Complete payment immediately to avoid losing your reservation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">To:</label>
                <p className="font-mono text-sm">{emailData.to}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Subject:</label>
                <p className="font-medium">{emailData.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Type:</label>
                <p className="text-sm">Payment Reminder</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setLocation(`/complete-payment/${reference}`)}
              >
                Complete Payment Now
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation(`/booking/${reference}`)}
              >
                View Booking Details
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.print()}
              >
                Print Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Email Content Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: emailData.html }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
