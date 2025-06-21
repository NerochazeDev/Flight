import { flights, bookings, searchRequests, pendingPayments, type Flight, type Booking, type SearchRequest, type PendingPayment, type InsertFlight, type InsertBooking, type InsertSearchRequest, type InsertPendingPayment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Flight operations
  searchFlights(from: string, to: string, date: string): Promise<Flight[]>;
  getFlightById(id: number): Promise<Flight | undefined>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingByReference(reference: string): Promise<Booking | undefined>;

  // Search request operations
  createSearchRequest(searchRequest: InsertSearchRequest): Promise<SearchRequest>;

  // Pending payment operations
  createPendingPayment(pendingPayment: InsertPendingPayment): Promise<PendingPayment>;
  getPendingPaymentByReference(reference: string): Promise<PendingPayment | undefined>;
  getAllPendingPayments(): Promise<PendingPayment[]>;
  updatePendingPaymentStatus(reference: string, status: string): Promise<void>;
  cleanupExpiredPayments(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async searchFlights(from: string, to: string, date: string): Promise<Flight[]> {
    // For now, use seed data - in production this would query the database
    const tempStorage = new MemStorage();
    return tempStorage.searchFlights(from, to, date);
  }

  async getFlightById(id: number): Promise<Flight | undefined> {
    const tempStorage = new MemStorage();
    return tempStorage.getFlightById(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingReference = this.generateBookingReference();
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        bookingReference,
      })
      .returning();
    return booking;
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.bookingReference, reference));
    return booking || undefined;
  }

  async createSearchRequest(insertSearchRequest: InsertSearchRequest): Promise<SearchRequest> {
    const [searchRequest] = await db
      .insert(searchRequests)
      .values(insertSearchRequest)
      .returning();
    return searchRequest;
  }

  async createPendingPayment(insertPendingPayment: InsertPendingPayment): Promise<PendingPayment> {
    const ticketReference = this.generateTicketReference();
    const [pendingPayment] = await db
      .insert(pendingPayments)
      .values({
        ...insertPendingPayment,
        ticketReference,
      })
      .returning();
    return pendingPayment;
  }

  async getPendingPaymentByReference(reference: string): Promise<PendingPayment | undefined> {
    const [pendingPayment] = await db.select().from(pendingPayments).where(eq(pendingPayments.ticketReference, reference));
    return pendingPayment || undefined;
  }

  async getAllPendingPayments(): Promise<PendingPayment[]> {
    const pendingPaymentsList = await db.select().from(pendingPayments).where(eq(pendingPayments.status, 'pending'));
    return pendingPaymentsList;
  }

  async updatePendingPaymentStatus(reference: string, status: string): Promise<void> {
    await db
      .update(pendingPayments)
      .set({ status })
      .where(eq(pendingPayments.ticketReference, reference));
  }

  async cleanupExpiredPayments(): Promise<void> {
    await db
      .update(pendingPayments)
      .set({ status: 'expired' })
      .where(eq(pendingPayments.status, 'pending'));
  }

  private generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateTicketReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TKT';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export class MemStorage implements IStorage {
  private flights: Map<number, Flight>;
  private bookings: Map<string, Booking>;
  private searchRequests: Map<number, SearchRequest>;
  private pendingPaymentsMap: Map<string, PendingPayment>;
  private flightCurrentId: number;
  private bookingCurrentId: number;
  private searchCurrentId: number;
  private pendingPaymentId: number;

  constructor() {
    this.flights = new Map();
    this.bookings = new Map();
    this.searchRequests = new Map();
    this.pendingPaymentsMap = new Map();
    this.flightCurrentId = 1;
    this.bookingCurrentId = 1;
    this.searchCurrentId = 1;
    this.pendingPaymentId = 1;

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
        price: (Math.random() * 300 + 900).toFixed(2), // £900-1200
        aircraft: "Boeing 737-800",
        stops: 0,
        amenities: ["WiFi", "In-flight entertainment", "Refreshments"],
        availableSeats: 156,
      },
      {
        flightNumber: "BA430",
        airline: "British Airways",
        airlineCode: "BA",
        departureAirport: "LHR",
        arrivalAirport: "AMS",
        departureTime: "13:15",
        arrivalTime: "15:45",
        duration: "1h 30m",
        price: (Math.random() * 300 + 900).toFixed(2), // £900-1200
        aircraft: "Airbus A320",
        stops: 0,
        amenities: ["WiFi", "In-flight entertainment", "Meal service", "Priority boarding"],
        availableSeats: 134,
      },
      {
        flightNumber: "EZY8844",
        airline: "easyJet",
        airlineCode: "EZY",
        departureAirport: "LGW",
        arrivalAirport: "AMS",
        departureTime: "18:30",
        arrivalTime: "20:45",
        duration: "1h 15m",
        price: (Math.random() * 300 + 900).toFixed(2), // £900-1200
        aircraft: "Airbus A319",
        stops: 0,
        amenities: ["Snacks for purchase", "WiFi available"],
        availableSeats: 142,
      },
      // Amsterdam to London
      {
        flightNumber: "KL1008",
        airline: "KLM Royal Dutch Airlines",
        airlineCode: "KL",
        departureAirport: "AMS",
        arrivalAirport: "LHR",
        departureTime: "11:30",
        arrivalTime: "12:05",
        duration: "1h 35m",
        price: (Math.random() * 300 + 900).toFixed(2), // £900-1200
        aircraft: "Boeing 737-800",
        stops: 0,
        amenities: ["WiFi", "In-flight entertainment", "Refreshments"],
        availableSeats: 148,
      },
      {
        flightNumber: "BA431",
        airline: "British Airways",
        airlineCode: "BA",
        departureAirport: "AMS",
        arrivalAirport: "LHR",
        departureTime: "16:25",
        arrivalTime: "17:00",
        duration: "1h 35m",
        price: (Math.random() * 300 + 900).toFixed(2), // £900-1200
        aircraft: "Airbus A320",
        stops: 0,
        amenities: ["WiFi", "In-flight entertainment", "Meal service", "Priority boarding"],
        availableSeats: 129,
      },
      {
        flightNumber: "EZY8845",
        airline: "easyJet",
        airlineCode: "EZY",
        departureAirport: "AMS",
        arrivalAirport: "LGW",
        departureTime: "21:15",
        arrivalTime: "21:45",
        duration: "1h 30m",
        price: (Math.random() * 300 + 900).toFixed(2), // £900-1200
        aircraft: "Airbus A319",
        stops: 0,
        amenities: ["Snacks for purchase", "WiFi available"],
        availableSeats: 138,
      },
    ];

    realisticFlights.forEach((flightData) => {
      const flight: Flight = {
        ...flightData,
        id: this.flightCurrentId++,
      };
      this.flights.set(flight.id, flight);
    });
  }

  async searchFlights(from: string, to: string, date: string): Promise<Flight[]> {
    const results: Flight[] = [];

    for (const flight of this.flights.values()) {
      if (flight.departureAirport === from && flight.arrivalAirport === to) {
        results.push(flight);
      }
    }

    return results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  }

  async getFlightById(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const bookingReference = this.generateBookingReference();

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

  async createPendingPayment(insertPendingPayment: InsertPendingPayment): Promise<PendingPayment> {
    const id = this.pendingPaymentId++;
    const ticketReference = this.generateTicketReference();
    const pendingPayment: PendingPayment = {
      ...insertPendingPayment,
      id,
      ticketReference,
      createdAt: new Date(),
      status: insertPendingPayment.status ?? "pending",
      addOns: insertPendingPayment.addOns ?? [],
    };

    this.pendingPaymentsMap.set(ticketReference, pendingPayment);
    return pendingPayment;
  }

  async getPendingPaymentByReference(reference: string): Promise<PendingPayment | undefined> {
    return this.pendingPaymentsMap.get(reference);
  }

  async getAllPendingPayments(): Promise<PendingPayment[]> {
    const allPayments = Array.from(this.pendingPaymentsMap.values());
    return allPayments.filter(payment => payment.status === 'pending');
  }

  async updatePendingPaymentStatus(reference: string, status: string): Promise<void> {
    const payment = this.pendingPaymentsMap.get(reference);
    if (payment) {
      payment.status = status;
      this.pendingPaymentsMap.set(reference, payment);
    }
  }

  async cleanupExpiredPayments(): Promise<void> {
    const now = new Date();
    for (const [reference, payment] of this.pendingPaymentsMap) {
      if (payment.expiresAt < now && payment.status === 'pending') {
        payment.status = 'expired';
        this.pendingPaymentsMap.set(reference, payment);
      }
    }
  }

  private generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateTicketReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TKT';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const storage = new DatabaseStorage();