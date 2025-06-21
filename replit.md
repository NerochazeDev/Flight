# Flight Booking Application

## Overview

This is a full-stack flight booking application built with React frontend and Express backend. The application allows users to search for flights, select flights, enter passenger details, process payments, and receive booking confirmations. The app specializes in flights between the UK and Netherlands with a modern, user-friendly interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with TanStack Query for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reloading with Vite middleware integration

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Fallback Storage**: In-memory storage for development (MemStorage class)

## Key Components

### Database Schema
- **Flights Table**: Stores flight information including routes, times, prices, aircraft details
- **Bookings Table**: Manages booking records with passenger details and payment information
- **Search Requests Table**: Logs user search queries for analytics

### API Layer
- **Flight Search**: `/api/flights/search` - Search flights with filters
- **Flight Details**: `/api/flights/:id` - Get specific flight information
- **Booking Creation**: `/api/bookings` - Create new flight bookings
- **Booking Retrieval**: `/api/bookings/:reference` - Get booking by reference

### Frontend Components
- **Multi-step Booking Flow**: Search → Select → Passenger Details → Payment → Confirmation
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Form Validation**: React Hook Form with Zod schema validation
- **Toast Notifications**: User feedback system for actions and errors

## Data Flow

1. **Search Phase**: User inputs travel criteria, frontend sends API request to backend
2. **Results Display**: Backend queries database/memory store, returns formatted flight data
3. **Selection**: User selects flight, data passed to passenger details form
4. **Passenger Input**: Form validation ensures data integrity before payment
5. **Payment Processing**: Mock payment system simulates transaction processing
6. **Booking Creation**: Backend creates booking record with unique reference
7. **Confirmation**: User receives booking confirmation with travel details

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI components for accessibility
- **wouter**: Lightweight client-side routing
- **tailwindcss**: Utility-first CSS framework
- **date-fns**: Date manipulation and formatting
- **lucide-react**: Icon library

### Backend Dependencies
- **drizzle-orm**: Type-safe PostgreSQL ORM
- **@neondatabase/serverless**: Neon Database connection driver
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store
- **tsx**: TypeScript execution for development

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration tool
- **eslint**: Code linting and formatting

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit environment
- **Hot Reloading**: Vite dev server with Express integration
- **Database**: Neon PostgreSQL with connection pooling
- **Port Configuration**: Local port 5000 mapped to external port 80

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: esbuild bundles server code for Node.js runtime
- **Database Migrations**: Drizzle Kit handles schema updates
- **Deployment Target**: Replit autoscale infrastructure

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Session Storage**: PostgreSQL-backed sessions for scalability

## Changelog

Changelog:
- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.