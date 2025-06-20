import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">FlightHub</h1>
            </div>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                My Bookings
              </a>
              <a href="#" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                Help
              </a>
              <Button className="bg-primary text-white hover:bg-primary-dark">
                Sign In
              </Button>
            </div>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
