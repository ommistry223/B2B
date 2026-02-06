import React, { Suspense, lazy } from 'react'
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  useLocation,
} from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollToTop from 'components/ScrollToTop'
import ErrorBoundary from 'components/ErrorBoundary'

// Enhanced loading component with animation
const LoadingFallback = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
  >
    <div className="text-center">
      <motion.div
        className="inline-block rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
      >
        Loading...
      </motion.p>
    </div>
  </motion.div>
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
const GoogleCallback = lazy(() => import('./pages/auth/GoogleCallback'))
const Settings = lazy(() => import('./pages/settings'))
const Profile = lazy(() => import('./pages/profile'))
const Demo3DPage = lazy(() => import('./pages/Demo3DPage'))
const EnhancedEntry = lazy(() => import('./pages/entry/EnhancedEntry'))
const ShadcnShowcase = lazy(() => import('./pages/ShadcnShowcase'))
const AnimationShowcase = lazy(() => import('./pages/AnimationShowcase'))

// Animated Routes Wrapper Component
const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <RouterRoutes location={location} key={location.pathname}>
        {/* Entry/Landing Page */}
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <Entry />
            </motion.div>
          }
        />

        {/* Enhanced Entry with 3D */}
        <Route
          path="/enhanced"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <EnhancedEntry />
            </motion.div>
          }
        />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Register />
            </motion.div>
          }
        />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Main Application Routes with smooth transitions */}
        <Route
          path="/dashboard"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <Dashboard />
            </motion.div>
          }
        />
        <Route
          path="/create-invoice"
          element={
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <CreateInvoice />
            </motion.div>
          }
        />
        <Route
          path="/invoice-management"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <InvoiceManagement />
            </motion.div>
          }
        />
        <Route
          path="/customer-management"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <CustomerManagement />
            </motion.div>
          }
        />
        <Route
          path="/payment-recording"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <PaymentRecording />
            </motion.div>
          }
        />
        <Route
          path="/risk-analytics"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <RiskAnalytics />
            </motion.div>
          }
        />

        {/* User Routes */}
        <Route
          path="/settings"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Settings />
            </motion.div>
          }
        />
        <Route
          path="/profile"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Profile />
            </motion.div>
          }
        />

        {/* Demo Routes */}
        <Route
          path="/demo-3d"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Demo3DPage />
            </motion.div>
          }
        />
        <Route
          path="/showcase"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ShadcnShowcase />
            </motion.div>
          }
        />
        <Route
          path="/animations"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <AnimationShowcase />
            </motion.div>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <NotFound />
            </motion.div>
          }
        />
      </RouterRoutes>
    </AnimatePresence>
  )
}

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default Routes
