<div align="center">

<img src="https://img.shields.io/badge/CreditFlow-Pro-4F46E5?style=for-the-badge&logoColor=white" alt="CreditFlow Pro" height="40" />

# CreditFlow Pro

**Enterprise B2B Credit & Cash Flow Management Platform**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bto--b.netlify.app-4F46E5?style=flat-square&logo=netlify&logoColor=white)](https://bto-b.netlify.app)
[![Deploy Status](https://api.netlify.com/api/v1/badges/6961531f-7fd8-8200-0807-9e6f/deploy-status)](https://app.netlify.com/sites/bto-b/deploys)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

CreditFlow Pro is a production-ready SaaS platform that helps B2B businesses eliminate payment delays, reduce credit risk, and maintain healthy cash flow — all from a single, beautifully designed dashboard.

[**Live Demo →**](https://bto-b.netlify.app) · [**Report a Bug**](https://github.com/ommistry223/B2B/issues) · [**Request a Feature**](https://github.com/ommistry223/B2B/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Managing B2B credit in India is hard. Delayed payments, overdue invoices, and poor cash-flow visibility cost SMEs thousands every month. CreditFlow Pro solves this with:

- **Real-time dashboards** that surface overdue invoices, risk-flagged customers, and upcoming payments at a glance
- **AI-powered credit scoring** that evaluates payment behavior, outstanding balances, and historical data to flag risky accounts before they become bad debt
- **Automated reminders** that trigger payment nudges at the right time without manual effort
- **Tally XML import** so existing ERP data flows into the platform in seconds
- **GST-compliant invoicing** built for the Indian B2B market

---

## Key Features

### 📊 Dashboard & Analytics
- Live metrics — total outstanding, overdue count, safe cash, average payment delay
- Cash flow charts, payment trend charts, and risk distribution visualization
- Predictive analytics panel with AI-generated insights
- Date-range and customer-segment filtering across all views

### 🧾 Invoice Management
- Create, edit, and track invoices with automatic status calculation (`pending` → `overdue` → `partial` → `paid`)
- Record partial or full payments against any invoice
- Import invoices and customers from Tally XML exports
- Export filtered invoice data to CSV

### 👥 Customer Management
- Full customer profiles with credit limit, GST number, and contact details
- Automatic credit utilization scoring per customer
- Risk level classification (Low / Medium / High) based on payment behavior
- Customer-level payment history timeline

### 💳 Payment Recording
- Record payments against single or multiple invoices in one transaction
- Supports multiple payment modes (NEFT, RTGS, cheque, UPI, cash)
- Automatic invoice status recalculation after each payment

### 📈 Risk Analytics
- Portfolio-level risk distribution breakdown
- Customer-wise risk scores and trend analysis
- Overdue aging buckets (0–30, 31–60, 61–90, 90+ days)
- Predictive cash-collection forecasting

### 🔐 Authentication
- Email / password login and registration with full validation
- Google OAuth (redirect-based, works on deployed backends)
- JWT-based session management with secure refresh
- Protected routes with role-aware navigation

### 🎨 UI & Experience
- Light and dark mode with smooth, system-aware transitions
- Fully responsive — mobile, tablet, and desktop
- Accessible components built on Radix UI primitives
- Clean, enterprise-grade design system (no gradients, no neon glows)
- Framer Motion page transitions and micro-interactions

---

## Screenshots

> The live demo at [bto-b.netlify.app](https://bto-b.netlify.app) shows the full experience.

| Screen | Description |
|--------|-------------|
| **Login** | Two-column split layout — brand panel + clean sign-in form |
| **Dashboard** | Metric cards, cash-flow chart, risk distribution, activity feed |
| **Invoice Management** | Sortable table with inline payment recording |
| **Customer Management** | Risk-scored customer cards with utilization gauges |
| **Risk Analytics** | Aging buckets, trend lines, and AI insight panel |
| **Create Invoice** | Step-by-step form with live totals and GST calculation |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI library |
| Vite | 5.0 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 10 | Animations & transitions |
| Recharts | 2.15 | Data visualization |
| React Router | 6 | Client-side routing |
| Radix UI | Latest | Accessible UI primitives |
| class-variance-authority | 0.7 | Component variant system |
| React Helmet Async | 2.0 | SEO & document head management |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4 | HTTP framework |
| PostgreSQL | 15 | Primary database |
| Neon | — | Serverless Postgres (production) |
| JWT + bcryptjs | — | Authentication & password hashing |
| node-postgres (pg) | 8 | Database client |

### Tooling & Infrastructure
| Tool | Purpose |
|---|---|
| Netlify | Frontend hosting with CI/CD |
| Render | Backend hosting |
| Neon | Serverless PostgreSQL |
| concurrently | Run frontend + backend together in development |
| rollup-plugin-visualizer | Bundle size analysis |

---

## Project Structure

```
B2B/
├── backend/                    # Express API
│   ├── controllers/            # Route handler functions
│   ├── middleware/              # Auth, error handling, CORS
│   ├── models/                 # Database query functions
│   ├── routes/                 # API route definitions
│   ├── setup-database.js       # Database schema setup script
│   └── server.js               # Express entry point
│
├── src/                        # React frontend
│   ├── components/
│   │   ├── navigation/         # Header, MobileNavigation, NotificationCenter
│   │   └── ui/                 # Button, Input, Select, Checkbox, ThemeToggle, etc.
│   ├── context/
│   │   ├── DataContext.jsx     # Global invoices, customers, payments state
│   │   ├── UserContext.jsx     # Auth state and session management
│   │   └── ThemeContext.jsx    # Light / dark mode
│   ├── pages/
│   │   ├── auth/               # Login, Register, GoogleCallback
│   │   ├── dashboard/          # Dashboard + MetricCard, Charts, ActivityFeed
│   │   ├── invoice-management/ # Invoice list, filters, table, payment modal
│   │   ├── create-invoice/     # Invoice creation form
│   │   ├── payment-recording/  # Payment recording form
│   │   ├── customer-management/# Customer list and detail views
│   │   ├── risk-analytics/     # Risk charts and AI insights
│   │   ├── profile/            # User profile editing
│   │   └── settings/           # App settings
│   ├── services/
│   │   └── api.js              # Centralized API client (fetch-based)
│   ├── styles/
│   │   ├── tailwind.css        # Design tokens, component classes, dark mode
│   │   ├── index.css           # Global animations and base styles
│   │   └── mobile-responsive.css # Mobile-specific overrides
│   └── util/
│       ├── animations.js       # Framer Motion variants
│       ├── cn.js               # clsx + tailwind-merge helper
│       ├── invoiceUtils.js     # Invoice enrichment and status logic
│       └── openaiService.js    # Credit risk scoring logic
│
├── docs/                       # Setup, deployment, and reference docs
├── public/                     # Static assets (favicon, manifest, sw.js)
├── index.html                  # Vite HTML entry point
├── vite.config.mjs             # Vite configuration
├── tailwind.config.js          # Tailwind theme and plugin config
└── netlify.toml                # Netlify build and redirect config
```

---

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- PostgreSQL 14+ (local) **or** a [Neon](https://neon.tech) account (cloud)

### 1 — Clone the repository

```bash
git clone https://github.com/ommistry223/B2B.git
cd B2B
```

### 2 — Install dependencies

```bash
# Install frontend dependencies
npm install --legacy-peer-deps

# Install backend dependencies
cd backend
npm install --legacy-peer-deps
cd ..
```

### 3 — Configure environment variables

Create a `.env` file in the **root** directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Create a `.env` file in the **`backend/`** directory:

```env
PORT=5000
NODE_ENV=development

# URLs
FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=http://localhost:3000,http://localhost:5173
BACKEND_URL=http://localhost:5000

# Auth
JWT_SECRET=replace-with-a-strong-random-secret-at-least-32-chars

# PostgreSQL (local)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=b2b_creditflow
DB_USER=postgres
DB_PASSWORD=your-postgres-password

# PostgreSQL (Neon — alternative to DB_* variables above)
# DATABASE_URL=postgres://user:password@host/db?sslmode=require

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> **Never commit `.env` files.** Both are already in `.gitignore`.

### 4 — Set up the database

```bash
cd backend
node setup-database.js
cd ..
```

This creates all required tables (`users`, `customers`, `invoices`, `payments`) in your PostgreSQL database.

### 5 — Start development

```bash
# Run frontend and backend together
npm run dev:all
```

Or run them separately in two terminals:

```bash
# Terminal 1 — Backend (port 5000)
npm run backend:dev

# Terminal 2 — Frontend (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Frontend (`.env` in project root)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Yes | `http://localhost:5000/api` | Backend API base URL |

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP port (default: `5000`) |
| `NODE_ENV` | No | `development` or `production` |
| `JWT_SECRET` | **Yes** | Strong secret for signing JWTs — use 32+ random characters |
| `FRONTEND_URL` | **Yes** | Primary allowed CORS origin |
| `FRONTEND_URLS` | No | Comma-separated list of additional allowed CORS origins |
| `BACKEND_URL` | No | Self-reference URL (used in OAuth redirect construction) |
| `DB_HOST` | Yes* | PostgreSQL host |
| `DB_PORT` | No | PostgreSQL port (default: `5432`) |
| `DB_NAME` | Yes* | Database name |
| `DB_USER` | Yes* | Database user |
| `DB_PASSWORD` | Yes* | Database password |
| `DATABASE_URL` | Yes* | Full Neon/PostgreSQL connection string (replaces individual DB_* vars) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth app client secret |

> \* Either `DATABASE_URL` **or** the individual `DB_*` variables are required.

---

## Available Scripts

### Root (frontend)

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run dev:all` | Start frontend and backend together with `concurrently` |
| `npm run frontend:dev` | Alias for `npm run dev` |
| `npm run backend:dev` | Start backend with `nodemon` in watch mode |
| `npm run backend:start` | Start backend once (no watch) |
| `npm run build` | Production build → `build/` directory |
| `npm run build:analyze` | Production build + open bundle visualizer |
| `npm run serve` | Preview the production build locally |

### Backend (`cd backend`)

| Script | Description |
|---|---|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API once |

---

## API Reference

All API routes are prefixed with `/api`. Protected routes require a valid `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Create a new user account |
| `POST` | `/auth/login` | — | Sign in and receive a JWT |
| `GET` | `/auth/profile` | ✅ | Get the authenticated user's profile |
| `PUT` | `/auth/profile` | ✅ | Update profile details |
| `PUT` | `/auth/change-password` | ✅ | Change password |
| `GET` | `/auth/google` | — | Initiate Google OAuth flow |
| `GET` | `/auth/google/callback` | — | Google OAuth callback |

### Customers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/customers` | ✅ | List all customers |
| `POST` | `/customers` | ✅ | Create a customer |
| `GET` | `/customers/:id` | ✅ | Get a single customer |
| `PUT` | `/customers/:id` | ✅ | Update a customer |
| `DELETE` | `/customers/:id` | ✅ | Delete a customer |

### Invoices

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/invoices` | ✅ | List all invoices |
| `POST` | `/invoices` | ✅ | Create an invoice |
| `GET` | `/invoices/:id` | ✅ | Get a single invoice |
| `PUT` | `/invoices/:id` | ✅ | Update an invoice |
| `DELETE` | `/invoices/:id` | ✅ | Delete an invoice |
| `POST` | `/invoices/import-tally` | ✅ | Import invoices from Tally XML |

### Payments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/payments` | ✅ | List all payments |
| `POST` | `/payments` | ✅ | Record a payment |
| `GET` | `/payments/:id` | ✅ | Get a single payment |

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | API health check |

---

## Deployment

### Frontend → Netlify

1. Push to GitHub (this repository)
2. Connect the repo to [Netlify](https://netlify.com)
3. Set the following in **Site Settings → Build & Deploy**:

   | Setting | Value |
   |---|---|
   | Build command | `npm install --legacy-peer-deps && npm run build` |
   | Publish directory | `build` |
   | Environment variable `VITE_API_URL` | Your Render backend URL + `/api` |

4. Netlify will auto-deploy on every push to `main`.

> The `netlify.toml` and `public/_redirects` files are already configured for SPA routing.

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect this repository and set **Root Directory** to `backend`
3. Configure the service:

   | Setting | Value |
   |---|---|
   | Build command | `npm install` |
   | Start command | `node server.js` |
   | Environment | Set all `backend/.env` variables as Render environment variables |

4. Add all backend environment variables in **Render → Environment**.

### Database → Neon

1. Create a project on [Neon](https://neon.tech)
2. Copy the **connection string** (looks like `postgres://user:pass@host/db?sslmode=require`)
3. Set it as `DATABASE_URL` in your Render environment variables
4. Run the setup script once against Neon:

```bash
DATABASE_URL="your-neon-connection-string" node backend/setup-database.js
```

---

## Roadmap

- [ ] **Invoice PDF generation** — download and email invoice PDFs
- [ ] **Email notifications** — automated overdue reminders via SendGrid
- [ ] **WhatsApp reminders** — payment nudges via Twilio WhatsApp API
- [ ] **Bulk operations** — select and action multiple invoices at once
- [ ] **Onboarding wizard** — guided setup for new accounts
- [ ] **Role-based access control** — admin, manager, and viewer roles
- [ ] **Multi-company support** — manage multiple business entities per account
- [ ] **Audit log** — full history of every change made to invoices and payments
- [ ] **Command palette** — `Ctrl+K` quick-access to any page or action
- [ ] **Mobile app** — React Native client for iOS and Android

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repository, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a pull request
```

Please follow the existing code style (Tailwind utility classes, design token variables, no inline gradient colors).

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for the Indian B2B market

[Live Demo](https://bto-b.netlify.app) · [GitHub](https://github.com/ommistry223/B2B) · [Report Issue](https://github.com/ommistry223/B2B/issues)

</div>
