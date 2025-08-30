import type { Lesson } from '../models/lesson';

export const sampleLessons: Lesson[] = [
  {
    id: 'echo-introduction',
    level: 1,
    unit: 1,
    position: 1,
    title: '🔊 Echo with Kooka',
    type: 'echo',
    description: 'Listen and repeat!',
    content: JSON.stringify({
      promptText: "Koo-ka-bur-ra!",
      promptAudio: "/audio/echo_prompt.mp3",
      minVolumeThreshold: 30,
      targetDuration: 3
    }),
    imageUrl: 'kooka-singing',
    unlocked: true,
    prerequisite: undefined,
  },
  {
    id: 'breath-basics',
    level: 1,
    unit: 1,
    position: 2,
    title: '🎈 Belly Breathing',
    type: 'practice',
    description: 'Blow up your belly!',
    content: JSON.stringify({
      steps: ["Watch Kooka breathe", "Touch belly", "Breathe in = Big belly", "Breathe out = Small belly"],
      visual: "kooka-belly-animation",
      audio: "breath-guide"
    }),
    imageUrl: 'kooka-breathing',
    unlocked: false,
    prerequisite: 'echo-introduction',
  },
  {
    id: 'voice-discovery',
    level: 1,
    unit: 1,
    position: 3,
    title: '🎵 High & Low',
    type: 'sound',
    description: 'Copy the sounds!',
    content: JSON.stringify({
      steps: ["Listen to baby bird 🐣", "Listen to papa bird 🦅", "Copy each sound", "Find YOUR voice"],
      visual: "bird-family",
      audio: "pitch-examples"
    }),
    imageUrl: 'kooka-voice-range',
    unlocked: false,
    prerequisite: 'breath-basics',
  },
  {
    id: 'kooka-laugh',
    level: 1,
    unit: 1,
    position: 4,
    title: '😄 Kooka Laugh Song',
    type: 'song',
    description: 'Sing along!',
    content: JSON.stringify({
      steps: ["Watch Kooka sing", "Tap the rhythm 👏", "Copy the laugh", "Sing together!"],
      visual: "kooka-song-video",
      audio: "kookaburra-song"
    }),
    imageUrl: 'kooka-singing',
    unlocked: false,
    prerequisite: 'voice-discovery',
  },
  {
    id: 'rhythm-clap',
    level: 1,
    unit: 1,
    position: 5,
    title: '👏 Clap the Beat',
    type: 'practice',
    description: 'Follow the rhythm!',
    content: JSON.stringify({
      steps: ["Watch hands clap 👏", "Copy the pattern", "Slow... then fast!", "Make your own beat"],
      visual: "clapping-animation",
      audio: "rhythm-patterns"
    }),
    imageUrl: 'rhythm-practice',
    unlocked: false,
    prerequisite: 'kooka-laugh',
  },
  {
    id: 'animal-sounds',
    level: 1,
    unit: 1,
    position: 6,
    title: '🐱 Animal Voices',
    type: 'sound',
    description: 'Be the animals!',
    content: JSON.stringify({
      steps: ["Cat goes MEOW (high)", "Dog goes WOOF (middle)", "Cow goes MOO (low)", "Mix them up!"],
      visual: "animal-parade",
      audio: "animal-sounds"
    }),
    imageUrl: 'animal-voices',
    unlocked: false,
    prerequisite: 'rhythm-clap',
  },
  {
    id: 'echo-game',
    level: 1,
    unit: 1,
    position: 7,
    title: '🔊 Echo Echo',
    type: 'practice',
    description: 'Copy me!',
    content: JSON.stringify({
      steps: ["Listen carefully", "Wait... wait...", "Now copy!", "Perfect match?"],
      visual: "echo-visualization",
      audio: "echo-patterns"
    }),
    imageUrl: 'echo-practice',
    unlocked: false,
    prerequisite: 'animal-sounds',
  },
];

export function getLessonsByUnit(unit: number): Lesson[] {
  return sampleLessons
    .filter(l => l.unit === unit)
    .sort((a, b) => a.position - b.position);
}

export function getLessonById(id: string): Lesson | undefined {
  return sampleLessons.find(l => l.id === id);
}

export function isLessonUnlocked(id: string, completed: string[]): boolean {
  const lesson = getLessonById(id);
  if (!lesson) return false;
  if (lesson.unlocked) return true;
  if (!lesson.prerequisite) return true;
  return completed.includes(lesson.prerequisite);
}

export interface UnitInfo {
  unit: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export function getAllUnits(): UnitInfo[] {
  const units: Array<[number, string, string]> = [
    [1, '🎤 Start Singing!', 'Learn with Kooka'],
  ];
  
  return units.map(([unit, title, description]) => ({
    unit,
    title,
    description,
    lessons: getLessonsByUnit(unit)
  }));
}