import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProgressSteps from "@/components/progress-steps";
import SearchForm from "@/components/search-form";
import LoadingState from "@/components/loading-state";
import FlightResults from "@/components/flight-results";
import PassengerForm from "@/components/passenger-form";
import PaymentForm from "@/components/payment-form";
import BookingConfirmation from "@/components/booking-confirmation";
import type { Flight, Booking } from "@shared/schema";

export type BookingStep = "search" | "select" | "passenger" | "payment" | "confirmation";

export interface SearchParams {
  from: string;
  to: string;
  departure: string;
  return: string;
  passengers: number;
  class: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("search");
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: "LHR",
    to: "AMS",
    departure: "2024-12-15",
    return: "2024-12-22",
    passengers: 1,
    class: "economy",
  });
  const [flightResults, setFlightResults] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [totalAmount, setTotalAmount] = useState<string>("0");

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setIsSearching(true);
    setCurrentStep("search");
    
    try {
      const response = await fetch(
        `/api/flights/search?from=${params.from}&to=${params.to}&date=${params.departure}&returnDate=${params.return}&passengers=${params.passengers}&class=${params.class}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to search flights");
      }
      
      const flights = await response.json();
      setFlightResults(flights);
      
      setTimeout(() => {
        setIsSearching(false);
        setCurrentStep("select");
      }, 2000);
    } catch (error) {
      console.error("Search error:", error);
      setIsSearching(false);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setCurrentStep("passenger");
  };

  const handlePassengerComplete = (amount: string) => {
    setTotalAmount(amount);
    setCurrentStep("payment");
  };

  const handlePaymentComplete = (newBooking: Booking) => {
    setBooking(newBooking);
    setCurrentStep("confirmation");
  };

  const handleBackToSearch = () => {
    setCurrentStep("search");
    setFlightResults([]);
    setSelectedFlight(null);
  };

  const handleBackToResults = () => {
    setCurrentStep("select");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {currentStep === "search" && (
        <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">
                Millions of cheap flights. One simple search.
              </h1>
            </div>
            <SearchForm 
              searchParams={searchParams}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </div>
        </div>
      )}
      
      {currentStep !== "search" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProgressSteps currentStep={currentStep} />
          
          {isSearching && <LoadingState />}
          
          {currentStep === "select" && (
            <FlightResults 
              flights={flightResults}
              onFlightSelect={handleFlightSelect}
              onBackToSearch={handleBackToSearch}
            />
          )}
          
          {currentStep === "passenger" && selectedFlight && (
            <PassengerForm 
              flight={selectedFlight}
              passengers={searchParams.passengers}
              onBookingComplete={handlePassengerComplete}
              onBack={handleBackToResults}
            />
          )}

          {currentStep === "payment" && selectedFlight && (
            <PaymentForm
              flight={selectedFlight}
              passengers={searchParams.passengers}
              totalAmount={totalAmount}
              onPaymentComplete={handlePaymentComplete}
              onBack={() => setCurrentStep("passenger")}
            />
          )}
          
          {currentStep === "confirmation" && booking && selectedFlight && (
            <BookingConfirmation 
              booking={booking}
              flight={selectedFlight}
            />
          )}
        </main>
      )}
      

    </div>
  );
}
