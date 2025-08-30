export interface Lesson {
  id: string;
  level: number;
  title: string;
  type: 'sound' | 'song' | 'practice';
  content: string;
  description: string;
  imageUrl?: string;
  unlocked: boolean;
  prerequisite?: string;
  unit: number;
  position: number;
}

export interface LessonContent {
  steps: string[];
  visual: string;
  audio: string;
}