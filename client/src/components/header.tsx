import { Button } from "@/components/ui/button";
import { Menu, Globe } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <svg width="122" height="20" viewBox="0 0 122 20" className="text-skyscanner-blue fill-current">
                <path d="M8.95 2.17c-1.45 0-2.62 1.18-2.62 2.62s1.18 2.62 2.62 2.62 2.62-1.18 2.62-2.62-1.17-2.62-2.62-2.62zm5.98 0c-1.45 0-2.62 1.18-2.62 2.62s1.18 2.62 2.62 2.62 2.62-1.18 2.62-2.62-1.17-2.62-2.62-2.62zM2.62 7.41c-1.45 0-2.62 1.18-2.62 2.62s1.18 2.62 2.62 2.62 2.62-1.18 2.62-2.62-1.17-2.62-2.62-2.62zm6.33 0c-1.45 0-2.62 1.18-2.62 2.62s1.18 2.62 2.62 2.62 2.62-1.18 2.62-2.62-1.17-2.62-2.62-2.62zm6.33 0c-1.45 0-2.62 1.18-2.62 2.62s1.18 2.62 2.62 2.62 2.62-1.18 2.62-2.62-1.17-2.62-2.62-2.62zm6.33 0c-1.45 0-2.62 1.18-2.62 2.62s1.18 2.62 2.62 2.62 2.62-1.18 2.62-2.62-1.17-2.62-2.62-2.62zM8.95 12.66c-1.45 0-2.62 1.18-2.62 2.62s1.18 2.62 2.62 2.62 2.62-1.18 2.62-2.62-1.17-2.62-2.62-2.62zm5.98 0c-1.45 0-2.62 1.18-2.62 2.62s1.18 2.62 2.62 2.62 2.62-1.18 2.62-2.62-1.17-2.62-2.62-2.62z"/>
                <path d="M32.73 14.89c-.79 0-1.43-.64-1.43-1.43V8.72c0-.79.64-1.43 1.43-1.43s1.43.64 1.43 1.43v4.74c0 .79-.64 1.43-1.43 1.43zm8.02-6.62c-1.98 0-3.58 1.6-3.58 3.58s1.6 3.58 3.58 3.58 3.58-1.6 3.58-3.58-1.6-3.58-3.58-3.58zm0 4.74c-.64 0-1.16-.52-1.16-1.16s.52-1.16 1.16-1.16 1.16.52 1.16 1.16-.52 1.16-1.16 1.16zm12.2-4.74c-1.98 0-3.58 1.6-3.58 3.58s1.6 3.58 3.58 3.58 3.58-1.6 3.58-3.58-1.6-3.58-3.58-3.58zm0 4.74c-.64 0-1.16-.52-1.16-1.16s.52-1.16 1.16-1.16 1.16.52 1.16 1.16-.52 1.16-1.16 1.16z"/>
              </svg>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Flights</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm font-medium">Hotels</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm font-medium">Car hire</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
              <Globe className="h-4 w-4 mr-2" />
              English (UK)
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
              Sign in
            </Button>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
