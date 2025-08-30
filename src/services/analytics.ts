// Simple analytics service for tracking user events
// In a production app, this would integrate with services like Google Analytics, Mixpanel, etc.

export type EventName = 
  | 'app_opened'
  | 'lesson_started'
  | 'lesson_completed'
  | 'recording_started'
  | 'recording_completed'
  | 'recording_played'
  | 'points_earned'
  | 'streak_updated'
  | 'error_occurred';

export interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

class AnalyticsService {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.trackEvent('app_opened');
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  trackEvent(name: EventName, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
    };

    this.events.push(event);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', {
        name: event.name,
        properties: event.properties,
        userId: event.userId,
      });
    }

    // In production, send to analytics service
    // this.sendToAnalyticsService(event);
  }

  // Get event funnel for a specific flow
  getEventFunnel(startEvent: EventName, endEvent: EventName): AnalyticsEvent[] {
    const startIndex = this.events.findIndex(e => e.name === startEvent);
    const endIndex = this.events.findIndex(e => e.name === endEvent);
    
    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return [];
    }

    return this.events.slice(startIndex, endIndex + 1);
  }

  // Get conversion rate between two events
  getConversionRate(startEvent: EventName, endEvent: EventName): number {
    const startCount = this.events.filter(e => e.name === startEvent).length;
    const endCount = this.events.filter(e => e.name === endEvent).length;
    
    if (startCount === 0) return 0;
    return (endCount / startCount) * 100;
  }

  // Export events for debugging/QA
  exportEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear events (useful for testing)
  clearEvents() {
    this.events = [];
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();