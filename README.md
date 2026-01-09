# 🚀 CreditFlow Pro - B2B Invoice Management System

A modern, full-stack B2B invoice and credit management application with AI-powered insights, built with React, Node.js, and PostgreSQL.

## ✨ Features

- 📊 **Dashboard Analytics** - Real-time overview of invoices, payments, and cash flow
- 👥 **Customer Management** - Track customer details, credit limits, and payment history
- 🧾 **Invoice Management** - Create, track, and manage invoices with ease
- 💰 **Payment Recording** - Record and track payments with automatic status updates
- 🎯 **Risk Analytics** - AI-powered credit risk assessment (optional OpenAI integration)
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Eye-friendly dark theme support
- 🔐 **Secure Authentication** - JWT-based authentication with password hashing

## 🛠️ Tech Stack

**Frontend:**

- React 18 - Modern UI library
- React Router v6 - Client-side routing
- TailwindCSS - Utility-first styling
- Vite - Lightning-fast build tool
- Redux Toolkit - State management
- Recharts & D3.js - Data visualization

**Backend:**

- Node.js & Express.js - RESTful API server
- PostgreSQL - Robust relational database
- JWT - Secure authentication
- bcryptjs - Password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## � Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/creditflow-pro.git
cd creditflow-pro

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup PostgreSQL Database

Create database and run schema (see `DATABASE_SETUP_GUIDE.md`):

```sql
CREATE DATABASE b2b_creditflow;
```

### 3. Configure Environment Variables

**⚠️ IMPORTANT: Never commit .env files!**

**Frontend (.env):**

```bash
cp .env.example .env
# Edit and add your values
```

**Backend (backend/.env):**

```bash
cp backend/.env.example backend/.env
# Add your DB_PASSWORD and JWT_SECRET
```

### 4. Start the Application

```bash
# Terminal 1 - Start Backend
cd backend
node server.js

# Terminal 2 - Start Frontend
npm start
```

Access at: **http://localhost:4028**

## 🔒 Security

⚠️ **CRITICAL**: Your API keys are protected!

- ✅ `.env` files are in `.gitignore`
- ✅ No hardcoded secrets in code
- ✅ Use `.env.example` as template

**Before pushing to GitHub:**

1. Verify `.env` is not tracked: `git status`
2. Check for exposed secrets: `git log -p | grep -i "password\|secret\|key"`
3. Use strong passwords in production

## 📁 Project Structure

```
B2B/
├── backend/                # Node.js API server
│   ├── controllers/        # Route handlers
│   ├── services/          # Database & business logic
│   ├── middleware/        # Auth & error handling
│   ├── routes/           # API routes
│   └── .env.example      # Backend config template
├── src/
│   ├── pages/            # Route components
│   ├── components/       # Reusable UI components
│   ├── context/         # React Context (state)
│   ├── services/        # API calls
│   └── util/            # Helper functions
├── public/              # Static assets
├── .env.example         # Frontend config template
└── README.md           # This file
```

│ ├── components/ # Reusable UI components
│ ├── pages/ # Page components
│ ├── styles/ # Global styles and Tailwind configuration
│ ├── App.jsx # Main application component
│ ├── Routes.jsx # Application routes
│ └── index.jsx # Application entry point
├── .env # Environment variables
├── index.html # HTML template
├── package.json # Project dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js # Vite configuration

````

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from 'react-router-dom'
import HomePage from 'pages/HomePage'
import AboutPage from 'pages/AboutPage'

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/about', element: <AboutPage /> },
    // Add more routes as needed
  ])

  return element
}
````

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
