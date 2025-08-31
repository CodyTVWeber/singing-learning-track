export interface Profile {
  id: string;
  name: string;
  ageGroup: 'kid' | 'teen' | 'adult';
  email: string; // username
  completedLessons: string[];
}

