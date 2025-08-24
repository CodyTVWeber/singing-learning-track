import { User, Progress } from '../types';

const STORAGE_KEYS = {
  USER: 'singtrack_user',
  PROGRESS: 'singtrack_progress',
  SETTINGS: 'singtrack_settings',
};

// User Management
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const createNewUser = (name: string, ageGroup: User['ageGroup']): User => {
  const user: User = {
    id: `user_${Date.now()}`,
    name,
    ageGroup,
    currentLevel: 1,
    totalPoints: 0,
  };
  saveUser(user);
  return user;
};

// Progress Management
export const saveProgress = (progress: Progress): void => {
  const allProgress = getAllProgress();
  const index = allProgress.findIndex(
    p => p.userId === progress.userId && p.lessonId === progress.lessonId
  );
  
  if (index >= 0) {
    allProgress[index] = progress;
  } else {
    allProgress.push(progress);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
};

export const getAllProgress = (): Progress[] => {
  const progressStr = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (!progressStr) return [];
  try {
    return JSON.parse(progressStr);
  } catch {
    return [];
  }
};

export const getUserProgress = (userId: string): Progress[] => {
  return getAllProgress().filter(p => p.userId === userId);
};

export const getLessonProgress = (userId: string, lessonId: string): Progress | null => {
  return getAllProgress().find(
    p => p.userId === userId && p.lessonId === lessonId
  ) || null;
};

export const isLessonCompleted = (userId: string, lessonId: string): boolean => {
  const progress = getLessonProgress(userId, lessonId);
  return progress?.completed || false;
};

// User Stats
export const getUserStats = (userId: string) => {
  const progress = getUserProgress(userId);
  const completedLessons = progress.filter(p => p.completed).length;
  const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
  const lastActivity = progress.length > 0 
    ? new Date(Math.max(...progress.map(p => new Date(p.completedDate).getTime())))
    : null;
  
  return {
    completedLessons,
    totalScore,
    lastActivity,
    streak: calculateStreak(userId),
  };
};

// Calculate daily streak
const calculateStreak = (userId: string): number => {
  const progress = getUserProgress(userId);
  if (progress.length === 0) return 0;
  
  // Sort by date descending
  const sortedDates = progress
    .map(p => new Date(p.completedDate).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  // Check if user has activity today or yesterday
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }
  
  // Count consecutive days
  let currentDate = new Date(sortedDates[0]);
  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    const dayDiff = Math.floor((currentDate.getTime() - date.getTime()) / 86400000);
    
    if (dayDiff <= 1) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }
  
  return streak;
};

// Update user points
export const updateUserPoints = (userId: string, points: number): void => {
  const user = getUser();
  if (user && user.id === userId) {
    user.totalPoints += points;
    saveUser(user);
  }
};

// Clear all data (for testing/reset)
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
};