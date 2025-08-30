import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { analytics } from './services/analytics'
import { reportWebVitals } from './services/vitals'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      onError={(error) => {
        try {
          analytics.trackEvent('error', {
            name: error.name,
            message: error.message,
          })
        } catch (_) {
          // no-op
        }
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// Register Service Worker for PWA/offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        analytics.trackEvent('pwa_sw_registered', { scope: registration.scope })
      })
      .catch((error) => {
        analytics.trackEvent('pwa_sw_registration_failed', { message: String(error) })
      })
  })
}

// App installed event
window.addEventListener('appinstalled', () => {
  analytics.trackEvent('pwa_app_installed')
})

// Web-vitals telemetry
reportWebVitals()
