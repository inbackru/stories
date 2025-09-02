# Real Estate Story Generator

## Overview

This is a full-stack web application that generates visual stories for real estate properties. The application allows users to input property details (address, type, area, costs, payment information, and bank selection) and upload images (background and floor plans) to create Instagram-style story templates. The generated stories are rendered on an HTML5 canvas with property information overlaid on the uploaded images.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Hook Form for form handling with Zod validation
- **Data Fetching**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Canvas Rendering**: HTML5 Canvas API for generating visual story templates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with structured error handling
- **File Handling**: Multer middleware for image uploads (JPEG, PNG, PDF up to 10MB)
- **Development**: Vite integration for hot module replacement and development server

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM as the query builder
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Temporary Storage**: In-memory storage implementation with fallback interface for easy database integration
- **File Storage**: Memory-based file handling (uploaded images stored temporarily)

### Database Schema
- **Story Templates Table**: Stores property information including address, type, area, costs, payment details, bank selection, and file URLs
- **Validation**: Zod schemas for runtime type safety and form validation
- **Types**: Shared TypeScript interfaces between client and server

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Basic session handling infrastructure present but not utilized

### Development and Build Process
- **Build Tool**: Vite for frontend bundling and development server
- **Backend Build**: esbuild for server-side code compilation
- **Development**: Concurrent development with Vite middleware integration
- **Type Safety**: Strict TypeScript configuration across the entire stack

### Key Features
- **Property Form**: Multi-step form with property details, financial information, and bank selection
- **Image Upload**: Drag-and-drop file upload with validation and preview
- **Canvas Generation**: Real-time story generation with property data overlay on uploaded images
- **Template Management**: Save and retrieve story templates
- **Responsive Design**: Mobile-first design with dark theme

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon Database client for PostgreSQL connections
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database migration and schema management tools

### UI and Styling
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for constructing className strings

### Form and Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: TypeScript-first schema validation

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment
- **tsx**: TypeScript execution engine for development

### File Handling
- **multer**: Middleware for handling multipart/form-data file uploads

### Additional Utilities
- **date-fns**: Modern date utility library
- **nanoid**: URL-safe unique string ID generator
- **wouter**: Minimalist routing library for React
- **cmdk**: Command palette component