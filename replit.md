# Cornerstone Law Group Website

## Overview

This is a professional website for Cornerstone Law Group, P.C., a Dallas-based family law firm. The application provides informational pages about the firm's services, team, and approach, along with a client intake system for collecting case information. It features a modern React frontend with an Express backend, PostgreSQL database, and admin dashboard for managing intake submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with custom theme variables for dark professional branding
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **State Management**: TanStack React Query for server state and caching
- **Forms**: React Hook Form with Zod validation
- **Fonts**: Playfair Display (serif headings) and Inter (body text)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES Modules
- **API Design**: RESTful endpoints under `/api/` prefix
- **Authentication**: Simple password-based admin login with bcrypt hashing
- **Session Management**: Express sessions (connect-pg-simple for PostgreSQL session store available)

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit with `db:push` command for schema sync
- **Tables**:
  - `intake_submissions`: Client intake form data with status tracking
  - `admin_users`: Admin authentication credentials

### Build System
- **Development**: Vite dev server with HMR on port 5000
- **Production Build**: Custom build script using esbuild for server bundling, Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client assets to `dist/public`

### Project Structure
```
client/           # Frontend React application
  src/
    components/   # Reusable UI components
    pages/        # Route page components
    hooks/        # Custom React hooks
    lib/          # Utilities and content data
server/           # Backend Express server
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  static.ts       # Production static file serving
  vite.ts         # Development Vite integration
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema and Zod types
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Third-Party Services
- **LawPay**: External payment link integration (trust account payments)
- **Google Fonts**: Playfair Display and Inter font families

### Key NPM Packages
- **@tanstack/react-query**: Async state management
- **drizzle-orm / drizzle-zod**: Database ORM with Zod schema generation
- **bcrypt**: Password hashing for admin authentication
- **framer-motion**: Animation library
- **wouter**: Client-side routing
- **zod**: Runtime type validation