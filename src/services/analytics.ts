export interface AnalyticsService {
  setUserId: (userId: string) => void;
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => void;
}

const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;

const createConsoleAnalytics = (): AnalyticsService => ({
  setUserId: (userId: string) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.debug('[analytics] setUserId', userId);
    }
  },
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.debug('[analytics] event', eventName, properties || {});
    }
  },
});

export const analytics: AnalyticsService = createConsoleAnalytics();

