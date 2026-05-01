# CreditFlow Pro

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://bto-b.netlify.app)
[![Deploy Status](https://api.netlify.com/api/v1/badges/6961531f-7fd8-8200-0807-9e6f/deploy-status)](https://app.netlify.com/sites/bto-b/deploys)

CreditFlow Pro is a B2B invoice and credit management app with a React frontend, Node.js backend, PostgreSQL support, and AI-assisted risk analytics. It is designed for fast local development and straightforward deployment to Netlify, Render, and Neon.

## What It Does

- Tracks customers, invoices, and payments in one place
- Provides dashboard analytics and cash-flow visibility
- Supports JWT authentication and protected API routes
- Includes credit risk scoring and payment trend insights
- Ships with a responsive UI and dark mode support

## Tech Stack

- Frontend: React 18, Vite 5, Tailwind CSS, React Router, Framer Motion, Recharts
- Backend: Node.js, Express, PostgreSQL, JWT, bcryptjs
- Tooling: npm, Netlify, Render, Neon

## Repository Layout

```text
.
├── backend/           # Express API and database layer
├── docs/              # Setup, deployment, fixes, and reference docs
├── ocr/               # Optional OCR service prototype
├── public/            # Static assets served by Vite
├── src/               # Frontend application source
├── build/             # Production build output
└── README.md
```

## Quick Start

1. Install dependencies.

```bash
npm install --legacy-peer-deps
cd backend
npm install --legacy-peer-deps
cd ..
```

2. Configure environment variables.

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Backend `.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:4028
FRONTEND_URLS=http://localhost:4028,http://localhost:5173
BACKEND_URL=http://localhost:5000
JWT_SECRET=change-this-to-a-strong-random-secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=b2b_creditflow
DB_USER=postgres
DB_PASSWORD=your-postgres-password
```

3. Start development.

```bash
npm run dev:all
```

Or run them separately:

```bash
npm run backend:dev
npm run frontend:dev
```

Frontend runs on http://localhost:4028 and backend runs on http://localhost:5000.

## Available Scripts

Root package.json:

- `npm run dev` starts the Vite dev server
- `npm run dev:all` starts frontend and backend together
- `npm run backend:dev` starts the backend in watch mode
- `npm run backend:start` starts the backend once
- `npm run build` creates the production build in `build/`
- `npm run serve` previews the production build locally
- `npm run build:analyze` opens a bundle analysis report

Backend package.json:

- `npm run dev` starts the API with nodemon
- `npm start` starts the API once

## Deployment

Frontend on Netlify:

- Build command: `npm install --legacy-peer-deps && npm run build`
- Publish directory: `build`
- Set `VITE_API_URL` to your deployed backend `/api` URL

Backend on Render or similar:

- Root directory: `backend`
- Start command: `node server.js`
- Set `FRONTEND_URL`, `FRONTEND_URLS`, `JWT_SECRET`, and database variables

Database on Neon:

- Create a Neon project
- Copy the connection string into `DATABASE_URL`
- Run `node setup-database.js` from the backend directory

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/payments`
- `POST /api/payments`
- `GET /api/health`

## Documentation

- `docs/setup/` for local and cloud setup
- `docs/deployment/` for hosting guides
- `docs/fixes/` for issue-specific fixes
- `docs/reference/` for quick references and checklists
- `backend/README.md` for API-specific notes

## Security Notes

- Do not commit `.env` files or secrets
- Use `.env.example` files as templates
- Generate a strong `JWT_SECRET` for production
- Set backend and frontend URLs explicitly in production

## Live Demo

- App: https://bto-b.netlify.app
- Backend health check: your deployed backend `/api/health` endpoint
