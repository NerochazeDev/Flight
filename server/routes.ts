import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertSearchRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search flights
  app.get("/api/flights/search", async (req, res) => {
    try {
      const { from, to, date } = req.query;
      
      if (!from || !to || !date) {
        return res.status(400).json({ 
          error: "Missing required parameters: from, to, date" 
        });
      }
      
      const flights = await storage.searchFlights(
        from as string, 
        to as string, 
        date as string
      );
      
      // Log search request
      await storage.createSearchRequest({
        from: from as string,
        to: to as string,
        departureDate: date as string,
        returnDate: req.query.returnDate as string,
        passengers: parseInt(req.query.passengers as string) || 1,
        class: req.query.class as string || "economy",
      });
      
      res.json(flights);
    } catch (error) {
      console.error("Flight search error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get flight by ID
  app.get("/api/flights/:id", async (req, res) => {
    try {
      const flightId = parseInt(req.params.id);
      const flight = await storage.getFlightById(flightId);
      
      if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
      }
      
      res.json(flight);
    } catch (error) {
      console.error("Get flight error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error", 
          details: error.errors 
        });
      }
      console.error("Create booking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get booking by reference
  app.get("/api/bookings/:reference", async (req, res) => {
    try {
      const booking = await storage.getBookingByReference(req.params.reference);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Get booking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
