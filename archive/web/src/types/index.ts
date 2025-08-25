// Basic data types for the Singing Learning Track app

export interface User {
  id: string;
  name: string;
  ageGroup: 'kid' | 'teen' | 'adult';
  currentLevel: number;
  totalPoints: number;
  streak: number;
}

export interface Lesson {
  id: string;
  level: number;
  title: string;
  type: 'sound' | 'song' | 'practice';
  content: string;
  imageUrl?: string;
  description: string;
  unlocked?: boolean;
  prerequisite?: string | null; // ID of lesson that must be completed first
  unit?: number; // Which skill tree unit this belongs to
  position?: number; // Position within the unit
}

export interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  completedDate: Date;
}

export interface AudioRecording {
  blob: Blob;
  duration: number;
  timestamp: Date;
}