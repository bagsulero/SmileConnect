# Medical Case Lead Management System

## Overview

This is a full-stack React application for managing medical case leads with role-based access control. The system allows three types of users (Admin, Student, Barangay Health Worker) to manage medical cases from submission to completion. Built with modern web technologies including React, TypeScript, Express.js, and PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom medical theme colors
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **API Design**: RESTful endpoints with JSON responses
- **TypeScript**: Full type safety across client and server

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files

## Key Components

### Role-Based Access Control
- **Admin**: Full system access, can manage users, review and publish case leads
- **Student**: Can view, save, and claim available case leads
- **Barangay Health Worker**: Can submit new case leads to the system

### Database Schema
- **Users**: User accounts with role-based permissions
- **Case Leads**: Medical cases with patient information, priority levels, and status tracking
- **Saved Cases**: Students can save cases for later review
- **Claimed Cases**: Students can claim cases and track their progress

### Frontend Features
- **Dashboard Views**: Role-specific dashboards with relevant statistics and actions
- **Case Management**: Browse, filter, and search case leads
- **Modal System**: Detailed case views and tracking interfaces
- **Responsive Design**: Mobile-friendly interface with proper breakpoints

### Backend Features
- **RESTful API**: Standardized endpoints for all resources
- **Request Logging**: Comprehensive logging for API requests
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Database Abstraction**: Storage interface for easy testing and future database changes

## Data Flow

1. **Case Submission**: Barangay health workers submit new cases through forms
2. **Admin Review**: Administrators review and approve cases for publication
3. **Student Discovery**: Students browse available cases with filtering options
4. **Case Claiming**: Students can save cases for later or claim them immediately
5. **Progress Tracking**: Students track their claimed cases through completion

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **ORM**: Drizzle ORM for type-safe database operations
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Form Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Development Dependencies
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast JavaScript bundler for production
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing pipeline

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite HMR for fast development
- **TypeScript Checking**: Real-time type checking during development
- **Database Migrations**: Drizzle Kit for schema management
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Client Build**: Vite builds optimized React bundle
- **Server Build**: ESBuild creates Node.js production bundle
- **Static Assets**: Client assets served from Express.js
- **Database**: PostgreSQL connection via connection string

### Architecture Benefits
- **Type Safety**: End-to-end TypeScript ensures reliability
- **Scalability**: Serverless database and stateless API design
- **Maintainability**: Clear separation of concerns and modular architecture
- **Performance**: Optimized builds and efficient database queries
- **Developer Experience**: Hot reloading, type checking, and modern tooling

The system is designed to be easily deployable on platforms like Replit, with automatic database provisioning and environment configuration.