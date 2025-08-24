// Basic data types for the Singing Learning Track app

export interface User {
  id: string;
  name: string;
  ageGroup: 'kid' | 'teen' | 'adult';
  currentLevel: number;
  totalPoints: number;
}

export interface Lesson {
  id: string;
  level: number;
  title: string;
  type: 'sound' | 'song' | 'practice';
  content: string;
  imageUrl?: string;
  description: string;
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