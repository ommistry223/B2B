import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom'
import ScrollToTop from 'components/ScrollToTop'
import ErrorBoundary from 'components/ErrorBoundary'

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

// Lazy load all page components for better performance
const NotFound = lazy(() => import('pages/NotFound'))
const Entry = lazy(() => import('./pages/entry'))
const Dashboard = lazy(() => import('./pages/dashboard'))
const CreateInvoice = lazy(() => import('./pages/create-invoice'))
const InvoiceManagement = lazy(() => import('./pages/invoice-management'))
const CustomerManagement = lazy(() => import('./pages/customer-management'))
const PaymentRecording = lazy(() => import('./pages/payment-recording'))
const RiskAnalytics = lazy(() => import('./pages/risk-analytics'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Settings = lazy(() => import('./pages/settings'))
const Profile = lazy(() => import('./pages/profile'))

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
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
            <Route
              path="/customer-management"
              element={<CustomerManagement />}
            />
            <Route path="/payment-recording" element={<PaymentRecording />} />
            <Route path="/risk-analytics" element={<RiskAnalytics />} />

            {/* User Routes */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default Routes
