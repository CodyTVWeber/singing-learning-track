import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../models/user';
import type { LessonProgress } from '../models/progress';
import { getUser, saveUser as saveUserToStorage } from '../storage/userStore';
import { getProgress, saveProgress as saveProgressToStorage } from '../storage/progressStore';
import { analytics } from '../services/analytics';

interface AppContextType {
  user: UserProfile | null;
  progress: LessonProgress[];
  isLoading: boolean;
  setUser: (user: UserProfile) => Promise<void>;
  updateProgress: (progress: LessonProgress) => Promise<void>;
  getCompletedLessonIds: () => string[];
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

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const loadedUser = await getUser();
      if (loadedUser) {
        setUserState(loadedUser);
        const userProgress = await getProgress(loadedUser.id);
        setProgress(userProgress);
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

    // Update user points and streak
    if (user && newProgress.completed) {
      // Check if this is the user's first lesson today
      const today = new Date().toDateString();
      const todaysLessons = progress.filter(p => 
        p.completed && 
        new Date(p.completedDate!).toDateString() === today
      );
      
      // If this is the first lesson today, increment streak
      const isFirstLessonToday = todaysLessons.length === 0;
      const updatedUser = {
        ...user,
        totalPoints: user.totalPoints + newProgress.score,
        streak: isFirstLessonToday ? user.streak + 1 : user.streak,
      };
      await setUser(updatedUser);
      
      // Track streak update if changed
      if (isFirstLessonToday) {
        analytics.trackEvent('streak_updated', { 
          newStreak: updatedUser.streak,
          userId: user.id 
        });
      }
    }
  };

  const getCompletedLessonIds = () => {
    return progress
      .filter(p => p.completed)
      .map(p => p.lessonId);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};