import React from 'react'
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom'
import ScrollToTop from 'components/ScrollToTop'
import ErrorBoundary from 'components/ErrorBoundary'
import NotFound from 'pages/NotFound'
import Entry from './pages/entry'
import Dashboard from './pages/dashboard'
import CreateInvoice from './pages/create-invoice'
import InvoiceManagement from './pages/invoice-management'
import CustomerManagement from './pages/customer-management'
import PaymentRecording from './pages/payment-recording'
import RiskAnalytics from './pages/risk-analytics'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Settings from './pages/settings'
import Profile from './pages/profile'

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Entry/Landing Page */}
          <Route path="/" element={<Entry />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main Application Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoice-management" element={<InvoiceManagement />} />
          <Route path="/customer-management" element={<CustomerManagement />} />
          <Route path="/payment-recording" element={<PaymentRecording />} />
          <Route path="/risk-analytics" element={<RiskAnalytics />} />

          {/* User Routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default Routes
