import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../models/user';
import type { LessonProgress } from '../models/progress';
import { getUser, saveUser as saveUserToStorage } from '../storage/userStore';
import { getProgress, saveProgress as saveProgressToStorage } from '../storage/progressStore';
import { getActiveProfile, addCompletedLesson, clearActiveProfile } from '../storage/profilesStore';
import { analytics } from '../services/analytics';

interface AppContextType {
  user: UserProfile | null;
  progress: LessonProgress[];
  isLoading: boolean;
  setUser: (user: UserProfile) => Promise<void>;
  updateProgress: (progress: LessonProgress) => Promise<void>;
  getCompletedLessonIds: () => string[];
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompletedLessons, setProfileCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Prefer active profile if present
      const activeProfile = await getActiveProfile();
      if (activeProfile) {
        // Load progress data first to calculate points and streak
        const userProgress = await getProgress(activeProfile.id);
        setProgress(userProgress);

        // Calculate total points from completed lessons with scores
        const totalPoints = userProgress
          .filter(p => p.completed)
          .reduce((sum, p) => sum + p.score, 0);

        // Calculate current streak (simplified - could be enhanced)
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const hasCompletedToday = userProgress.some(p =>
          p.completed &&
          p.completedDate.toDateString() === today.toDateString()
        );

        const hasCompletedYesterday = userProgress.some(p =>
          p.completed &&
          p.completedDate.toDateString() === yesterday.toDateString()
        );

        // Simple streak calculation - enhance as needed
        const streakCount = hasCompletedToday && hasCompletedYesterday ? 2 :
                           hasCompletedToday ? 1 : 0;

        const syntheticUser: UserProfile = {
          id: activeProfile.id,
          name: activeProfile.name,
          ageGroup: activeProfile.ageGroup,
          currentLevel: 1,
          totalPoints: totalPoints,
          streakCount: streakCount,
          lastStreakDate: hasCompletedToday ? today.toISOString().split('T')[0] : null,
        };
        setUserState(syntheticUser);
        setProfileCompletedLessons(activeProfile.completedLessons ?? []);
      } else {
        const loadedUser = await getUser();
        if (loadedUser) {
          // Migrate missing streak fields for existing users
          const migratedUser: UserProfile = {
            ...loadedUser,
            streakCount: typeof (loadedUser as any).streakCount === 'number' ? (loadedUser as any).streakCount : 0,
            lastStreakDate: (loadedUser as any).lastStreakDate ?? null,
          };
          if (migratedUser !== loadedUser) {
            await saveUserToStorage(migratedUser);
          }
          setUserState(migratedUser);
          const userProgress = await getProgress(loadedUser.id);
          setProgress(userProgress);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = async (newUser: UserProfile) => {
    await saveUserToStorage(newUser);
    setUserState(newUser);
    const userProgress = await getProgress(newUser.id);
    setProgress(userProgress);
    
    // Track user in analytics
    analytics.setUserId(newUser.id);
  };

  const updateProgress = async (newProgress: LessonProgress) => {
    await saveProgressToStorage(newProgress);
    setProgress(prev => {
      const existing = prev.find(p => 
        p.userId === newProgress.userId && p.lessonId === newProgress.lessonId
      );
      if (existing) {
        return prev.map(p => 
          p.userId === newProgress.userId && p.lessonId === newProgress.lessonId
            ? newProgress
            : p
        );
      }
      return [...prev, newProgress];
    });

    // Also persist minimal progress into the active profile
    if (user && newProgress.completed) {
      try {
        await addCompletedLesson(user.id, newProgress.lessonId);
        setProfileCompletedLessons(prev => prev.includes(newProgress.lessonId) ? prev : [...prev, newProgress.lessonId]);
      } catch (_e) {
        // no-op: profile updates are best-effort
      }

      // Update user points and streaks when a lesson is completed
      const safeScore = Number.isFinite(newProgress.score) ? Math.max(0, Math.floor(newProgress.score)) : 0;

      // Compute local YYYY-MM-DD for today and yesterday
      const now = new Date();
      const toLocalDateString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };
      const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayStr = toLocalDateString(todayDateOnly);
      const yesterdayDateOnly = new Date(todayDateOnly);
      yesterdayDateOnly.setDate(todayDateOnly.getDate() - 1);
      const yesterdayStr = toLocalDateString(yesterdayDateOnly);

      let nextStreak = user.streakCount ?? 0;
      let nextLastDate = user.lastStreakDate ?? null;
      let emittedEvent: 'streak_started' | 'streak_incremented' | null = null;

      if (user.lastStreakDate === todayStr) {
        // Already counted today: no change to streak
        nextStreak = user.streakCount ?? 0;
        nextLastDate = todayStr;
      } else if (user.lastStreakDate === yesterdayStr) {
        // Continue streak
        nextStreak = (user.streakCount ?? 0) + 1;
        nextLastDate = todayStr;
        emittedEvent = 'streak_incremented';
      } else {
        // Start (or restart) streak
        nextStreak = 1;
        nextLastDate = todayStr;
        emittedEvent = 'streak_started';
      }

      const updatedUser: UserProfile = {
        ...user,
        totalPoints: user.totalPoints + safeScore,
        streakCount: nextStreak,
        lastStreakDate: nextLastDate,
      };

      if (emittedEvent) {
        analytics.trackEvent(emittedEvent, { streakCount: nextStreak });
      }

      await setUser(updatedUser);
    }
  };

  const getCompletedLessonIds = () => {
    if (profileCompletedLessons.length > 0) {
      return profileCompletedLessons;
    }
    return progress
      .filter(p => p.completed)
      .map(p => p.lessonId);
  };

  const logout = async () => {
    try {
      await clearActiveProfile();
    } catch (_e) {}
    setUserState(null);
    setProgress([]);
    setProfileCompletedLessons([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        progress,
        isLoading,
        setUser,
        updateProgress,
        getCompletedLessonIds,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};