interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private userId: string | null = null;
  private isDevelopment = process.env.NODE_ENV === 'development';

  setUserId(id: string) {
    this.userId = id;
    if (this.isDevelopment) {
      console.log('Analytics: User ID set to', id);
    }
  }

  trackEvent(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        userId: this.userId,
        timestamp: Date.now(),
      },
    };

    if (this.isDevelopment) {
      console.log('Analytics Event:', analyticsEvent);
    }

    // In production, this would send to your analytics service
    // For now, we just log to console in development
    this.sendToAnalyticsService(analyticsEvent);
  }

  private sendToAnalyticsService(event: AnalyticsEvent) {
    // TODO: Implement actual analytics service integration
    // This could be Google Analytics, Mixpanel, Amplitude, etc.
    if (this.isDevelopment) {
      // In development, just log to console
      return;
    }

    // Production analytics service call would go here
    // Example:
    // gtag('event', event.event, event.properties);
    // or
    // mixpanel.track(event.event, event.properties);
  }

  // Convenience methods for common events
  trackAppOpened() {
    this.trackEvent('app_opened');
  }

  trackLessonStarted(lessonId: string, lessonType: string) {
    this.trackEvent('lesson_started', { lessonId, lessonType });
  }

  trackRecordingStarted(lessonId: string) {
    this.trackEvent('recording_started', { lessonId });
  }

  trackRecordingCompleted(lessonId: string, averageVolume: number, duration: number) {
    this.trackEvent('recording_completed', { 
      lessonId, 
      averageVolume, 
      duration 
    });
  }

  trackLessonCompleted(lessonId: string, score: number, passed: boolean) {
    this.trackEvent('lesson_completed', { 
      lessonId, 
      score, 
      passed 
    });
  }

  trackPointsEarned(points: number, lessonId: string) {
    this.trackEvent('points_earned', { points, lessonId });
  }

  trackStreakUpdated(newStreak: number, userId: string) {
    this.trackEvent('streak_updated', { newStreak, userId });
  }
}

export const analytics = new Analytics();