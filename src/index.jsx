import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tailwind.css'
import './styles/index.css'
import './styles/mobile-responsive.css'

// Import performance monitoring utilities
import { logWebVitals, reportPageMetrics } from './util/performanceMonitor'
import { registerServiceWorker } from './util/serviceWorkerRegistration'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App />)

// Initialize performance monitoring in production
if (import.meta.env.PROD) {
  logWebVitals()
  reportPageMetrics()
  registerServiceWorker()
}

// Report web vitals in development for debugging
if (import.meta.env.DEV) {
  reportPageMetrics()
}
