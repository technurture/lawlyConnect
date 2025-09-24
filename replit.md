# Lawly - AI-Powered Legal Marketplace

## Overview

Lawly is an AI-powered legal marketplace platform designed specifically for the Nigerian legal market. The platform connects verified Nigerian lawyers with clients seeking legal services, utilizing artificial intelligence for case analysis, lawyer matching, and document processing. The system provides a comprehensive solution that includes secure communication, escrow-based payments, and compliance with Nigerian Bar Association (NBA) requirements.

The platform serves three primary user types: clients seeking legal services, verified lawyers offering their expertise, and administrators managing the marketplace. Key features include AI-powered case triage, lawyer verification systems, secure messaging, document analysis, and payment processing through Paystack.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client application is built using React with TypeScript, utilizing Vite as the build tool and development server. The frontend follows a component-based architecture with:

- **UI Framework**: Radix UI components with shadcn/ui for consistent, accessible design patterns
- **Styling**: Tailwind CSS with custom design tokens following professional legal platform aesthetics
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication Flow**: Integration with Replit Auth for user authentication, with fallback JWT token management
- **Theme System**: Light/dark mode support with CSS custom properties

### Backend Architecture
The server follows a Node.js/Express architecture with TypeScript:

- **Framework**: Express.js with middleware for request handling, CORS, and error management
- **Authentication**: Dual authentication system supporting both Replit Auth (OAuth) and JWT tokens for flexible deployment
- **API Design**: RESTful endpoints with consistent error handling and response formatting
- **File Uploads**: Multer middleware for handling document uploads
- **Session Management**: Express sessions with MongoDB store for persistence

### Database Design
The system uses MongoDB with Mongoose ODM for data persistence:

- **User Management**: Flexible user schema supporting client, lawyer, and admin roles
- **Lawyer Profiles**: Comprehensive verification system with NBA certification tracking
- **Case Management**: Full case lifecycle from intake to resolution with status tracking
- **Messaging System**: Secure communication between clients and lawyers with file attachments
- **Payment Records**: Transaction tracking with Paystack integration references

### AI Integration
OpenAI GPT models power the intelligent features:

- **Case Analysis**: Automated categorization and complexity assessment of legal matters
- **Lawyer Matching**: AI-driven recommendations based on specialization and case requirements
- **Document Processing**: Intelligent summarization and analysis of legal documents
- **Research Assistance**: AI-powered legal research tools for lawyers

### Payment Processing
Paystack integration for Nigerian market payments:

- **Escrow System**: Secure payment holding until service completion
- **Multiple Payment Methods**: Support for cards, bank transfers, and mobile money
- **Transaction Tracking**: Complete audit trail of all financial transactions
- **Dispute Resolution**: Payment protection mechanisms for both parties

### Security and Compliance
The platform implements comprehensive security measures:

- **Data Protection**: NDPR (Nigeria Data Protection Regulation) compliance
- **Professional Verification**: NBA membership and Supreme Court enrollment verification
- **Secure Communications**: Encrypted messaging and file sharing
- **Access Control**: Role-based permissions and authentication
- **Audit Logging**: Complete activity tracking for compliance and security

## External Dependencies

### Payment Services
- **Paystack**: Primary payment processor for Nigerian Naira transactions, handling escrow payments, customer management, and transaction verification

### AI Services  
- **OpenAI API**: Powers case analysis, lawyer matching algorithms, document summarization, and legal research assistance features

### Cloud Storage
- **Cloudinary**: Media and document management platform for secure file uploads, image optimization, and document storage with legal-grade security

### Authentication
- **Replit Auth**: OAuth-based authentication system for seamless user onboarding and session management in development/hosted environments

### Database
- **MongoDB**: Primary database for all application data including users, cases, messages, and payments with session storage for authentication

### Development Tools
- **Vite**: Frontend build tool and development server with hot module replacement
- **TanStack Query**: Server state management and caching for optimal user experience
- **Radix UI**: Accessible component primitives for consistent user interface patterns

### Legal Verification
- **Nigerian Bar Association (NBA)**: Integration endpoints for lawyer verification and certification status checking
- **Supreme Court of Nigeria**: Enrollment verification for lawyer credential validation