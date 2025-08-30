export interface UserProfile {
  id: string;
  name: string;
  ageGroup: 'kid' | 'teen' | 'adult';
  currentLevel: number;
  totalPoints: number;
  streakCount: number;
  lastStreakDate: string | null; // YYYY-MM-DD local date string of last completed day
}