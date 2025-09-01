import type { Lesson } from '../models/lesson';
import type { LessonStep, LessonContent, EchoLessonContent } from '../models/lesson';
import { sampleLessons } from '../data/units';

export interface LessonDescriptorFromLegacy {
  id: string;
  level: number;
  unit: number;
  position: number;
  title: string;
  type: 'sound' | 'song' | 'practice' | 'echo';
  description: string;
  imageUrl?: string;
  unlocked?: boolean;
  prerequisite?: string;
  steps: LessonStep[];
}

export interface UnitDescriptorFromLegacy {
  unit: number;
  title?: string;
  description?: string;
  lessons: LessonDescriptorFromLegacy[];
}

function toStepsFromLegacy(lesson: Lesson): LessonStep[] {
  try {
    const parsed = lesson.content ? JSON.parse(lesson.content) : null;
    if (!parsed) return [];
    if (lesson.type === 'echo') {
      const ec = parsed as EchoLessonContent;
      return [
        {
          type: 'echo',
          promptText: ec.promptText,
          promptAudio: ec.promptAudio,
          minVolumeThreshold: (ec as any).minVolumeThreshold,
          targetDuration: (ec as any).targetDuration,
        } as LessonStep,
      ];
    }
    const rc = parsed as LessonContent;
    const stepsArray: LessonStep[] = Array.isArray(rc.steps)
      ? rc.steps.map((s) => ({ type: 'text', content: String(s) } as LessonStep))
      : [];
    if ((parsed as any).audio) {
      stepsArray.push({ type: 'audio', audioId: (parsed as any).audio } as LessonStep);
    }
    return stepsArray;
  } catch {
    return [];
  }
}

export const unitsRegistryFromLegacy: UnitDescriptorFromLegacy[] = (() => {
  const byUnit = new Map<number, LessonDescriptorFromLegacy[]>();
  for (const l of sampleLessons) {
    const arr = byUnit.get(l.unit) ?? [];
    arr.push({
      id: l.id,
      level: l.level,
      unit: l.unit,
      position: l.position,
      title: l.title,
      type: l.type,
      description: l.description,
      imageUrl: l.imageUrl,
      unlocked: l.unlocked,
      prerequisite: l.prerequisite,
      steps: toStepsFromLegacy(l),
    });
    byUnit.set(l.unit, arr);
  }
  return Array.from(byUnit.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([unit, lessons]) => ({ unit, lessons: lessons.sort((a, b) => a.position - b.position) }));
})();

export function findLessonDescriptorByIdFromLegacy(id: string): LessonDescriptorFromLegacy | undefined {
  for (const u of unitsRegistryFromLegacy) {
    const found = u.lessons.find((l) => l.id === id);
    if (found) return found;
  }
  return undefined;
}

