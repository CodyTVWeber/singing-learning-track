import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals'
import type { Metric } from 'web-vitals'
import { analytics } from './analytics'

function track(metric: Metric) {
  try {
    analytics.trackEvent('web_vitals', {
      name: metric.name,
      id: metric.id,
      value: Math.round(metric.value * 1000) / 1000,
      rating: (metric as any).rating,
    })
  } catch (_) {
    // swallow analytics errors in vitals path
  }
}

export function reportWebVitals() {
  onCLS(track)
  onFID(track)
  onLCP(track)
  onINP(track)
  onTTFB(track)
}

