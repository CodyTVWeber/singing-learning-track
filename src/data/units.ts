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
  
  // --- Unit 5: Resonance & Tone ---
  {
    id: 'u5-resonance-hum',
    level: 5,
    unit: 5,
    position: 1,
    title: 'Humming for Resonance',
    type: 'practice',
    description: 'Feel vibrations in lips and nose for a warm tone.',
    content: JSON.stringify({
      steps: [
        'Gently hum on “mmmmm”',
        'Feel buzz on lips and nose',
        'Slide up then down smoothly',
        'Keep shoulders relaxed'
      ],
      visual: 'hum-resonance',
      audio: 'hum-tone'
    }),
    imageUrl: 'resonance-hum',
    unlocked: false,
    prerequisite: 'u4-song-how-great',
  },
  {
    id: 'u5-tone-hoot',
    level: 5,
    unit: 5,
    position: 2,
    title: 'Ooh vs Ah Tone',
    type: 'sound',
    description: 'Shape tall “ooh” and open “ah” vowels.',
    content: JSON.stringify({
      steps: [
        'Say and sing “ooh” tall and round',
        'Open to “ah” without losing height',
        'Switch between ooh/ah slowly',
        'Keep tone smooth'
      ],
      visual: 'ooh-ah-shapes',
      audio: 'vowel-tones'
    }),
    imageUrl: 'tone-vowels',
    unlocked: false,
    prerequisite: 'u5-resonance-hum',
  },
  {
    id: 'u5-song-twinkle-bright',
    level: 5,
    unit: 5,
    position: 3,
    title: 'Song: Twinkle (bright tone)',
    type: 'song',
    description: 'Sing with a bright, ringing sound.',
    content: JSON.stringify({
      steps: [
        'Hum the melody softly',
        'Switch to words with bright tone',
        'Keep vowels tall',
        'Perform the first verse'
      ],
      visual: 'twinkle-bright',
      audio: 'twinkle-bright-tone'
    }),
    imageUrl: 'song-twinkle',
    unlocked: false,
    prerequisite: 'u5-tone-hoot',
  },

  // --- Unit 6: Range & Control ---
  {
    id: 'u6-lip-trills',
    level: 6,
    unit: 6,
    position: 1,
    title: 'Lip Trills',
    type: 'practice',
    description: 'Gentle lip trills to stretch range.',
    content: JSON.stringify({
      steps: [
        'Relax lips for brrrr',
        'Glide from low to high',
        'Glide back down softly',
        'Repeat 3 times with rest'
      ],
      visual: 'lip-trills',
      audio: 'lip-trill-guide'
    }),
    imageUrl: 'lip-trills',
    unlocked: false,
    prerequisite: 'u5-song-twinkle-bright',
  },
  {
    id: 'u6-range-slide',
    level: 6,
    unit: 6,
    position: 2,
    title: 'Slide Low to High',
    type: 'sound',
    description: 'Sirens to connect the range.',
    content: JSON.stringify({
      steps: [
        'Start comfortably low',
        'Slide up on “oo” like a siren',
        'Slide down smoothly',
        'Keep volume even'
      ],
      visual: 'range-siren',
      audio: 'siren-tones'
    }),
    imageUrl: 'range-slide',
    unlocked: false,
    prerequisite: 'u6-lip-trills',
  },
  {
    id: 'u6-song-rainbow',
    level: 6,
    unit: 6,
    position: 3,
    title: 'Song: Over the Rainbow (first line)',
    type: 'song',
    description: 'Sing a gentle leap with control.',
    content: JSON.stringify({
      steps: [
        'Listen to the starting pitch',
        'Sing the first line slowly',
        'Keep vowels tall and connected',
        'Repeat with a smile'
      ],
      visual: 'rainbow-first-line',
      audio: 'rainbow-first-line'
    }),
    imageUrl: 'song-rainbow',
    unlocked: false,
    prerequisite: 'u6-range-slide',
  },

  // --- Unit 7: Rhythm & Phrasing ---
  {
    id: 'u7-speak-rhythm',
    level: 7,
    unit: 7,
    position: 1,
    title: 'Speak the Rhythm',
    type: 'practice',
    description: 'Say then sing short rhythm patterns.',
    content: JSON.stringify({
      steps: [
        'Clap ta ta ti-ti ta',
        'Speak the pattern clearly',
        'Sing on one note',
        'Try two different patterns'
      ],
      visual: 'speak-rhythm',
      audio: 'rhythm-speak'
    }),
    imageUrl: 'speak-rhythm',
    unlocked: false,
    prerequisite: 'u6-song-rainbow',
  },
  {
    id: 'u7-phrase-breaths',
    level: 7,
    unit: 7,
    position: 2,
    title: 'Breaths Between Phrases',
    type: 'practice',
    description: 'Plan quick breaths for smooth singing.',
    content: JSON.stringify({
      steps: [
        'Mark breath spots (/) in a line',
        'Sing and breathe at marks',
        'Keep shoulders relaxed',
        'Try without marks'
      ],
      visual: 'phrase-breath',
      audio: 'phrase-guide'
    }),
    imageUrl: 'phrase-breaths',
    unlocked: false,
    prerequisite: 'u7-speak-rhythm',
  },
  {
    id: 'u7-song-rowboat',
    level: 7,
    unit: 7,
    position: 3,
    title: 'Song: Row Your Boat',
    type: 'song',
    description: 'Sing with steady beat and clean phrases.',
    content: JSON.stringify({
      steps: [
        'Clap the beat while singing',
        'Add quick breaths at ends',
        'Keep words crisp',
        'Perform for a friend'
      ],
      visual: 'rowboat',
      audio: 'rowboat-simple'
    }),
    imageUrl: 'song-rowboat',
    unlocked: false,
    prerequisite: 'u7-phrase-breaths',
  },

  // --- Unit 8: Ear Training I ---
  {
    id: 'u8-interval-steps',
    level: 8,
    unit: 8,
    position: 1,
    title: 'Steps vs Skips',
    type: 'sound',
    description: 'Hear and sing steps and simple skips.',
    content: JSON.stringify({
      steps: [
        'Listen: step up/down',
        'Listen: skip up/down',
        'Sing back each pattern',
        'Name step or skip'
      ],
      visual: 'steps-skips',
      audio: 'interval-examples'
    }),
    imageUrl: 'interval-steps',
    unlocked: false,
    prerequisite: 'u7-song-rowboat',
  },
  {
    id: 'u8-call-response',
    level: 8,
    unit: 8,
    position: 2,
    title: 'Echo: Call and Response',
    type: 'echo',
    description: 'Echo short 2–3 note patterns.',
    content: JSON.stringify({
      promptText: 'la-la, la-la-la',
      promptAudio: '/audio/echo_prompt.mp3',
      minVolumeThreshold: 40,
      targetDuration: 3
    }),
    imageUrl: 'echo-call-response',
    unlocked: false,
    prerequisite: 'u8-interval-steps',
  },
  {
    id: 'u8-song-mary',
    level: 8,
    unit: 8,
    position: 3,
    title: 'Song: Mary Had a Little Lamb',
    type: 'song',
    description: 'Steps practice in a familiar tune.',
    content: JSON.stringify({
      steps: [
        'Sing slowly using steps',
        'Keep tone gentle',
        'Add light dynamics',
        'Perform first verse'
      ],
      visual: 'mary-lamb',
      audio: 'mary-lamb-simple'
    }),
    imageUrl: 'song-mary',
    unlocked: false,
    prerequisite: 'u8-call-response',
  },

  // --- Unit 9: Vowels & Diction ---
  {
    id: 'u9-tall-vowels',
    level: 9,
    unit: 9,
    position: 1,
    title: 'Tall Vowels',
    type: 'sound',
    description: 'Keep vowel shapes tall and round.',
    content: JSON.stringify({
      steps: [
        'Mirror tall “ah” shape',
        'Try “ee” and “oo” without spreading',
        'Sing a 5-note scale',
        'Keep jaw relaxed'
      ],
      visual: 'vowel-tall',
      audio: 'vowel-shapes'
    }),
    imageUrl: 'tall-vowels',
    unlocked: false,
    prerequisite: 'u8-song-mary',
  },
  {
    id: 'u9-consonant-clean',
    level: 9,
    unit: 9,
    position: 2,
    title: 'Clean Consonants',
    type: 'practice',
    description: 'Pop consonants without pushing.',
    content: JSON.stringify({
      steps: [
        'Practice p-b-t-d lightly',
        'Say then sing a tongue twister',
        'Keep vowels tall between',
        'Record and listen back'
      ],
      visual: 'consonant-clean',
      audio: 'consonant-drills'
    }),
    imageUrl: 'clean-consonants',
    unlocked: false,
    prerequisite: 'u9-tall-vowels',
  },
  {
    id: 'u9-song-old-mac',
    level: 9,
    unit: 9,
    position: 3,
    title: 'Song: Old MacDonald (clear words)',
    type: 'song',
    description: 'Sing with tall vowels and crisp words.',
    content: JSON.stringify({
      steps: [
        'Sing slowly and clearly',
        'Keep vowels tall',
        'Pop consonants gently',
        'Perform the chorus'
      ],
      visual: 'old-macdonald',
      audio: 'old-mac-simple'
    }),
    imageUrl: 'song-old-mac',
    unlocked: false,
    prerequisite: 'u9-consonant-clean',
  },

  // --- Unit 10: Breath Endurance ---
  {
    id: 'u10-long-tone-15s',
    level: 10,
    unit: 10,
    position: 1,
    title: 'Hold a Note (15s)',
    type: 'practice',
    description: 'Steady breath for a longer tone.',
    content: JSON.stringify({
      steps: [
        'Breathe in for 4 counts',
        'Sing “ah” for up to 15s',
        'Keep volume steady',
        'Rest and repeat'
      ],
      visual: 'long-tone',
      audio: 'long-tone-15s'
    }),
    imageUrl: 'long-tone-15',
    unlocked: false,
    prerequisite: 'u9-song-old-mac',
  },
  {
    id: 'u10-dynamic-swell',
    level: 10,
    unit: 10,
    position: 2,
    title: 'Crescendo & Decrescendo',
    type: 'practice',
    description: 'Grow and shrink sound smoothly.',
    content: JSON.stringify({
      steps: [
        'Start soft on one note',
        'Grow louder for 4 counts',
        'Shrink softer for 4 counts',
        'Keep pitch steady'
      ],
      visual: 'dynamic-swell',
      audio: 'crescendo-decrescendo'
    }),
    imageUrl: 'dynamic-swell',
    unlocked: false,
    prerequisite: 'u10-long-tone-15s',
  },
  {
    id: 'u10-song-when-saints',
    level: 10,
    unit: 10,
    position: 3,
    title: 'Song: When the Saints',
    type: 'song',
    description: 'Apply steady breath in a melody.',
    content: JSON.stringify({
      steps: [
        'Sing the melody slowly',
        'Plan breaths at phrase ends',
        'Keep tone even',
        'Perform first verse'
      ],
      visual: 'when-the-saints',
      audio: 'saints-simple'
    }),
    imageUrl: 'song-saints',
    unlocked: false,
    prerequisite: 'u10-dynamic-swell',
  },

  // --- Unit 11: Harmony Basics ---
  {
    id: 'u11-sing-drone',
    level: 11,
    unit: 11,
    position: 1,
    title: 'Sing with a Drone',
    type: 'sound',
    description: 'Hold a note while a drone plays.',
    content: JSON.stringify({
      steps: [
        'Listen to a steady drone',
        'Match the pitch gently',
        'Hold for 8–10 seconds',
        'Repeat on new pitches'
      ],
      visual: 'drone-note',
      audio: 'drone-tones'
    }),
    imageUrl: 'sing-drone',
    unlocked: false,
    prerequisite: 'u10-song-when-saints',
  },
  {
    id: 'u11-two-note-harmony',
    level: 11,
    unit: 11,
    position: 2,
    title: 'Two-Note Harmony',
    type: 'sound',
    description: 'Practice simple 3rd above or below.',
    content: JSON.stringify({
      steps: [
        'Listen: melody plus harmony',
        'Try singing the harmony note',
        'Switch parts with a buddy',
        'Stay steady'
      ],
      visual: 'two-note-harmony',
      audio: 'harmony-thirds'
    }),
    imageUrl: 'two-note-harmony',
    unlocked: false,
    prerequisite: 'u11-sing-drone',
  },
  {
    id: 'u11-song-round',
    level: 11,
    unit: 11,
    position: 3,
    title: 'Song: Are You Sleeping (round)',
    type: 'song',
    description: 'Try a simple round with a partner.',
    content: JSON.stringify({
      steps: [
        'Sing the melody together',
        'Start the round after one phrase',
        'Keep tempo steady',
        'Switch parts'
      ],
      visual: 'round-song',
      audio: 'are-you-sleeping-round'
    }),
    imageUrl: 'song-round',
    unlocked: false,
    prerequisite: 'u11-two-note-harmony',
  },

  // --- Unit 12: Expression II ---
  {
    id: 'u12-contrast',
    level: 12,
    unit: 12,
    position: 1,
    title: 'Contrast: Loud and Soft',
    type: 'practice',
    description: 'Switch dynamics without changing pitch.',
    content: JSON.stringify({
      steps: [
        'Sing “la” softly then loudly',
        'Keep pitch steady',
        'Apply to a short line',
        'Repeat with control'
      ],
      visual: 'contrast-dynamics',
      audio: 'contrast-examples'
    }),
    imageUrl: 'contrast',
    unlocked: false,
    prerequisite: 'u11-song-round',
  },
  {
    id: 'u12-text-painting',
    level: 12,
    unit: 12,
    position: 2,
    title: 'Express the Words',
    type: 'practice',
    description: 'Shape sound to match the lyrics.',
    content: JSON.stringify({
      steps: [
        'Speak a line with feeling',
        'Sing it with the same feeling',
        'Change loud/soft to match words',
        'Perform for someone'
      ],
      visual: 'text-painting',
      audio: 'expression-guide'
    }),
    imageUrl: 'text-painting',
    unlocked: false,
    prerequisite: 'u12-contrast',
  },
  {
    id: 'u12-song-amazing-grace',
    level: 12,
    unit: 12,
    position: 3,
    title: 'Song: Amazing Grace (simple)',
    type: 'song',
    description: 'Sing with gentle expression.',
    content: JSON.stringify({
      steps: [
        'Sing softly first',
        'Add small swells',
        'Keep words clear',
        'Share with family'
      ],
      visual: 'amazing-grace',
      audio: 'amazing-grace-simple'
    }),
    imageUrl: 'song-amazing-grace',
    unlocked: false,
    prerequisite: 'u12-text-painting',
  },

  // --- Unit 13: Tempo & Control II ---
  {
    id: 'u13-metronome-keep',
    level: 13,
    unit: 13,
    position: 1,
    title: 'Keep the Tempo',
    type: 'practice',
    description: 'Practice with a simple metronome.',
    content: JSON.stringify({
      steps: [
        'Clap with the metronome',
        'Speak then sing a line',
        'Stay with the click',
        'Stop and restart cleanly'
      ],
      visual: 'metronome-basic',
      audio: 'metronome-60bpm'
    }),
    imageUrl: 'metronome',
    unlocked: false,
    prerequisite: 'u12-song-amazing-grace',
  },
  {
    id: 'u13-accel-ritard',
    level: 13,
    unit: 13,
    position: 2,
    title: 'Faster and Slower',
    type: 'practice',
    description: 'Feel accelerando and ritardando.',
    content: JSON.stringify({
      steps: [
        'Sing a line getting faster',
        'Sing a line slowing down',
        'Stay controlled',
        'End together with a clap'
      ],
      visual: 'tempo-change',
      audio: 'tempo-examples'
    }),
    imageUrl: 'tempo-change',
    unlocked: false,
    prerequisite: 'u13-metronome-keep',
  },
  {
    id: 'u13-song-light-of-mine',
    level: 13,
    unit: 13,
    position: 3,
    title: 'Song: This Little Light of Mine',
    type: 'song',
    description: 'Keep tempo and shape phrases.',
    content: JSON.stringify({
      steps: [
        'Clap steady while singing',
        'Breathe at phrase ends',
        'Stay energetic',
        'Perform the chorus'
      ],
      visual: 'light-of-mine',
      audio: 'light-of-mine-simple'
    }),
    imageUrl: 'song-light-of-mine',
    unlocked: false,
    prerequisite: 'u13-accel-ritard',
  },

  // --- Unit 14: Performance Basics ---
  {
    id: 'u14-intro-bow',
    level: 14,
    unit: 14,
    position: 1,
    title: 'Start and Bow',
    type: 'practice',
    description: 'Practice confident starts and bows.',
    content: JSON.stringify({
      steps: [
        'Stand tall and smile',
        'Count in 1-2-3',
        'Sing one line',
        'Bow and say thank you'
      ],
      visual: 'start-bow',
      audio: 'stage-start'
    }),
    imageUrl: 'start-bow',
    unlocked: false,
    prerequisite: 'u13-song-light-of-mine',
  },
  {
    id: 'u14-eye-contact',
    level: 14,
    unit: 14,
    position: 2,
    title: 'Confident Posture',
    type: 'practice',
    description: 'Eye contact and open body language.',
    content: JSON.stringify({
      steps: [
        'Stand tall like a tree',
        'Relax shoulders and jaw',
        'Look above the audience',
        'Smile and breathe'
      ],
      visual: 'stage-posture',
      audio: 'confidence-cues'
    }),
    imageUrl: 'confident-posture',
    unlocked: false,
    prerequisite: 'u14-intro-bow',
  },
  {
    id: 'u14-song-performance',
    level: 14,
    unit: 14,
    position: 3,
    title: 'Song: Perform a Favorite',
    type: 'song',
    description: 'Put it together in a short performance.',
    content: JSON.stringify({
      steps: [
        'Choose a short song',
        'Count in and sing',
        'Bow at the end',
        'Ask for a high five'
      ],
      visual: 'mini-performance',
      audio: 'performance-demo'
    }),
    imageUrl: 'song-performance',
    unlocked: false,
    prerequisite: 'u14-eye-contact',
  },

  // --- Unit 15: Pitch Accuracy II ---
  {
    id: 'u15-tune-single',
    level: 15,
    unit: 15,
    position: 1,
    title: 'Tune to a Piano',
    type: 'sound',
    description: 'Match single notes accurately.',
    content: JSON.stringify({
      steps: [
        'Listen to a piano note',
        'Sing and adjust slowly',
        'Hold when it matches',
        'Try new notes'
      ],
      visual: 'piano-match',
      audio: 'piano-notes'
    }),
    imageUrl: 'piano-tune',
    unlocked: false,
    prerequisite: 'u14-song-performance',
  },
  {
    id: 'u15-scale-solfa',
    level: 15,
    unit: 15,
    position: 2,
    title: 'Scale with Solfa',
    type: 'sound',
    description: 'Do re mi scale up and down.',
    content: JSON.stringify({
      steps: [
        'Do re mi fa so la ti do',
        'Back down slowly',
        'Keep intonation steady',
        'Use hand signs if you know them'
      ],
      visual: 'solfa-scale',
      audio: 'solfege-scale'
    }),
    imageUrl: 'solfa-scale',
    unlocked: false,
    prerequisite: 'u15-tune-single',
  },
  {
    id: 'u15-song-ode-joy',
    level: 15,
    unit: 15,
    position: 3,
    title: 'Song: Ode to Joy (melody)',
    type: 'song',
    description: 'Sing a simple classical melody in tune.',
    content: JSON.stringify({
      steps: [
        'Listen to the tune',
        'Sing slowly and accurately',
        'Add light dynamics',
        'Share your melody'
      ],
      visual: 'ode-to-joy',
      audio: 'ode-to-joy-simple'
    }),
    imageUrl: 'song-ode-joy',
    unlocked: false,
    prerequisite: 'u15-scale-solfa',
  },

  // --- Unit 16: Style & Echo ---
  {
    id: 'u16-style-staccato-legato',
    level: 16,
    unit: 16,
    position: 1,
    title: 'Staccato vs Legato',
    type: 'sound',
    description: 'Short detached vs smooth connected.',
    content: JSON.stringify({
      steps: [
        'Sing short short short',
        'Sing smooth smooth smooth',
        'Alternate styles',
        'Apply to a simple line'
      ],
      visual: 'style-compare',
      audio: 'staccato-legato'
    }),
    imageUrl: 'style-staccato-legato',
    unlocked: false,
    prerequisite: 'u15-song-ode-joy',
  },
  {
    id: 'u16-echo-styles',
    level: 16,
    unit: 16,
    position: 2,
    title: 'Echo in Styles',
    type: 'echo',
    description: 'Echo short lines in different styles.',
    content: JSON.stringify({
      promptText: 'la-la (short) / laaaa (smooth)',
      promptAudio: '/audio/echo_prompt.mp3',
      minVolumeThreshold: 42,
      targetDuration: 3
    }),
    imageUrl: 'echo-styles',
    unlocked: false,
    prerequisite: 'u16-style-staccato-legato',
  },
  {
    id: 'u16-song-happy-birthday',
    level: 16,
    unit: 16,
    position: 3,
    title: 'Song: Happy Birthday (style)',
    type: 'song',
    description: 'Try smooth phrases with clear words.',
    content: JSON.stringify({
      steps: [
        'Sing calmly and clearly',
        'Keep tempo steady',
        'Shape the ending nicely',
        'Perform for someone special'
      ],
      visual: 'happy-birthday',
      audio: 'happy-birthday-simple'
    }),
    imageUrl: 'song-happy-birthday',
    unlocked: false,
    prerequisite: 'u16-echo-styles',
  },

  // --- Unit 17: Articulation II ---
  {
    id: 'u17-tongue-control',
    level: 17,
    unit: 17,
    position: 1,
    title: 'Tongue Control',
    type: 'practice',
    description: 'Light and quick tongue movements.',
    content: JSON.stringify({
      steps: [
        'La la la on one note',
        'Ta ka ta ka softly',
        'Keep jaw relaxed',
        'Stay on pitch'
      ],
      visual: 'tongue-control',
      audio: 'tongue-exercises'
    }),
    imageUrl: 'tongue-control',
    unlocked: false,
    prerequisite: 'u16-song-happy-birthday',
  },
  {
    id: 'u17-consonant-triplets',
    level: 17,
    unit: 17,
    position: 2,
    title: 'Consonant Triplets',
    type: 'practice',
    description: 'Group consonants cleanly in rhythm.',
    content: JSON.stringify({
      steps: [
        'p-t-k triplets on a beat',
        'Add simple words',
        'Increase speed a little',
        'Stay relaxed'
      ],
      visual: 'consonant-triplets',
      audio: 'triplet-examples'
    }),
    imageUrl: 'consonant-triplets',
    unlocked: false,
    prerequisite: 'u17-tongue-control',
  },
  {
    id: 'u17-song-wheels',
    level: 17,
    unit: 17,
    position: 3,
    title: 'Song: Wheels on the Bus (clear words)',
    type: 'song',
    description: 'Articulate consonants while singing.',
    content: JSON.stringify({
      steps: [
        'Practice words slowly',
        'Sing with clear consonants',
        'Keep vowels tall',
        'Perform one verse'
      ],
      visual: 'wheels-on-bus',
      audio: 'wheels-clear-words'
    }),
    imageUrl: 'song-wheels',
    unlocked: false,
    prerequisite: 'u17-consonant-triplets',
  },

  // --- Unit 18: Resonance II ---
  {
    id: 'u18-nasal-balance',
    level: 18,
    unit: 18,
    position: 1,
    title: 'Nasal vs Open',
    type: 'sound',
    description: 'Find a balanced, open resonance.',
    content: JSON.stringify({
      steps: [
        'Exaggerate nasal “ng”',
        'Open to “ah” balanced',
        'Alternate gently',
        'Keep airflow steady'
      ],
      visual: 'nasal-balance',
      audio: 'nasal-open-examples'
    }),
    imageUrl: 'nasal-balance',
    unlocked: false,
    prerequisite: 'u17-song-wheels',
  },
  {
    id: 'u18-yawn-sigh',
    level: 18,
    unit: 18,
    position: 2,
    title: 'Yawn-Sigh Resonance',
    type: 'sound',
    description: 'Relax and open with a yawn-sigh.',
    content: JSON.stringify({
      steps: [
        'Silent yawn to open throat',
        'Sigh down gently on “ah”',
        'Keep shoulders soft',
        'Repeat 3 times'
      ],
      visual: 'yawn-sigh',
      audio: 'yawn-sigh-guide'
    }),
    imageUrl: 'yawn-sigh',
    unlocked: false,
    prerequisite: 'u18-nasal-balance',
  },
  {
    id: 'u18-song-silent-night',
    level: 18,
    unit: 18,
    position: 3,
    title: 'Song: Silent Night (soft tone)',
    type: 'song',
    description: 'Sing with a warm, gentle resonance.',
    content: JSON.stringify({
      steps: [
        'Hum the first phrase',
        'Sing softly with open space',
        'Keep even breath',
        'Perform with calm hands'
      ],
      visual: 'silent-night',
      audio: 'silent-night-soft'
    }),
    imageUrl: 'song-silent-night',
    unlocked: false,
    prerequisite: 'u18-yawn-sigh',
  },

  // --- Unit 19: Harmony II ---
  {
    id: 'u19-sing-third',
    level: 19,
    unit: 19,
    position: 1,
    title: 'Sing a Third',
    type: 'sound',
    description: 'Hear and sing a simple third.',
    content: JSON.stringify({
      steps: [
        'Play a reference note',
        'Sing the note a 3rd above',
        'Check with piano',
        'Try a 3rd below'
      ],
      visual: 'third-interval',
      audio: 'thirds-practice'
    }),
    imageUrl: 'sing-third',
    unlocked: false,
    prerequisite: 'u18-song-silent-night',
  },
  {
    id: 'u19-round-two',
    level: 19,
    unit: 19,
    position: 2,
    title: 'Two-Part Round',
    type: 'sound',
    description: 'Practice a two-part round entry.',
    content: JSON.stringify({
      steps: [
        'Sing melody together',
        'Start part 2 one phrase later',
        'Keep balance',
        'Switch roles'
      ],
      visual: 'two-part-round',
      audio: 'round-two-parts'
    }),
    imageUrl: 'round-two',
    unlocked: false,
    prerequisite: 'u19-sing-third',
  },
  {
    id: 'u19-song-row-round',
    level: 19,
    unit: 19,
    position: 3,
    title: 'Song: Row Your Boat (round)',
    type: 'song',
    description: 'Sing a familiar round in two parts.',
    content: JSON.stringify({
      steps: [
        'Review the melody',
        'Enter the round cleanly',
        'Keep tempo steady',
        'End together'
      ],
      visual: 'row-round',
      audio: 'row-round-two'
    }),
    imageUrl: 'song-row-round',
    unlocked: false,
    prerequisite: 'u19-round-two',
  },

  // --- Unit 20: Stage Presence ---
  {
    id: 'u20-walk-on',
    level: 20,
    unit: 20,
    position: 1,
    title: 'Walk On Stage',
    type: 'practice',
    description: 'Practice relaxed entrance and exit.',
    content: JSON.stringify({
      steps: [
        'Walk on with a smile',
        'Stand tall center stage',
        'Bow and breathe',
        'Walk off calmly'
      ],
      visual: 'walk-on-stage',
      audio: 'stage-steps'
    }),
    imageUrl: 'walk-on',
    unlocked: false,
    prerequisite: 'u19-song-row-round',
  },
  {
    id: 'u20-mic-distance',
    level: 20,
    unit: 20,
    position: 2,
    title: 'Mic Distance Basics',
    type: 'practice',
    description: 'Hold a pretend mic at safe distance.',
    content: JSON.stringify({
      steps: [
        'Fist away from mouth',
        'Keep steady while singing',
        'Pull back on loud notes',
        'Return for soft parts'
      ],
      visual: 'mic-distance',
      audio: 'mic-tips'
    }),
    imageUrl: 'mic-distance',
    unlocked: false,
    prerequisite: 'u20-walk-on',
  },
  {
    id: 'u20-song-performance-choice',
    level: 20,
    unit: 20,
    position: 3,
    title: 'Song: Perform with a Smile',
    type: 'song',
    description: 'Choose a short song and perform.',
    content: JSON.stringify({
      steps: [
        'Count in confidently',
        'Sing clearly and smile',
        'Bow at the end',
        'Say thank you'
      ],
      visual: 'smile-performance',
      audio: 'performance-brief'
    }),
    imageUrl: 'song-performance-smile',
    unlocked: false,
    prerequisite: 'u20-mic-distance',
  },

  // --- Unit 21: Song Study I ---
  {
    id: 'u21-lyrics-meaning',
    level: 21,
    unit: 21,
    position: 1,
    title: 'Understand the Lyrics',
    type: 'practice',
    description: 'Talk about what the song means.',
    content: JSON.stringify({
      steps: [
        'Read the lyrics aloud',
        'Underline key words',
        'Decide on the feeling',
        'Sing with that feeling'
      ],
      visual: 'lyrics-meaning',
      audio: 'lyrics-read'
    }),
    imageUrl: 'lyrics-meaning',
    unlocked: false,
    prerequisite: 'u20-song-performance-choice',
  },
  {
    id: 'u21-phrasing-breaths',
    level: 21,
    unit: 21,
    position: 2,
    title: 'Phrasing and Breaths',
    type: 'practice',
    description: 'Plan breaths to shape phrases.',
    content: JSON.stringify({
      steps: [
        'Mark breath spots',
        'Sing and breathe at marks',
        'Keep tone even',
        'Remove marks and repeat'
      ],
      visual: 'phrasing-breaths',
      audio: 'phrasing-guide'
    }),
    imageUrl: 'phrasing-breaths',
    unlocked: false,
    prerequisite: 'u21-lyrics-meaning',
  },
  {
    id: 'u21-song-kookaburra-round',
    level: 21,
    unit: 21,
    position: 3,
    title: 'Song: Kookaburra (round)',
    type: 'song',
    description: 'Study and sing Kookaburra as a round.',
    content: JSON.stringify({
      steps: [
        'Sing the melody clearly',
        'Add a second entry',
        'Keep words crisp',
        'Finish together'
      ],
      visual: 'kookaburra-round',
      audio: 'kookaburra-round'
    }),
    imageUrl: 'song-kookaburra',
    unlocked: false,
    prerequisite: 'u21-phrasing-breaths',
  },

  // --- Unit 22: Ear Training II ---
  {
    id: 'u22-intervals-3rds-5ths',
    level: 22,
    unit: 22,
    position: 1,
    title: '3rds and 5ths',
    type: 'sound',
    description: 'Hear and sing 3rds and 5ths.',
    content: JSON.stringify({
      steps: [
        'Listen: melody then interval',
        'Sing the interval slowly',
        'Check with a tuner or piano',
        'Repeat on new notes'
      ],
      visual: 'thirds-fifths',
      audio: 'intervals-3-5'
    }),
    imageUrl: 'intervals-3-5',
    unlocked: false,
    prerequisite: 'u21-song-kookaburra-round',
  },
  {
    id: 'u22-chord-quality',
    level: 22,
    unit: 22,
    position: 2,
    title: 'Major vs Minor',
    type: 'sound',
    description: 'Feel the difference in chord quality.',
    content: JSON.stringify({
      steps: [
        'Listen: major vs minor',
        'Sing a line in major',
        'Sing it in minor',
        'Describe the feeling'
      ],
      visual: 'chord-quality',
      audio: 'major-minor-examples'
    }),
    imageUrl: 'chord-quality',
    unlocked: false,
    prerequisite: 'u22-intervals-3rds-5ths',
  },
  {
    id: 'u22-song-doremi-advanced',
    level: 22,
    unit: 22,
    position: 3,
    title: 'Song: Do-Re-Mi (more)',
    type: 'song',
    description: 'Sing further phrases with accuracy.',
    content: JSON.stringify({
      steps: [
        'Review simple version',
        'Add next phrases',
        'Keep pitch steady',
        'Perform slowly'
      ],
        visual: 'doremi-advanced',
        audio: 'do-re-mi-advanced'
    }),
    imageUrl: 'song-doremi-advanced',
    unlocked: false,
    prerequisite: 'u22-chord-quality',
  },

  // --- Unit 23: Rhythm II ---
  {
    id: 'u23-syncopation-clap',
    level: 23,
    unit: 23,
    position: 1,
    title: 'Clap Syncopation',
    type: 'practice',
    description: 'Off-beat claps to feel syncopation.',
    content: JSON.stringify({
      steps: [
        'Clap on 2 and 4',
        'Clap off-beats lightly',
        'Speak a pattern and clap',
        'Keep it relaxed'
      ],
      visual: 'syncopation-clap',
      audio: 'syncopation-examples'
    }),
    imageUrl: 'syncopation-clap',
    unlocked: false,
    prerequisite: 'u22-song-doremi-advanced',
  },
  {
    id: 'u23-rests-silence',
    level: 23,
    unit: 23,
    position: 2,
    title: 'Count the Rests',
    type: 'practice',
    description: 'Feel silence as part of rhythm.',
    content: JSON.stringify({
      steps: [
        'Clap 4 beats, rest 4 beats',
        'Sing a line with rests',
        'Stay with the count',
        'Try a new pattern'
      ],
      visual: 'count-rests',
      audio: 'rest-examples'
    }),
    imageUrl: 'count-rests',
    unlocked: false,
    prerequisite: 'u23-syncopation-clap',
  },
  {
    id: 'u23-song-engine-engine',
    level: 23,
    unit: 23,
    position: 3,
    title: 'Song: Engine Engine (pattern)',
    type: 'song',
    description: 'Clap and sing a simple chant.',
    content: JSON.stringify({
      steps: [
        'Clap the pattern',
        'Speak then sing the chant',
        'Keep rests clean',
        'Repeat faster'
      ],
      visual: 'engine-engine',
      audio: 'engine-engine-pattern'
    }),
    imageUrl: 'song-engine-engine',
    unlocked: false,
    prerequisite: 'u23-rests-silence',
  },

  // --- Unit 24: Performance II ---
  {
    id: 'u24-confidence-routine',
    level: 24,
    unit: 24,
    position: 1,
    title: 'Calm Pre-Show Routine',
    type: 'practice',
    description: 'Breathe, smile, and center before singing.',
    content: JSON.stringify({
      steps: [
        '3 calm belly breaths',
        'Shake out tension',
        'Smile and think of your story',
        'Count in confidently'
      ],
      visual: 'pre-show-routine',
      audio: 'calm-breaths'
    }),
    imageUrl: 'pre-show',
    unlocked: false,
    prerequisite: 'u23-song-engine-engine',
  },
  {
    id: 'u24-record-review',
    level: 24,
    unit: 24,
    position: 2,
    title: 'Record and Review',
    type: 'practice',
    description: 'Record a short take and listen back.',
    content: JSON.stringify({
      steps: [
        'Record a verse',
        'Listen for clarity',
        'Pick one small improvement',
        'Record again'
      ],
      visual: 'record-review',
      audio: 'recording-guide'
    }),
    imageUrl: 'record-review',
    unlocked: false,
    prerequisite: 'u24-confidence-routine',
  },
  {
    id: 'u24-song-recital',
    level: 24,
    unit: 24,
    position: 3,
    title: 'Song: Mini Recital',
    type: 'song',
    description: 'Share a short set of two songs.',
    content: JSON.stringify({
      steps: [
        'Choose two short songs',
        'Perform with smiles and bows',
        'Say thank you',
        'Celebrate!'
      ],
      visual: 'mini-recital',
      audio: 'recital-demo'
    }),
    imageUrl: 'song-recital',
    unlocked: false,
    prerequisite: 'u24-record-review',
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
    [5, 'Resonance & Tone', 'Hum and shape a beautiful tone'],
    [6, 'Range & Control', 'Stretch range safely and smoothly'],
    [7, 'Rhythm & Phrasing', 'Feel beats and shape phrases'],
    [8, 'Ear Training I', 'Hear steps, skips, and patterns'],
    [9, 'Vowels & Diction', 'Clear words and tall vowels'],
    [10, 'Breath Endurance', 'Sustain notes with steady breath'],
    [11, 'Harmony Basics', 'Sing with drones and simple rounds'],
    [12, 'Expression II', 'Add feeling with dynamics'],
    [13, 'Tempo & Control II', 'Keep tempos and transitions'],
    [14, 'Performance Basics', 'Confidence on a small stage'],
    [15, 'Pitch Accuracy II', 'Tune carefully with guides'],
    [16, 'Style & Echo', 'Try legato, staccato, and echoes'],
    [17, 'Articulation II', 'Sharper consonants and clarity'],
    [18, 'Resonance II', 'Balance bright and warm sounds'],
    [19, 'Harmony II', 'Stack simple harmonies'],
    [20, 'Stage Presence', 'Move, smile, and connect'],
    [21, 'Song Study I', 'Understand lyrics and breaths'],
    [22, 'Ear Training II', 'Intervals and chord feelings'],
    [23, 'Rhythm II', 'Syncopation and rests'],
    [24, 'Performance II', 'Polish and share a mini recital'],
  ];
  
  return units.map(([unit, title, description]) => ({
    unit,
    title,
    description,
    lessons: getLessonsByUnit(unit)
  }));
}