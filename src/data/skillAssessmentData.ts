import { 
  SkillAssessment, 
  Unit, 
  Lesson, 
  LessonStep,
  AssessmentStep,
  RecordingStep,
  EchoStep,
  ClapTheBeatStep,
  BreathingExerciseStep,
  VocalExerciseStep,
  TheoryStep,
  PerformanceStep,
  PitchPracticeStep,
  ListeningStep
} from '../models/skillAssessment';

// Sample data for Unit 1: Start Singing!
const unit1Lessons: Lesson[] = [
  {
    id: 'lesson-1-1',
    title: 'Meet Kooka & Your Voice',
    description: 'Get to know Kooka and discover your singing voice',
    objectives: [
      'Understand what singing is',
      'Feel comfortable making sounds',
      'Learn to echo simple patterns',
      'Have fun with your voice!'
    ],
    estimatedDuration: 15,
    difficulty: 'beginner',
    imageUrl: '/img/kooka-burra-singing.png',
    steps: [
      {
        id: 'step-1-1-1',
        type: 'theory',
        title: 'Welcome to Singing!',
        instructions: 'Let\'s learn about singing with Kooka!',
        content: `
# Welcome, Young Singer! 🎵

Hi there! I'm Kooka the Kookaburra, and I'm so excited to help you learn to sing!

Singing is using your voice to make beautiful sounds and music. Everyone can sing - including YOU!

## What We'll Learn Together:
- How to use your voice safely
- Fun songs and sounds
- How to breathe for singing
- Games to make your voice stronger

Are you ready to start this amazing journey? Let's go!
        `,
        media: [
          {
            type: 'image',
            url: '/img/kooka-burra-waiving.png',
            caption: 'Kooka says hello!'
          }
        ]
      } as TheoryStep,
      {
        id: 'step-1-1-2',
        type: 'assessment',
        title: 'Quick Voice Check',
        instructions: 'Let\'s see what you already know about singing!',
        questions: [
          {
            id: 'q1',
            question: 'What do we use to sing?',
            options: ['Our hands', 'Our voice', 'Our feet', 'Our eyes'],
            correctAnswer: 1
          },
          {
            id: 'q2',
            question: 'Can everyone learn to sing?',
            options: ['No, only some people', 'Yes, everyone can!', 'Only adults', 'Only birds'],
            correctAnswer: 1
          },
          {
            id: 'q3',
            question: 'What should singing feel like?',
            options: ['It should hurt', 'It should be fun and comfortable', 'It should be very loud', 'It should be very quiet'],
            correctAnswer: 1
          }
        ]
      } as AssessmentStep,
      {
        id: 'step-1-1-3',
        type: 'echo',
        title: 'Echo with Kooka',
        instructions: 'Listen to Kooka and repeat what you hear!',
        promptText: 'Koo-ka-bur-ra!',
        promptAudio: '/audio/echo_prompt.mp3',
        minVolumeThreshold: 30,
        targetDuration: 3
      } as EchoStep,
      {
        id: 'step-1-1-4',
        type: 'recording',
        title: 'Say Your Name',
        instructions: 'Let\'s hear your voice! Say your name nice and clearly.',
        promptText: 'My name is...',
        maxDuration: 5,
        minVolumeThreshold: 20
      } as RecordingStep
    ]
  },
  {
    id: 'lesson-1-2',
    title: 'Belly Breathing Basics',
    description: 'Learn how to breathe like a singer',
    objectives: [
      'Understand belly breathing',
      'Practice breathing exercises',
      'Feel the difference between chest and belly breathing',
      'Build breath control'
    ],
    estimatedDuration: 20,
    difficulty: 'beginner',
    imageUrl: '/img/kooka-burra-breathing.png',
    steps: [
      {
        id: 'step-1-2-1',
        type: 'theory',
        title: 'Why Breathing Matters',
        instructions: 'Learn why good breathing helps us sing better',
        content: `
# The Power of Breath 💨

Just like Kooka needs air to fly, we need air to sing! But there's a special way singers breathe.

## Two Types of Breathing:
1. **Chest Breathing** - Shallow and quick (not great for singing)
2. **Belly Breathing** - Deep and strong (perfect for singing!)

When we breathe with our belly, we get more air and can sing longer, stronger notes!
        `,
        media: [
          {
            type: 'image',
            url: '/img/breathing-diagram.png',
            caption: 'See how the belly moves when we breathe'
          }
        ]
      } as TheoryStep,
      {
        id: 'step-1-2-2',
        type: 'breathing-exercise',
        title: 'Balloon Belly Breathing',
        instructions: 'Imagine your belly is a balloon. Breathe in to inflate it, breathe out to deflate it.',
        pattern: {
          inhale: 4,
          hold: 2,
          exhale: 4,
          rest: 2
        },
        repetitions: 5,
        visualGuide: '/img/belly-breathing-animation.gif'
      } as BreathingExerciseStep,
      {
        id: 'step-1-2-3',
        type: 'breathing-exercise',
        title: 'Book Balance',
        instructions: 'Lie down with a light book on your belly. Make it rise and fall with your breath.',
        pattern: {
          inhale: 3,
          exhale: 3
        },
        repetitions: 8,
        visualGuide: '/img/book-breathing.png'
      } as BreathingExerciseStep,
      {
        id: 'step-1-2-4',
        type: 'recording',
        title: 'Hiss Like a Snake',
        instructions: 'Take a deep belly breath, then hiss like a snake as long as you can!',
        promptText: 'Ssssssssss...',
        maxDuration: 10,
        minVolumeThreshold: 15
      } as RecordingStep
    ]
  },
  {
    id: 'lesson-1-3',
    title: 'High & Low Voices',
    description: 'Explore different pitches with fun animal sounds',
    objectives: [
      'Understand high and low pitches',
      'Make different animal sounds',
      'Find your comfortable singing range',
      'Have fun exploring your voice'
    ],
    estimatedDuration: 15,
    difficulty: 'beginner',
    imageUrl: '/img/animal-voices.png',
    steps: [
      {
        id: 'step-1-3-1',
        type: 'listening',
        title: 'Listen to High and Low',
        instructions: 'Listen carefully to these different sounds. Which are high? Which are low?',
        audioUrl: '/audio/high-low-examples.mp3',
        questions: [
          {
            question: 'Was that sound high or low?',
            timestamp: 5
          },
          {
            question: 'What about this one?',
            timestamp: 10
          }
        ]
      } as ListeningStep,
      {
        id: 'step-1-3-2',
        type: 'recording',
        title: 'Baby Bird (High Voice)',
        instructions: 'Make a high sound like a baby bird chirping!',
        promptText: 'Tweet tweet!',
        promptAudio: '/audio/high-bird.mp3',
        maxDuration: 5,
        targetPitch: 440 // A4
      } as RecordingStep,
      {
        id: 'step-1-3-3',
        type: 'recording',
        title: 'Papa Bear (Low Voice)',
        instructions: 'Make a low sound like a big papa bear!',
        promptText: 'Grrrr!',
        promptAudio: '/audio/low-bear.mp3',
        maxDuration: 5,
        targetPitch: 220 // A3
      } as RecordingStep,
      {
        id: 'step-1-3-4',
        type: 'pitch-practice',
        title: 'Find Middle C',
        instructions: 'Let\'s find a comfortable middle note to sing!',
        targetNote: 'C4',
        targetHz: 261.63,
        referenceAudio: '/audio/middle-c.mp3',
        tolerance: 50
      } as PitchPracticeStep
    ]
  },
  {
    id: 'lesson-1-4',
    title: 'Kooka\'s Laugh Song',
    description: 'Learn your first song with Kooka!',
    objectives: [
      'Learn the Kookaburra song',
      'Practice singing with rhythm',
      'Have fun performing',
      'Build confidence'
    ],
    estimatedDuration: 20,
    difficulty: 'beginner',
    imageUrl: '/img/kooka-burra-singing.png',
    steps: [
      {
        id: 'step-1-4-1',
        type: 'listening',
        title: 'Listen to the Song',
        instructions: 'Listen to the Kookaburra song. Try to remember the words!',
        audioUrl: '/audio/kookaburra-song.mp3'
      } as ListeningStep,
      {
        id: 'step-1-4-2',
        type: 'clap-the-beat',
        title: 'Clap the Rhythm',
        instructions: 'Let\'s clap the rhythm of the song before we sing it!',
        pattern: ['clap', 'clap', 'rest', 'clap', 'clap', 'rest', 'clap', 'clap'],
        bpm: 100,
        audioExample: '/audio/kookaburra-rhythm.mp3'
      } as ClapTheBeatStep,
      {
        id: 'step-1-4-3',
        type: 'echo',
        title: 'Echo Each Line',
        instructions: 'Let\'s learn the song line by line!',
        promptText: 'Kookaburra sits in the old gum tree',
        promptAudio: '/audio/kookaburra-line1.mp3',
        minVolumeThreshold: 30,
        targetDuration: 4
      } as EchoStep,
      {
        id: 'step-1-4-4',
        type: 'performance',
        title: 'Sing the Whole Song!',
        instructions: 'Now let\'s put it all together and sing the Kookaburra song!',
        songTitle: 'Kookaburra',
        backingTrack: '/audio/kookaburra-backing.mp3',
        lyrics: `Kookaburra sits in the old gum tree
Merry, merry king of the bush is he
Laugh, Kookaburra! Laugh, Kookaburra!
Gay your life must be!`
      } as PerformanceStep
    ]
  },
  {
    id: 'lesson-1-5',
    title: 'Clap the Beat',
    description: 'Learn about rhythm and keeping a steady beat',
    objectives: [
      'Understand what rhythm is',
      'Keep a steady beat',
      'Clap different patterns',
      'Combine clapping with singing'
    ],
    estimatedDuration: 15,
    difficulty: 'beginner',
    imageUrl: '/img/rhythm-practice.png',
    steps: [
      {
        id: 'step-1-5-1',
        type: 'clap-the-beat',
        title: 'Steady Beat',
        instructions: 'Let\'s start with a simple steady beat. Clap along!',
        pattern: ['clap', 'clap', 'clap', 'clap'],
        bpm: 80,
        audioExample: '/audio/steady-beat.mp3'
      } as ClapTheBeatStep,
      {
        id: 'step-1-5-2',
        type: 'clap-the-beat',
        title: 'Fast and Slow',
        instructions: 'Now let\'s try a faster beat!',
        pattern: ['clap', 'clap', 'clap', 'clap'],
        bpm: 120,
        audioExample: '/audio/fast-beat.mp3'
      } as ClapTheBeatStep,
      {
        id: 'step-1-5-3',
        type: 'clap-the-beat',
        title: 'Pattern Time',
        instructions: 'Can you clap this pattern? Listen first, then try!',
        pattern: ['clap', 'clap', 'rest', 'clap', 'rest', 'clap', 'clap', 'rest'],
        bpm: 100,
        audioExample: '/audio/rhythm-pattern.mp3'
      } as ClapTheBeatStep,
      {
        id: 'step-1-5-4',
        type: 'assessment',
        title: 'Rhythm Quiz',
        instructions: 'Let\'s see what you learned about rhythm!',
        questions: [
          {
            id: 'q1',
            question: 'What is a steady beat?',
            options: [
              'Random clapping',
              'Claps that stay the same speed',
              'Very loud claps',
              'Very quiet claps'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2',
            question: 'What does "rest" mean in rhythm?',
            options: [
              'Sleep time',
              'A moment of silence',
              'Clap louder',
              'Sing a note'
            ],
            correctAnswer: 1
          }
        ]
      } as AssessmentStep
    ]
  }
];

const unit1: Unit = {
  id: 'unit-1',
  number: 1,
  title: 'Start Singing!',
  description: 'Discover your voice with Kooka and learn the basics of singing',
  theme: 'introduction',
  lessons: unit1Lessons,
  imageUrl: '/img/kooka-burra-singing.png',
  color: '#4ECDC4'
};

// Sample data for Unit 2: Breath Control & Dynamics
const unit2Lessons: Lesson[] = [
  {
    id: 'lesson-2-1',
    title: 'Advanced Breathing Techniques',
    description: 'Build on your breathing skills with new exercises',
    objectives: [
      'Master different breathing patterns',
      'Increase breath capacity',
      'Control breath flow',
      'Apply breathing to singing'
    ],
    estimatedDuration: 25,
    difficulty: 'beginner',
    imageUrl: '/img/breathing-book.png',
    steps: [
      {
        id: 'step-2-1-1',
        type: 'breathing-exercise',
        title: 'Box Breathing',
        instructions: 'Breathe in a square pattern: in, hold, out, hold',
        pattern: {
          inhale: 4,
          hold: 4,
          exhale: 4,
          rest: 4
        },
        repetitions: 6,
        visualGuide: '/img/box-breathing.gif'
      } as BreathingExerciseStep,
      {
        id: 'step-2-1-2',
        type: 'breathing-exercise',
        title: 'Pulse Breath Support',
        instructions: 'Strengthen your breath with quick pulses',
        pattern: {
          inhale: 4,
          exhale: 8 // Will do pulses during exhale
        },
        repetitions: 5,
        visualGuide: '/img/pulse-breath.gif'
      } as BreathingExerciseStep,
      {
        id: 'step-2-1-3',
        type: 'vocal-exercise',
        title: 'Breath Flow on "Ah"',
        instructions: 'Sing "ah" while focusing on steady breath flow',
        exerciseType: 'vowels',
        audioGuide: '/audio/breath-flow-ah.mp3',
        visualGuide: '/img/vowel-ah.png'
      } as VocalExerciseStep
    ]
  }
];

const unit2: Unit = {
  id: 'unit-2',
  number: 2,
  title: 'Breath Control & Dynamics',
  description: 'Master breathing techniques and learn to control volume',
  theme: 'breath-dynamics',
  lessons: unit2Lessons,
  imageUrl: '/img/breathing-pulse.png',
  color: '#FF6B6B'
};

// Create the full skill assessment
export const beginnerVocalAssessment: SkillAssessment = {
  id: 'beginner-vocal-assessment',
  title: 'Beginner Vocal Skills',
  description: 'A comprehensive program for developing fundamental singing skills',
  targetAge: '4-6 years',
  totalPoints: 2400, // Approximate based on lessons
  units: [unit1, unit2], // Add more units as they're created
  certificateUrl: '/certificates/beginner-vocal.pdf'
};

// Helper functions
export function getUnitById(unitId: string): Unit | undefined {
  return beginnerVocalAssessment.units.find(unit => unit.id === unitId);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  for (const unit of beginnerVocalAssessment.units) {
    const lesson = unit.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getStepById(stepId: string): LessonStep | undefined {
  for (const unit of beginnerVocalAssessment.units) {
    for (const lesson of unit.lessons) {
      const step = lesson.steps.find(s => s.id === stepId);
      if (step) return step;
    }
  }
  return undefined;
}