export interface Lesson {
  id: string;
  level: number;
  title: string;
  type: 'sound' | 'song' | 'practice' | 'echo';
  /**
   * Deprecated: legacy JSON content. Prefer using typed `steps` below.
   */
  content?: string;
  description: string;
  imageUrl?: string;
  unlocked: boolean;
  prerequisite?: string;
  unit: number;
  position: number;
  /**
   * New: strongly-typed lesson steps. When present, the lesson page renders these.
   */
  steps?: LessonStep[];
}

export interface LessonContent {
  steps: string[];
  visual: string;
  audio: string;
}

export interface EchoLessonContent {
  promptText: string;
  promptAudio: string;
  minVolumeThreshold: number;
  targetDuration: number;
}

// ---- New Typed Step Models ----

export type LessonStepType =
  | 'text'
  | 'audio'
  | 'tips'
  | 'pitchPractice'
  | 'echo'
  | 'recording'
  | 'clapBeat';

interface LessonStepBase {
  type: LessonStepType;
  id?: string;
  title?: string;
}

export interface TextStep extends LessonStepBase {
  type: 'text';
  content: string;
}

export interface AudioStep extends LessonStepBase {
  type: 'audio';
  audioId: string;
  description?: string;
}

export interface TipsStep extends LessonStepBase {
  type: 'tips';
  tips: string[];
}

export interface PitchPracticeStep extends LessonStepBase {
  type: 'pitchPractice';
  audioId?: string;
  targetHz?: number;
}

export interface EchoStep extends LessonStepBase {
  type: 'echo';
  promptText: string;
  promptAudio: string;
  minVolumeThreshold?: number;
  targetDuration?: number;
}

export interface RecordingStep extends LessonStepBase {
  type: 'recording';
  promptText: string;
  maxDurationSec?: number;
}

export interface ClapBeatStep extends LessonStepBase {
  type: 'clapBeat';
  /** A simple pattern identifier or description */
  pattern: string;
}

export type LessonStep =
  | TextStep
  | AudioStep
  | TipsStep
  | PitchPracticeStep
  | EchoStep
  | RecordingStep
  | ClapBeatStep;