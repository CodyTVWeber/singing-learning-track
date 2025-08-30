import type { Lesson } from '../models/lesson';

export const sampleLessons: Lesson[] = [
  {
    id: 'echo-introduction',
    level: 1,
    unit: 1,
    position: 1,
    title: 'Echo with Kooka',
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
    title: 'Belly Breathing',
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
    title: 'High & Low',
    type: 'sound',
    description: 'Copy the sounds!',
    content: JSON.stringify({
      steps: ["Listen to baby bird", "Listen to papa bird", "Copy each sound", "Find YOUR voice"],
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
    title: 'Kooka Laugh Song',
    type: 'song',
    description: 'Sing along!',
    content: JSON.stringify({
      steps: ["Watch Kooka sing", "Tap the rhythm", "Copy the laugh", "Sing together!"],
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
    title: 'Clap the Beat',
    type: 'practice',
    description: 'Follow the rhythm!',
    content: JSON.stringify({
      steps: ["Watch hands clap", "Copy the pattern", "Slow... then fast!", "Make your own beat"],
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
    title: 'Animal Voices',
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
    title: 'Echo Echo',
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
  // --- Unit 2: Breath Control & Dynamics ---
  {
    id: 'u2-breath-book-lift',
    level: 2,
    unit: 2,
    position: 1,
    title: 'Book Lift Breathing',
    type: 'practice',
    description: 'Feel your belly lift and lower.',
    content: JSON.stringify({
      steps: [
        'Lie down and place a light book on your belly',
        'Breathe in through nose – book lifts',
        'Breathe out like blowing a candle – book lowers',
        'Repeat 5 calm breaths'
      ],
      visual: 'book-lift-animation',
      audio: 'breath-guide-soft'
    }),
    imageUrl: 'breathing-book',
    unlocked: false,
    prerequisite: 'echo-game',
  },
  {
    id: 'u2-pulse-breath',
    level: 2,
    unit: 2,
    position: 2,
    title: 'Pulse Breath Support',
    type: 'practice',
    description: 'Pff-pff-pff to strengthen your breath.',
    content: JSON.stringify({
      steps: [
        'Stand tall like a tree',
        'Inhale for 4 counts',
        'Exhale in pulses: pff-pff-pff (10 times)',
        'Relax shoulders and repeat'
      ],
      visual: 'pulse-breath',
      audio: 'breath-pulse'
    }),
    imageUrl: 'breathing-pulse',
    unlocked: false,
    prerequisite: 'u2-breath-book-lift',
  },
  {
    id: 'u2-dynamics-lion-mouse',
    level: 2,
    unit: 2,
    position: 3,
    title: 'Loud Lion, Soft Mouse',
    type: 'practice',
    description: 'Change volume while keeping control.',
    content: JSON.stringify({
      steps: [
        'Sing a simple line: la-la-la',
        'Sing loud like a lion (not shouting!)',
        'Sing soft like a mouse',
        'Switch loud/soft on parent cue'
      ],
      visual: 'lion-mouse-dynamics',
      audio: 'dynamic-examples'
    }),
    imageUrl: 'dynamics-game',
    unlocked: false,
    prerequisite: 'u2-pulse-breath',
  },
  {
    id: 'u2-posture-check',
    level: 2,
    unit: 2,
    position: 4,
    title: 'Posture: Tall Like a Tree',
    type: 'practice',
    description: 'Stand balanced for better singing.',
    content: JSON.stringify({
      steps: [
        'Feet apart, knees soft',
        'Back long, shoulders relaxed',
        'Imagine a string lifting the crown of your head',
        'Take 3 calm breaths and sing a note'
      ],
      visual: 'posture-check',
      audio: 'posture-breath'
    }),
    imageUrl: 'posture-tree',
    unlocked: false,
    prerequisite: 'u2-dynamics-lion-mouse',
  },
  {
    id: 'u2-song-you-are-my-sunshine',
    level: 2,
    unit: 2,
    position: 5,
    title: 'Song: You Are My Sunshine',
    type: 'song',
    description: 'Sing with happy and soft parts.',
    content: JSON.stringify({
      steps: [
        'Find starting note with a chime',
        'Sing verse together',
        'Try loud/soft on the chorus',
        'Perform for a family member'
      ],
      visual: 'sunshine-song',
      audio: 'you-are-my-sunshine'
    }),
    imageUrl: 'song-sunshine',
    unlocked: false,
    prerequisite: 'u2-posture-check',
  },
  {
    id: 'u2-echo-hello-sunshine',
    level: 2,
    unit: 2,
    position: 6,
    title: 'Echo: Hello Sunshine',
    type: 'echo',
    description: 'Listen, then echo the phrase.',
    content: JSON.stringify({
      promptText: 'Hel-lo Sun-shine!',
      promptAudio: '/audio/echo_prompt.mp3',
      minVolumeThreshold: 35,
      targetDuration: 3
    }),
    imageUrl: 'echo-sunshine',
    unlocked: false,
    prerequisite: 'u2-song-you-are-my-sunshine',
  },

  // --- Unit 3: Pitch & Articulation ---
  {
    id: 'u3-tongue-twisters',
    level: 3,
    unit: 3,
    position: 1,
    title: 'Tongue Twisters',
    type: 'practice',
    description: 'Clear words: she sells seashells.',
    content: JSON.stringify({
      steps: [
        'Say it slowly: she sells seashells',
        'Clap to the beat while speaking',
        'Sing on one pitch',
        'Speed up while staying clear'
      ],
      visual: 'twister-cards',
      audio: 'twister-guide'
    }),
    imageUrl: 'twister',
    unlocked: false,
    prerequisite: 'u2-echo-hello-sunshine',
  },
  {
    id: 'u3-vowel-scales',
    level: 3,
    unit: 3,
    position: 2,
    title: 'Vowel Scales (ah-ee-oo)',
    type: 'sound',
    description: 'Sing 5-note up and down.',
    content: JSON.stringify({
      steps: [
        'Start on a comfy note',
        'Sing ah-ee-oo up 5 notes',
        'Sing back down 5 notes',
        'Keep mouth shapes tall and round'
      ],
      visual: 'vowel-scale-stairs',
      audio: 'vowel-scale-tones'
    }),
    imageUrl: 'vowel-scales',
    unlocked: false,
    prerequisite: 'u3-tongue-twisters',
  },
  {
    id: 'u3-sustain-note-10s',
    level: 3,
    unit: 3,
    position: 3,
    title: 'Hold a Note (10s)',
    type: 'practice',
    description: 'Steady breath on one pitch.',
    content: JSON.stringify({
      steps: [
        'Breathe in for 4 counts',
        'Sing “ah” for 10 seconds',
        'Keep volume steady',
        'Repeat 5 times with rest'
      ],
      visual: 'sustain-bar',
      audio: 'sustain-tone'
    }),
    imageUrl: 'sustain',
    unlocked: false,
    prerequisite: 'u3-vowel-scales',
  },
  {
    id: 'u3-pitch-match-game',
    level: 3,
    unit: 3,
    position: 4,
    title: 'Pitch Match Game',
    type: 'sound',
    description: 'Same or different notes?',
    content: JSON.stringify({
      steps: [
        'Listen to two notes',
        'Are they the same or different?',
        'Try to sing the first note',
        'Check with a piano app'
      ],
      visual: 'same-different-cards',
      audio: 'piano-intervals'
    }),
    imageUrl: 'pitch-game',
    unlocked: false,
    prerequisite: 'u3-sustain-note-10s',
  },
  {
    id: 'u3-song-do-re-mi',
    level: 3,
    unit: 3,
    position: 5,
    title: 'Song: Do-Re-Mi (simple)',
    type: 'song',
    description: 'Sing the first phrases with actions.',
    content: JSON.stringify({
      steps: [
        'Learn do-re-mi actions',
        'Sing first phrase slowly',
        'Add the second phrase',
        'Perform with actions'
      ],
      visual: 'do-re-mi-actions',
      audio: 'do-re-mi-simple'
    }),
    imageUrl: 'do-re-mi',
    unlocked: false,
    prerequisite: 'u3-pitch-match-game',
  },

  // --- Unit 4: Echo & Performance ---
  {
    id: 'u4-echo-intervals',
    level: 4,
    unit: 4,
    position: 1,
    title: 'Echo: Up and Down',
    type: 'echo',
    description: 'Echo short up/down patterns.',
    content: JSON.stringify({
      promptText: 'LA-la (up), la-LA (down)',
      promptAudio: '/audio/echo_prompt.mp3',
      minVolumeThreshold: 40,
      targetDuration: 3
    }),
    imageUrl: 'echo-intervals',
    unlocked: false,
    prerequisite: 'u3-song-do-re-mi',
  },
  {
    id: 'u4-rhythm-sticks',
    level: 4,
    unit: 4,
    position: 2,
    title: 'Rhythm Sticks',
    type: 'practice',
    description: 'Tap steady beats and patterns.',
    content: JSON.stringify({
      steps: [
        'Tap 4 steady beats',
        'Tap ta-ta-ti-ti-ta',
        'Tap fast then slow',
        'Make your own pattern'
      ],
      visual: 'rhythm-sticks',
      audio: 'rhythm-patterns-advanced'
    }),
    imageUrl: 'rhythm-sticks',
    unlocked: false,
    prerequisite: 'u4-echo-intervals',
  },
  {
    id: 'u4-articulation-pop',
    level: 4,
    unit: 4,
    position: 3,
    title: 'Pop the Consonants',
    type: 'practice',
    description: 'Crisp consonants in a song.',
    content: JSON.stringify({
      steps: [
        'Practice p-b-t-d on one note',
        'Sing a line with extra clear words',
        'Record and listen back',
        'Try a little faster'
      ],
      visual: 'consonant-pop',
      audio: 'articulation-examples'
    }),
    imageUrl: 'articulation',
    unlocked: false,
    prerequisite: 'u4-rhythm-sticks',
  },
  {
    id: 'u4-song-how-great',
    level: 4,
    unit: 4,
    position: 4,
    title: 'Hymn: How Great Thou Art (simple)',
    type: 'song',
    description: 'Sing a simple hymn verse with feeling.',
    content: JSON.stringify({
      steps: [
        'Listen to a simple verse',
        'Sing softly with steady breath',
        'Add louder feeling on the chorus',
        'Perform for family or a friend'
      ],
      visual: 'hymn-simple',
      audio: 'how-great-simple'
    }),
    imageUrl: 'hymn',
    unlocked: false,
    prerequisite: 'u4-articulation-pop',
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
    [1, 'Start Singing!', 'Discover your voice with Kooka'],
    [2, 'Breath & Dynamics', 'Stronger breath, posture, and volume control'],
    [3, 'Pitch & Articulation', 'Hit notes and sing words clearly'],
    [4, 'Echo & Performance', 'Echo patterns and perform simple songs'],
  ];
  
  return units.map(([unit, title, description]) => ({
    unit,
    title,
    description,
    lessons: getLessonsByUnit(unit)
  }));
}