import { Lesson } from '../types';

export const sampleLessons: Lesson[] = [
  // Level 1 - Beginner Lessons
  {
    id: 'lesson-1',
    level: 1,
    title: 'Animal Sounds Fun',
    type: 'sound',
    description: 'Learn to make fun animal sounds! Perfect for beginners to practice different vocal techniques.',
    content: `Let's make some animal sounds! This is a fun way to explore your voice.

1. Start with a LION: "ROARRR!" - Use your deep voice!
2. Try a little MOUSE: "Squeak squeak!" - Use your high voice!
3. Be a happy DOG: "Woof woof!" - Use your medium voice!
4. Finish with a COW: "Mooooo!" - Hold the sound long!

Remember: Have fun and be silly! There's no wrong way to make animal sounds!`,
    imageUrl: '🦁'
  },
  {
    id: 'lesson-2',
    level: 1,
    title: 'Happy Birthday Song',
    type: 'song',
    description: 'Learn to sing the classic birthday song with proper pitch and rhythm!',
    content: `Let's learn "Happy Birthday"! This song has 4 simple lines:

Happy Birthday to you,
Happy Birthday to you,
Happy Birthday dear [Name],
Happy Birthday to you!

Tips:
- Start with a comfortable note, not too high or low
- Keep a steady rhythm - imagine clapping along
- The third line goes a bit higher - that's normal!
- Smile while you sing - it makes your voice sound happier!

Practice singing it for different people - your mom, dad, or even your pet!`,
    imageUrl: '🎂'
  },
  {
    id: 'lesson-3',
    level: 1,
    title: 'Twinkle Twinkle Little Star',
    type: 'song',
    description: 'Master this beloved children\'s song with fun exercises.',
    content: `Let's sing "Twinkle Twinkle Little Star"!

Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.
Twinkle, twinkle, little star,
How I wonder what you are!

Fun exercises:
1. Sing it SLOW like a sleepy turtle 🐢
2. Sing it FAST like a racing rabbit 🐰
3. Sing it QUIET like a whisper 🤫
4. Sing it LOUD like you're on stage 🎤

Remember: The melody goes up and down like stairs. Can you hear it?`,
    imageUrl: '⭐'
  },
  {
    id: 'lesson-4',
    level: 1,
    title: 'Echo Game',
    type: 'practice',
    description: 'Practice copying sounds and melodies in this fun echo game!',
    content: `Welcome to the Echo Game! Like a mountain echo, you'll repeat what you hear.

How to play:
1. Listen carefully to the sound
2. Wait for the "beep"
3. Copy the sound exactly as you heard it!

We'll practice:
- Single notes: "Ahhhh"
- Two notes: "La-La"
- Three notes: "Do-Re-Mi"
- Silly sounds: "Boing-boing!"
- Animal sounds: "Meow!"

This game helps train your ears and voice to work together!`,
    imageUrl: '🔊'
  },

  // Level 2 - Intermediate Lessons
  {
    id: 'lesson-5',
    level: 2,
    title: 'Breathing Exercises',
    type: 'practice',
    description: 'Learn proper breathing techniques for better singing.',
    content: `Good breathing = Good singing! Let's practice:

Exercise 1: Balloon Breathing 🎈
- Put your hands on your belly
- Breathe in slowly - feel your belly grow like a balloon
- Breathe out slowly - feel the balloon deflate
- Do this 5 times

Exercise 2: Birthday Candles 🕯️
- Take a deep breath
- Pretend you have 5 candles
- Blow them out one by one with short puffs
- This helps control your breath!

Exercise 3: The Hiss 🐍
- Take a deep breath
- Let it out slowly making a "sssss" sound
- Try to make it last 10 seconds!

Remember: Good singers are good breathers!`,
    imageUrl: '💨'
  },
  {
    id: 'lesson-6',
    level: 2,
    title: 'Rhythm and Clapping',
    type: 'practice',
    description: 'Develop your sense of rhythm with fun clapping exercises.',
    content: `Let's learn about rhythm! Rhythm is the beat of music.

Clapping Patterns:
1. Simple Beat: 👏 👏 👏 👏 (steady like a clock)
2. Skip Beat: 👏 _ 👏 _ (clap, pause, clap, pause)
3. Fast Doubles: 👏👏 _ 👏👏 _ (two quick claps, pause)
4. The Heartbeat: 👏👏 pause 👏👏 pause (like your heart!)

Fun Rhythm Games:
- Clap along to your favorite song
- Make up your own patterns
- Try clapping and singing at the same time
- Play "Copy My Rhythm" with a friend

Rhythm makes music FUN! Keep practicing!`,
    imageUrl: '👏'
  }
];

// Helper function to get lessons by level
export const getLessonsByLevel = (level: number): Lesson[] => {
  return sampleLessons.filter(lesson => lesson.level === level);
};

// Helper function to get a specific lesson
export const getLessonById = (id: string): Lesson | undefined => {
  return sampleLessons.find(lesson => lesson.id === id);
};