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

const renderErrorOverlay = (error, source = 'runtime') => {
  const message =
    (error && (error.message || error.toString())) || 'Unknown error'
  const stack = error?.stack || ''
  root.render(
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 720, width: '100%' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          App failed to start
        </h1>
        <p style={{ marginBottom: 12 }}>Source: {source}</p>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: '#0f172a',
            color: '#e2e8f0',
            padding: 16,
            borderRadius: 8,
          }}
        >
          {message}
          {stack ? `\n\n${stack}` : ''}
        </pre>
        <p style={{ marginTop: 12, fontSize: 14, color: '#475569' }}>
          Please send this error to support.
        </p>
      </div>
    </div>
  )
}

window.addEventListener('error', event => {
  if (import.meta.env.PROD) {
    renderErrorOverlay(event.error || event.message, 'error')
  }
})

window.addEventListener('unhandledrejection', event => {
  if (import.meta.env.PROD) {
    renderErrorOverlay(event.reason, 'unhandledrejection')
  }
})

try {
  root.render(<App />)
  if (typeof window !== 'undefined') {
    window.__APP_READY__ = true
  }
} catch (error) {
  renderErrorOverlay(error, 'startup')
}

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
