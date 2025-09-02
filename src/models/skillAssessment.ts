// Lesson Step Types
export type LessonStepType = 
  | 'assessment'
  | 'recording'
  | 'echo'
  | 'clap-the-beat'
  | 'pitch-practice'
  | 'breathing-exercise'
  | 'vocal-exercise'
  | 'theory'
  | 'performance'
  | 'listening';

// Base interface for all lesson steps
export interface BaseLessonStep {
  id: string;
  type: LessonStepType;
  title: string;
  instructions: string;
  duration?: number; // estimated duration in seconds
  points?: number;
}

// Specific lesson step types
export interface AssessmentStep extends BaseLessonStep {
  type: 'assessment';
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface RecordingStep extends BaseLessonStep {
  type: 'recording';
  promptText?: string;
  promptAudio?: string;
  maxDuration: number;
  minVolumeThreshold?: number;
  targetPitch?: number; // in Hz
}

export interface EchoStep extends BaseLessonStep {
  type: 'echo';
  promptText: string;
  promptAudio: string;
  minVolumeThreshold: number;
  targetDuration: number;
}

export interface ClapTheBeatStep extends BaseLessonStep {
  type: 'clap-the-beat';
  pattern: string[]; // e.g., ['clap', 'rest', 'clap', 'clap']
  bpm: number;
  audioExample?: string;
}

export interface PitchPracticeStep extends BaseLessonStep {
  type: 'pitch-practice';
  targetNote: string; // e.g., 'C4'
  targetHz: number;
  referenceAudio?: string;
  tolerance?: number; // cents
}

export interface BreathingExerciseStep extends BaseLessonStep {
  type: 'breathing-exercise';
  pattern: {
    inhale: number; // seconds
    hold?: number;
    exhale: number;
    rest?: number;
  };
  repetitions: number;
  visualGuide?: string; // animation or image URL
}

export interface VocalExerciseStep extends BaseLessonStep {
  type: 'vocal-exercise';
  exerciseType: 'scales' | 'arpeggios' | 'vowels' | 'consonants' | 'dynamics';
  audioGuide: string;
  visualGuide?: string;
}

export interface TheoryStep extends BaseLessonStep {
  type: 'theory';
  content: string; // markdown or HTML content
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    caption?: string;
  }[];
}

export interface PerformanceStep extends BaseLessonStep {
  type: 'performance';
  songTitle: string;
  backingTrack?: string;
  lyrics?: string;
  sheetMusic?: string; // URL to sheet music image/PDF
}

export interface ListeningStep extends BaseLessonStep {
  type: 'listening';
  audioUrl: string;
  questions?: Array<{
    question: string;
    timestamp?: number; // when to ask during playback
  }>;
}

// Union type for all lesson steps
export type LessonStep = 
  | AssessmentStep
  | RecordingStep
  | EchoStep
  | ClapTheBeatStep
  | PitchPracticeStep
  | BreathingExerciseStep
  | VocalExerciseStep
  | TheoryStep
  | PerformanceStep
  | ListeningStep;

// Lesson interface
export interface Lesson {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  steps: LessonStep[];
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[]; // lesson IDs
  imageUrl?: string;
}

// Unit interface
export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  theme: string; // e.g., 'breath-control', 'pitch-accuracy', 'rhythm'
  lessons: Lesson[];
  imageUrl?: string;
  color?: string; // theme color for the unit
}

// Skill Assessment interface
export interface SkillAssessment {
  id: string;
  title: string;
  description: string;
  targetAge?: string; // e.g., '4-6 years'
  units: Unit[];
  totalPoints: number;
  certificateUrl?: string; // completion certificate template
}

// Progress tracking
export interface LessonStepProgress {
  stepId: string;
  completed: boolean;
  score?: number;
  attempts: number;
  bestScore?: number;
  completedAt?: Date;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  started: boolean;
  completed: boolean;
  stepProgress: LessonStepProgress[];
  totalScore: number;
  completedAt?: Date;
}

export interface UnitProgress {
  unitId: string;
  userId: string;
  lessonsCompleted: number;
  totalLessons: number;
  averageScore: number;
  isUnlocked: boolean;
  completedAt?: Date;
}