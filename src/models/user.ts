export interface UserProfile {
  id: string;
  name: string;
  ageGroup: 'kid' | 'teen' | 'adult';
  currentLevel: number;
  totalPoints: number;
}