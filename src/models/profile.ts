export interface Profile {
  id: string;
  name: string;
  ageGroup: 'kid' | 'teen' | 'adult';
  completedLessons: string[];
}

