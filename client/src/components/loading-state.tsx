import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <Card className="shadow-lg mb-8">
      <CardContent className="p-8">
        <div className="text-center">
          <Loader2 className="inline-block animate-spin h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Searching for flights...</h3>
          <p className="text-gray-600">We're comparing prices from multiple airlines</p>
        </div>
      </CardContent>
    </Card>
  );
}
