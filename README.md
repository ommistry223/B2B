#  CreditFlow Pro - B2B Invoice Management System

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://bto-b.netlify.app)
[![Deploy Status](https://api.netlify.com/api/v1/badges/6961531f-7fd8-8200-0807-9e6f/deploy-status)](https://app.netlify.com/sites/bto-b/deploys)

>  **Live Application**: [https://bto-b.netlify.app](https://bto-b.netlify.app)

A modern, full-stack B2B invoice and credit management application with AI-powered insights, built with React, Node.js, and PostgreSQL. Streamline your business operations with real-time analytics, automated payment tracking, and intelligent risk assessment.

##  Key Features

###  **Dashboard Analytics**
- Real-time overview of invoices, payments, and cash flow
- Interactive charts powered by Recharts & D3.js
- Cash flow forecasting and payment trends visualization
- Upcoming payments calendar and alerts

###  **Customer Management**
- Comprehensive customer database with credit limits
- Payment history tracking and analysis
- Risk scoring and credit limit warnings
- Bulk operations for efficient management

###  **Invoice Management**
- Create professional invoices with line items
- Track invoice status (pending, paid, overdue)
- Automatic payment allocation and status updates
- Invoice search, filtering, and export capabilities

###  **Payment Recording**
- Multi-invoice payment allocation
- Multiple payment method support
- Payment history and reconciliation
- Automatic outstanding balance updates

###  **Risk Analytics**
- AI-powered credit risk assessment
- Customer risk distribution visualization
- Payment behavior analysis
- Proactive risk alerts and insights

###  **Security & Authentication**
- JWT-based secure authentication
- Password encryption with bcrypt
- Protected API routes and middleware
- Session management and token refresh

###  **User Experience**
-  Fully responsive design - works on desktop, tablet, and mobile
-  Dark mode support for comfortable viewing
-  Lightning-fast performance with Vite
-  Intuitive navigation and user interface

##  Tech Stack

**Frontend:**
-  **React 18** - Modern UI library with hooks
-  **Vite 5** - Next-generation frontend tooling
-  **TailwindCSS** - Utility-first CSS framework
-  **React Router v6** - Client-side routing
-  **Recharts & D3.js** - Advanced data visualization
-  **Axios** - HTTP client for API calls

**Backend:**
-  **Node.js & Express.js** - RESTful API server
-  **PostgreSQL** - Production-grade relational database
-  **JWT** - Secure token-based authentication
-  **bcryptjs** - Password hashing and encryption
-  **Express Validator** - Request validation

**Deployment & Infrastructure:**
-  **Netlify** - Frontend hosting with CDN
-  **Neon** - PostgreSQL serverless database
-  **Your Backend Host** - Node.js API (Render, Vercel, etc.)
-  **GitHub Actions** - CI/CD pipeline (optional)

##  Live Demo

** Application**: [https://bto-b.netlify.app](https://bto-b.netlify.app)

**Test the application features:****
1. Register a new account
2. Create customers with credit limits
3. Generate invoices
4. Record payments
5. View analytics and insights

##  Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

##  Quick Start

### 1 Clone the Repository

```bash
git clone https://github.com/yourusername/B2B.git
cd B2B
```

### 2 Install Dependencies

```bash
# Install frontend dependencies
npm install --legacy-peer-deps

# Install backend dependencies
cd backend
npm install --legacy-peer-deps
cd ..
```

### 3 Setup PostgreSQL Database

**Create Database:**
```sql
CREATE DATABASE b2b_creditflow;
```

**Run Database Setup Script:**
```bash
cd backend
node setup-database.js
```

This will create all necessary tables:
- `users` - User accounts
- `customers` - Customer information
- `invoices` - Invoice records
- `payments` - Payment transactions

### 4 Configure Environment Variables

**Frontend Root Directory (.env):**
```bash
VITE_API_URL=http://localhost:5000/api
```

**Backend Directory (backend/.env):**
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=b2b_creditflow
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:4028

# Optional: OpenAI API Key (for AI features)
OPENAI_API_KEY=your_openai_api_key_here
```

### 5 Start the Application

**Terminal 1 - Start Backend Server:**
```bash
cd backend
node server.js
```
Backend will run on: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend will run on: `http://localhost:4028`

### 6 Access the Application

Open your browser and navigate to: `http://localhost:4028`

**Default Route**: Registration page or Login

##  Project Structure

```
B2B/
 backend/                    # Node.js API server
    controllers/           # Route handlers & business logic
    services/              # Database operations
    middleware/            # Auth & error handling
    routes/                # API endpoints
    server.js              # Express server entry point
    setup-database.js      # Database initialization
    package.json           # Backend dependencies
 src/                       # Frontend source code
    pages/                 # Page components
    components/            # Reusable UI components
    context/               # React Context providers
    services/              # API communication
    util/                  # Helper functions
    styles/                # Global styles
    App.jsx                # Main app component
    Routes.jsx             # Route configuration
    index.jsx              # React entry point
 public/                    # Static assets
 .env                       # Frontend environment variables
 package.json               # Frontend dependencies
 tailwind.config.js         # Tailwind configuration
 vite.config.mjs            # Vite configuration
 README.md                  # This file
```

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record payment

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/risk` - Risk analysis data

##  Security Best Practices

 **CRITICAL:** Never commit `.env` files to version control!

##  Deployment Guide

###  Netlify (Frontend)
- Build command: `npm install --legacy-peer-deps && npm run build`
- Publish directory: `build`
- Environment Variables: `VITE_API_URL=https://your-backend-domain.com/api`

###  Backend Hosting (Render, Vercel, etc.)
- Root Directory: `/backend`
- Start Command: `node server.js`
- Add environment variables for Neon database connection

###  Neon Database
- Create a project at https://neon.tech
- Copy the connection string
- Add to backend environment variables:
  - `DATABASE_URL=your-neon-connection-string`
  - Or individual: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Run: `node setup-database.js` to initialize tables

##  Available Scripts

### Frontend
```bash
npm run dev          # Start development server (port 4028)
npm run build        # Build for production
```

### Backend
```bash
node server.js              # Start API server (port 5000)
node setup-database.js      # Initialize database tables
```

##  Troubleshooting

**Port Already in Use:**
```bash
npx kill-port 5000    # Backend
npx kill-port 4028    # Frontend
```

**Database Connection Error:**
- Check PostgreSQL is running
- Verify credentials in `.env`

**CORS Error:**
- Verify `FRONTEND_URL` in backend `.env`
- Ensure correct API URL in frontend

##  Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m ''Add AmazingFeature''`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

##  License

MIT License - see LICENSE file for details.

##  Acknowledgments

- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Netlify](https://netlify.com)

---

<div align="center">

###  Star this repository if you find it helpful!

**Live Demo**: [https://bto-b.netlify.app](https://bto-b.netlify.app)

Made with 

</div>
