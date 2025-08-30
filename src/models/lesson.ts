export interface Lesson {
  id: string;
  level: number;
  title: string;
  type: 'sound' | 'song' | 'practice' | 'echo';
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

export interface EchoLessonContent {
  promptText: string;
  promptAudio: string;
  minVolumeThreshold?: number;
  targetDuration?: number;
}