import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  flightNumber: text("flight_number").notNull(),
  airline: text("airline").notNull(),
  airlineCode: text("airline_code").notNull(),
  departureAirport: text("departure_airport").notNull(),
  arrivalAirport: text("arrival_airport").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  aircraft: text("aircraft"),
  stops: integer("stops").default(0),
  amenities: text("amenities").array(),
  availableSeats: integer("available_seats").default(100),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingReference: text("booking_reference").notNull().unique(),
  flightId: integer("flight_id").notNull(),
  passengerName: text("passenger_name").notNull(),
  passengerEmail: text("passenger_email").notNull(),
  passengerPhone: text("passenger_phone").notNull(),
  passengers: integer("passengers").default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  addOns: text("add_ons").array().default([]),
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchRequests = pgTable("search_requests", {
  id: serial("id").primaryKey(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  departureDate: text("departure_date").notNull(),
  returnDate: text("return_date"),
  passengers: integer("passengers").default(1),
  class: text("class").default("economy"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pendingPayments = pgTable("pending_payments", {
  id: serial("id").primaryKey(),
  ticketReference: text("ticket_reference").notNull().unique(),
  flightId: integer("flight_id").notNull(),
  passengerName: text("passenger_name").notNull(),
  passengerEmail: text("passenger_email").notNull(),
  passengerPhone: text("passenger_phone").notNull(),
  passengerDetails: text("passenger_details").notNull(), // JSON string
  passengers: integer("passengers").default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  addOns: text("add_ons").array().default([]),
  status: text("status").default("pending"), // pending, completed, expired
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingReference: true,
  createdAt: true,
});

export const insertSearchRequestSchema = createInsertSchema(searchRequests).omit({
  id: true,
  createdAt: true,
});

export const insertPendingPaymentSchema = createInsertSchema(pendingPayments).omit({
  id: true,
  ticketReference: true,
  createdAt: true,
});

export type Flight = typeof flights.$inferSelect;
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type SearchRequest = typeof searchRequests.$inferSelect;
export type InsertSearchRequest = z.infer<typeof insertSearchRequestSchema>;
export type PendingPayment = typeof pendingPayments.$inferSelect;
export type InsertPendingPayment = z.infer<typeof insertPendingPaymentSchema>;
