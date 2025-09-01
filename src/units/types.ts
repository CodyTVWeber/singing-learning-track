import type { ReactNode } from 'react';

export type LessonKind = 'sound' | 'song' | 'practice' | 'echo';

export interface LessonDescriptor {
  id: string;
  level: number;
  unit: number;
  position: number;
  title: string;
  type: LessonKind;
  description: string;
  imageUrl?: string;
  unlocked?: boolean;
  prerequisite?: string;
  /**
   * Steps renderer: returns an ordered list of step components to render.
   */
  renderSteps: () => ReactNode[];
}

export interface UnitDescriptor {
  unit: number;
  title: string;
  description: string;
  lessons: LessonDescriptor[];
}

