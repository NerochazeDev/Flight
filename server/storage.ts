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
    
    // Initialize with mock flight data
    this.initializeMockFlights();
  }

  private initializeMockFlights() {
    const mockFlights: Omit<Flight, 'id'>[] = [
      {
        flightNumber: "KL1234",
        airline: "KLM Royal Dutch Airlines",
        airlineCode: "KL",
        departureAirport: "LHR",
        arrivalAirport: "AMS",
        departureTime: "09:15",
        arrivalTime: "11:40",
        duration: "1h 25m",
        price: "189.00",
        aircraft: "Boeing 737",
        stops: 0,
        amenities: ["WiFi", "Meal", "Checked bag"],
        availableSeats: 150,
      },
      {
        flightNumber: "BA5678",
        airline: "British Airways",
        airlineCode: "BA",
        departureAirport: "LGW",
        arrivalAirport: "AMS",
        departureTime: "14:30",
        arrivalTime: "17:00",
        duration: "1h 30m",
        price: "215.00",
        aircraft: "Airbus A320",
        stops: 0,
        amenities: ["WiFi", "Snack", "Checked bag"],
        availableSeats: 120,
      },
      {
        flightNumber: "FR9876",
        airline: "Ryanair",
        airlineCode: "FR",
        departureAirport: "STN",
        arrivalAirport: "EIN",
        departureTime: "06:45",
        arrivalTime: "09:25",
        duration: "1h 40m",
        price: "89.00",
        aircraft: "Boeing 737",
        stops: 0,
        amenities: ["Food for purchase"],
        availableSeats: 180,
      },
      {
        flightNumber: "U21234",
        airline: "easyJet",
        airlineCode: "U2",
        departureAirport: "LGW",
        arrivalAirport: "AMS",
        departureTime: "16:20",
        arrivalTime: "18:45",
        duration: "1h 25m",
        price: "125.00",
        aircraft: "Airbus A319",
        stops: 0,
        amenities: ["WiFi", "Food for purchase"],
        availableSeats: 156,
      },
      {
        flightNumber: "KL5432",
        airline: "KLM Royal Dutch Airlines",
        airlineCode: "KL",
        departureAirport: "MAN",
        arrivalAirport: "AMS",
        departureTime: "11:30",
        arrivalTime: "14:10",
        duration: "1h 40m",
        price: "199.00",
        aircraft: "Boeing 737",
        stops: 0,
        amenities: ["WiFi", "Meal", "Checked bag"],
        availableSeats: 140,
      },
      {
        flightNumber: "BA3456",
        airline: "British Airways",
        airlineCode: "BA",
        departureAirport: "BHX",
        arrivalAirport: "AMS",
        departureTime: "13:15",
        arrivalTime: "15:55",
        duration: "1h 40m",
        price: "179.00",
        aircraft: "Airbus A320",
        stops: 0,
        amenities: ["WiFi", "Snack", "Checked bag"],
        availableSeats: 130,
      },
    ];

    mockFlights.forEach(flight => {
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
    };
    
    this.searchRequests.set(id, searchRequest);
    return searchRequest;
  }
}

export const storage = new MemStorage();
