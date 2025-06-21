import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertSearchRequestSchema, insertPendingPaymentSchema } from "@shared/schema";
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

  // Create pending payment ticket
  app.post("/api/pending-payments", async (req, res) => {
    try {
      const validationResult = insertPendingPaymentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid pending payment data",
          details: validationResult.error.issues
        });
      }

      const pendingPayment = await storage.createPendingPayment(validationResult.data);
      res.status(201).json(pendingPayment);
    } catch (error) {
      console.error("Create pending payment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get pending payment by reference
  app.get("/api/pending-payments/:reference", async (req, res) => {
    try {
      const pendingPayment = await storage.getPendingPaymentByReference(req.params.reference);
      
      if (!pendingPayment) {
        return res.status(404).json({ error: "Pending payment not found" });
      }
      
      res.json(pendingPayment);
    } catch (error) {
      console.error("Get pending payment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Complete pending payment
  app.post("/api/pending-payments/:reference/complete", async (req, res) => {
    try {
      const pendingPayment = await storage.getPendingPaymentByReference(req.params.reference);
      
      if (!pendingPayment) {
        return res.status(404).json({ error: "Pending payment not found" });
      }

      if (pendingPayment.status !== 'pending') {
        return res.status(400).json({ error: "Payment already processed or expired" });
      }

      // Update status to completed
      await storage.updatePendingPaymentStatus(req.params.reference, 'completed');

      // Create actual booking
      const passengerDetails = JSON.parse(pendingPayment.passengerDetails);
      const booking = await storage.createBooking({
        flightId: pendingPayment.flightId,
        passengerName: pendingPayment.passengerName,
        passengerEmail: pendingPayment.passengerEmail,
        passengerPhone: pendingPayment.passengerPhone,
        passengers: pendingPayment.passengers || 1,
        totalPrice: pendingPayment.totalPrice,
        addOns: pendingPayment.addOns || [],
        status: "confirmed"
      });

      res.json({ booking, message: "Payment completed successfully" });
    } catch (error) {
      console.error("Complete payment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Send payment reminder email
  app.post("/api/pending-payments/:reference/send-email", async (req, res) => {
    try {
      const pendingPayment = await storage.getPendingPaymentByReference(req.params.reference);
      
      if (!pendingPayment) {
        return res.status(404).json({ error: "Pending payment not found" });
      }

      const flight = await storage.getFlightById(pendingPayment.flightId);
      if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
      }

      // Create professional airline email message
      const emailContent = {
        to: pendingPayment.passengerEmail,
        subject: `Payment Required - Flight ${flight.flightNumber} Booking ${pendingPayment.ticketReference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">SkyConnect Airlines</h1>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Complete Your Booking</p>
            </div>
            
            <div style="padding: 30px; background-color: white; margin: 20px;">
              <h2 style="color: #1e40af; margin-top: 0;">Payment Required for Your Flight</h2>
              
              <p>Dear ${pendingPayment.passengerName},</p>
              
              <p>Your flight booking is currently pending payment completion. Please complete your payment within <strong>24 hours</strong> to secure your reservation.</p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e40af;">Flight Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 5px 0;"><strong>Flight:</strong></td><td>${flight.flightNumber} - ${flight.airline}</td></tr>
                  <tr><td style="padding: 5px 0;"><strong>Route:</strong></td><td>${flight.departureAirport} → ${flight.arrivalAirport}</td></tr>
                  <tr><td style="padding: 5px 0;"><strong>Departure:</strong></td><td>${flight.departureTime}</td></tr>
                  <tr><td style="padding: 5px 0;"><strong>Arrival:</strong></td><td>${flight.arrivalTime}</td></tr>
                  <tr><td style="padding: 5px 0;"><strong>Passengers:</strong></td><td>${pendingPayment.passengers}</td></tr>
                  <tr><td style="padding: 5px 0;"><strong>Total Amount:</strong></td><td><strong>£${pendingPayment.totalPrice}</strong></td></tr>
                </table>
              </div>
              
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> This booking will expire if payment is not completed by ${new Date(pendingPayment.expiresAt).toLocaleString()}. Please complete your payment to avoid losing your reservation.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="/complete-payment/${pendingPayment.ticketReference}" 
                   style="background-color: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Complete Payment Now
                </a>
              </div>
              
              <p><strong>Booking Reference:</strong> ${pendingPayment.ticketReference}</p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #6b7280;">
                If you have any questions, please contact our customer service team at support@skyconnect.com or call +44 20 7946 0958.
                <br><br>
                This is an automated message from SkyConnect Airlines. Please do not reply directly to this email.
              </p>
            </div>
          </div>
        `,
        text: `
Payment Required - Flight ${flight.flightNumber}

Dear ${pendingPayment.passengerName},

Your flight booking is currently pending payment completion. Please complete your payment within 24 hours to secure your reservation.

Flight Details:
- Flight: ${flight.flightNumber} - ${flight.airline}
- Route: ${flight.departureAirport} → ${flight.arrivalAirport}
- Departure: ${flight.departureTime}
- Arrival: ${flight.arrivalTime}
- Passengers: ${pendingPayment.passengers}
- Total Amount: £${pendingPayment.totalPrice}

Booking Reference: ${pendingPayment.ticketReference}

Complete your payment at: /complete-payment/${pendingPayment.ticketReference}

This booking will expire if payment is not completed by ${new Date(pendingPayment.expiresAt).toLocaleString()}.

SkyConnect Airlines
        `
      };

      // In a real application, you would integrate with an email service like SendGrid
      console.log("Email would be sent:", emailContent);
      
      res.json({ 
        message: "Payment reminder email sent successfully",
        emailPreview: emailContent
      });
    } catch (error) {
      console.error("Send email error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Download ticket PDF
  app.get("/api/pending-payments/:reference/download", async (req, res) => {
    try {
      const pendingPayment = await storage.getPendingPaymentByReference(req.params.reference);
      
      if (!pendingPayment) {
        return res.status(404).json({ error: "Pending payment not found" });
      }

      const flight = await storage.getFlightById(pendingPayment.flightId);
      if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
      }

      // Generate ticket content (in a real app, you'd use a PDF library)
      const ticketContent = {
        ticketReference: pendingPayment.ticketReference,
        passengerName: pendingPayment.passengerName,
        flight: flight,
        status: pendingPayment.status,
        totalPrice: pendingPayment.totalPrice,
        expiresAt: pendingPayment.expiresAt,
        addOns: pendingPayment.addOns
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="ticket-${pendingPayment.ticketReference}.json"`);
      res.json(ticketContent);
    } catch (error) {
      console.error("Download ticket error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
