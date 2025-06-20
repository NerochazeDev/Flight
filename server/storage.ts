
import { flights, bookings, searchRequests, type Flight, type Booking, type SearchRequest, type InsertFlight, type InsertBooking, type InsertSearchRequest } from "@shared/schema";

export interface IStorage {
  // Flight operations
  searchFlights(from: string, to: string, date: string): Promise<Flight[]>;
  getFlightById(id: number): Promise<Flight | undefined>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingByReference(reference: string): Promise<Booking | undefined>;

  // Search request operations
  createSearchRequest(searchRequest: InsertSearchRequest): Promise<SearchRequest>;
}

export class MemStorage implements IStorage {
  private flights: Map<number, Flight>;
  private bookings: Map<string, Booking>;
  private searchRequests: Map<number, SearchRequest>;
  private flightCurrentId: number;
  private bookingCurrentId: number;
  private searchCurrentId: number;

  constructor() {
    this.flights = new Map();
    this.bookings = new Map();
    this.searchRequests = new Map();
    this.flightCurrentId = 1;
    this.bookingCurrentId = 1;
    this.searchCurrentId = 1;

    // Initialize with realistic flight data
    this.initializeRealisticFlights();
  }

  private initializeRealisticFlights() {
    const realisticFlights: Omit<Flight, 'id'>[] = [
      // London to Amsterdam
      {
        flightNumber: "KL1007",
        airline: "KLM Royal Dutch Airlines",
        airlineCode: "KL",
        departureAirport: "LHR",
        arrivalAirport: "AMS",
        departureTime: "08:25",
        arrivalTime: "10:50",
        duration: "1h 25m",
        price: "1245.00",
        aircraft: "Boeing 737-800",
        stops: 0,
        amenities: ["WiFi", "Premium Meal", "Priority Boarding", "Lounge Access"],
        availableSeats: 145,
      },
      {
        flightNumber: "BA431",
        airline: "British Airways",
        airlineCode: "BA",
        departureAirport: "LHR",
        arrivalAirport: "AMS",
        departureTime: "14:15",
        arrivalTime: "16:45",
        duration: "1h 30m",
        price: "985.00",
        aircraft: "Airbus A320",
        stops: 0,
        amenities: ["WiFi", "Meal", "Entertainment"],
        availableSeats: 134,
      },
      
      // London to Paris
      {
        flightNumber: "AF1381",
        airline: "Air France",
        airlineCode: "AF",
        departureAirport: "LHR",
        arrivalAirport: "CDG",
        departureTime: "09:40",
        arrivalTime: "12:15",
        duration: "1h 35m",
        price: "1150.00",
        aircraft: "Airbus A321",
        stops: 0,
        amenities: ["WiFi", "Premium Meal", "Entertainment", "Checked Bag"],
        availableSeats: 180,
      },
      {
        flightNumber: "EK7",
        airline: "Emirates",
        airlineCode: "EK",
        departureAirport: "LHR",
        arrivalAirport: "CDG",
        departureTime: "16:30",
        arrivalTime: "19:10",
        duration: "1h 40m",
        price: "1890.00",
        aircraft: "Airbus A380",
        stops: 0,
        amenities: ["Premium WiFi", "Gourmet Meal", "Lie-flat Seats", "Champagne Service"],
        availableSeats: 85,
      },

      // London to New York
      {
        flightNumber: "VS3",
        airline: "Virgin Atlantic",
        airlineCode: "VS",
        departureAirport: "LHR",
        arrivalAirport: "JFK",
        departureTime: "11:45",
        arrivalTime: "15:10",
        duration: "8h 25m",
        price: "2450.00",
        aircraft: "Boeing 787-9",
        stops: 0,
        amenities: ["Premium WiFi", "Premium Meal", "Entertainment", "Premium Economy"],
        availableSeats: 280,
      },
      {
        flightNumber: "BA117",
        airline: "British Airways",
        airlineCode: "BA",
        departureAirport: "LHR",
        arrivalAirport: "JFK",
        departureTime: "19:25",
        arrivalTime: "22:55",
        duration: "8h 30m",
        price: "3125.00",
        aircraft: "Boeing 777-300ER",
        stops: 0,
        amenities: ["Premium WiFi", "Business Class Meal", "Flat Bed", "Lounge Access"],
        availableSeats: 156,
      },

      // London to Dubai
      {
        flightNumber: "EK1",
        airline: "Emirates",
        airlineCode: "EK",
        departureAirport: "LHR",
        arrivalAirport: "DXB",
        departureTime: "14:45",
        arrivalTime: "00:50",
        duration: "7h 05m",
        price: "1875.00",
        aircraft: "Airbus A380",
        stops: 0,
        amenities: ["Premium WiFi", "Gourmet Meal", "Entertainment", "Shower Spa"],
        availableSeats: 220,
      },

      // Manchester to Barcelona
      {
        flightNumber: "FR2453",
        airline: "Ryanair",
        airlineCode: "FR",
        departureAirport: "MAN",
        arrivalAirport: "BCN",
        departureTime: "06:30",
        arrivalTime: "09:45",
        duration: "2h 15m",
        price: "925.00",
        aircraft: "Boeing 737-800",
        stops: 0,
        amenities: ["WiFi", "Food Purchase"],
        availableSeats: 189,
      },
      {
        flightNumber: "VY8301",
        airline: "Vueling Airlines",
        airlineCode: "VY",
        departureAirport: "MAN",
        arrivalAirport: "BCN",
        departureTime: "12:20",
        arrivalTime: "15:35",
        duration: "2h 15m",
        price: "1065.00",
        aircraft: "Airbus A320",
        stops: 0,
        amenities: ["WiFi", "Meal", "Entertainment"],
        availableSeats: 156,
      },

      // Edinburgh to Rome
      {
        flightNumber: "FR817",
        airline: "Ryanair",
        airlineCode: "FR",
        departureAirport: "EDI",
        arrivalAirport: "FCO",
        departureTime: "07:15",
        arrivalTime: "11:20",
        duration: "3h 05m",
        price: "945.00",
        aircraft: "Boeing 737-800",
        stops: 0,
        amenities: ["WiFi", "Food Purchase"],
        availableSeats: 180,
      },
      {
        flightNumber: "AZ205",
        airline: "Alitalia",
        airlineCode: "AZ",
        departureAirport: "EDI",
        arrivalAirport: "FCO",
        departureTime: "15:40",
        arrivalTime: "19:55",
        duration: "3h 15m",
        price: "1290.00",
        aircraft: "Airbus A321",
        stops: 0,
        amenities: ["WiFi", "Premium Meal", "Entertainment", "Lounge Access"],
        availableSeats: 165,
      },

      // Birmingham to Frankfurt
      {
        flightNumber: "LH925",
        airline: "Lufthansa",
        airlineCode: "LH",
        departureAirport: "BHX",
        arrivalAirport: "FRA",
        departureTime: "08:45",
        arrivalTime: "11:25",
        duration: "1h 40m",
        price: "1185.00",
        aircraft: "Airbus A319",
        stops: 0,
        amenities: ["WiFi", "Premium Meal", "Business Lounge"],
        availableSeats: 124,
      },

      // Gatwick to Tokyo
      {
        flightNumber: "JL44",
        airline: "Japan Airlines",
        airlineCode: "JL",
        departureAirport: "LGW",
        arrivalAirport: "NRT",
        departureTime: "12:35",
        arrivalTime: "08:15",
        duration: "11h 40m",
        price: "4250.00",
        aircraft: "Boeing 787-9",
        stops: 0,
        amenities: ["Premium WiFi", "Japanese Cuisine", "Lie-flat Seats", "Onsen Spa"],
        availableSeats: 195,
      },

      // Heathrow to Sydney
      {
        flightNumber: "QF1",
        airline: "Qantas",
        airlineCode: "QF",
        departureAirport: "LHR",
        arrivalAirport: "SYD",
        departureTime: "21:45",
        arrivalTime: "05:25",
        duration: "21h 40m",
        price: "5890.00",
        aircraft: "Airbus A380",
        stops: 1,
        amenities: ["Premium WiFi", "First Class Dining", "Private Suites", "Spa Services"],
        availableSeats: 120,
      }
    ];

    realisticFlights.forEach(flight => {
      const id = this.flightCurrentId++;
      this.flights.set(id, { ...flight, id });
    });
  }

  async searchFlights(from: string, to: string, date: string): Promise<Flight[]> {
    const results = Array.from(this.flights.values()).filter(flight => 
      flight.departureAirport === from && flight.arrivalAirport === to
    );

    // Sort by price by default
    return results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  }

  async getFlightById(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const bookingReference = `FH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const booking: Booking = {
      ...insertBooking,
      id,
      bookingReference,
      createdAt: new Date(),
      passengers: insertBooking.passengers ?? 1,
      status: insertBooking.status ?? "confirmed",
      addOns: insertBooking.addOns ?? [],
    };

    this.bookings.set(bookingReference, booking);
    return booking;
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    return this.bookings.get(reference);
  }

  async createSearchRequest(insertSearchRequest: InsertSearchRequest): Promise<SearchRequest> {
    const id = this.searchCurrentId++;
    const searchRequest: SearchRequest = {
      ...insertSearchRequest,
      id,
      createdAt: new Date(),
      returnDate: insertSearchRequest.returnDate ?? null,
      passengers: insertSearchRequest.passengers ?? 1,
      class: insertSearchRequest.class ?? "economy",
    };

    this.searchRequests.set(id, searchRequest);
    return searchRequest;
  }
}

export const storage = new MemStorage();
