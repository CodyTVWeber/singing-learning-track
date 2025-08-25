import { Lesson } from '../types';

// 🎯 DUOLINGO-STYLE SKILL TREE FOR SINGING
// Each unit must be completed before the next unlocks
// Each lesson within a unit must be completed before the next unlocks
export const sampleLessons: Lesson[] = [
  
  // 🌱 UNIT 1: VOCAL FOUNDATIONS (Building Blocks)
  {
    id: 'breath-basics',
    level: 1,
    unit: 1,
    position: 1,
    title: 'Breathing with Kooka',
    type: 'practice',
    description: 'Learn the foundation of all singing with Kooka the Kookaburra!',
    content: `Welcome to your first singing lesson! I'm Kooka, and I'll teach you the secret of great singing.

**Kooka's Breathing Technique:**

**Exercise 1: The Kookaburra Belly**
- Place your wings (hands) on your belly
- Breathe in slowly like you're filling up with air to sing your beautiful laugh
- Your belly should expand like Kooka's when she takes a big breath
- Breathe out slowly with a gentle "hoo" sound

**Exercise 2: The Eucalyptus Leaf Float**
- Imagine holding a eucalyptus leaf in front of you
- Breathe in, then blow gently to keep the leaf floating
- This teaches you breath control!

**Why This Matters:**
Just like Kooka needs good breath control for her famous laugh, singers need it for beautiful notes!

Practice this 3 times to unlock the next lesson!`,
    imageUrl: 'kooka-breathing',
    unlocked: true,
    prerequisite: null
  },

  {
    id: 'voice-discovery',
    level: 1,
    unit: 1,
    position: 2,
    title: 'Finding Your Voice',
    type: 'sound',
    description: 'Discover the different sounds your voice can make, just like Kooka\'s laugh!',
    content: `Now that you can breathe like Kooka, let's find your voice!

**Kooka's Voice Range Game:**

**Exercise 1: High Like a Baby Kookaburra**
- Make a gentle "hoo" sound in your highest comfortable voice
- Don't strain! Just like a baby kookaburra learning to call

**Exercise 2: Low Like Papa Kookaburra**
- Make a deeper "hoo" sound in your lowest comfortable voice
- Feel the vibrations in your chest, like Papa Kookaburra's deep call

**Exercise 3: Medium Like Mama Kookaburra**
- Find your comfortable middle voice
- This is your "home base" - where your voice feels most natural

**Exercise 4: The Kookaburra Slide**
- Start low and slide up to high: "Hoooooo" (like going up a tree)
- Then slide back down: "Hoooooo" (like coming back down)

Your voice is unique and beautiful, just like every kookaburra's laugh!`,
    imageUrl: 'kooka-voice-range',
    unlocked: false,
    prerequisite: 'breath-basics'
  },

  {
    id: 'kooka-laugh',
    level: 1,
    unit: 1,
    position: 3,
    title: 'The Kookaburra Laugh',
    type: 'song',
    description: 'Learn to sing like a kookaburra! This is your first real song!',
    content: `Time to learn Kooka's signature sound - the kookaburra laugh!

**The Famous Kookaburra Song:**
"Kookaburra sits in the old gum tree,
Merry, merry king of the bush is he!
Laugh, Kookaburra, laugh, Kookaburra,
Gay your life must be!"

**How to Sing It:**

**Step 1: Learn the Rhythm**
- Clap along: "Koo-ka-bur-ra sits in the old gum tree"
- Feel the beat like Kooka's heartbeat!

**Step 2: Add the Melody**
- Start in your comfortable middle voice
- "Kookaburra" - these notes step down like walking down stairs
- "sits in the old gum tree" - stay around the same level

**Step 3: The Famous Laugh**
- "Laugh, Kookaburra, laugh, Kookaburra" 
- Make it bouncy and happy, like Kooka is really laughing!

**Kooka's Tips:**
- Smile while you sing - it makes the song sound happier
- Don't worry about being perfect, just have fun!
- Imagine you're a happy kookaburra in a eucalyptus tree

Complete this lesson to unlock Unit 2!`,
    imageUrl: 'kooka-singing',
    unlocked: false,
    prerequisite: 'voice-discovery'
  },

  // 🎵 UNIT 2: PITCH ADVENTURES (Learning High and Low)
  {
    id: 'pitch-playground',
    level: 2,
    unit: 2,
    position: 1,
    title: 'Pitch Playground',
    type: 'practice',
    description: 'Explore high and low sounds with Kooka\'s forest friends!',
    content: `Great job completing Unit 1! Now Kooka wants to introduce you to her forest friends, and each one has a different voice!

**Kooka's Forest Friends:**

**Exercise 1: Tiny Tim the Mouse**
- Sing "squeak squeak" in your highest comfortable voice
- Keep it light and gentle, like a tiny mouse tiptoeing

**Exercise 2: Oliver the Owl**
- Sing "hoo hoo" in your lowest comfortable voice  
- Make it deep and wise, like an old owl at night

**Exercise 3: Bella the Bird**
- Sing "tweet tweet" in your medium-high voice
- Light and cheerful, like a bird greeting the morning

**Exercise 4: The Pitch Stairs**
- Start with Oliver (low): "Hoo"
- Move to Kooka (medium): "Hoo"  
- End with Bella (high): "Tweet"
- Like walking up stairs in the forest!

**Kooka's Challenge:**
Can you sing a conversation between the friends? Oliver says "Hoo" (low), Kooka replies "Hoo-hoo" (medium), and Bella chirps "Tweet!" (high)

Listen carefully to the difference between high and low - this is called "pitch"!`,
    imageUrl: 'kooka-forest-friends',
    unlocked: false,
    prerequisite: 'kooka-laugh'
  },

  {
    id: 'copy-kooka',
    level: 2,
    unit: 2,
    position: 2,
    title: 'Copy Kooka\'s Call',
    type: 'practice',
    description: 'Practice matching pitches by copying Kooka\'s musical calls!',
    content: `Now you'll learn to copy exactly what you hear - just like baby kookaburras learn from their parents!

**Kooka's Echo Game:**

**How to Play:**
1. Kooka will make a sound
2. Listen carefully 
3. Copy it exactly - same pitch, same rhythm
4. Try to sound just like Kooka!

**Round 1: Single Notes**
- Kooka sings "Hoo" on one note
- You sing "Hoo" on the same note
- Match her pitch exactly!

**Round 2: Two Notes**
- Kooka sings "Hoo-Haa" (low to high)
- You copy: "Hoo-Haa" (same pattern)

**Round 3: Three Notes**  
- Kooka sings "Hoo-Haa-Hoo" (low-high-low)
- You copy the exact pattern

**Round 4: The Kookaburra Signature**
- Kooka does her famous laugh pattern
- Copy her laugh exactly!

**Kooka's Tips:**
- Close your eyes and really listen first
- Don't rush - take your time to match the pitch
- Your ears and voice are learning to work together
- Every great singer started by copying others!

This skill is called "pitch matching" - it's super important for singing!`,
    imageUrl: 'kooka-echo',
    unlocked: false,
    prerequisite: 'pitch-playground'
  },

  {
    id: 'simple-songs',
    level: 2,
    unit: 2,
    position: 3,
    title: 'Simple Songs with Kooka',
    type: 'song',
    description: 'Sing your first real songs with proper pitch control!',
    content: `You're ready for real songs! Let's sing some classics that Kooka loves.

**Song 1: Twinkle, Twinkle, Little Star**
"Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.
Twinkle, twinkle, little star,
How I wonder what you are!"

**Kooka's Singing Tips:**
- "Twinkle, twinkle" - these notes are the same
- "little star" - this goes down like walking down stairs  
- "How I wonder" - goes up like climbing up
- "what you are" - comes back down to home

**Song 2: Mary Had a Little Lamb**
"Mary had a little lamb,
Little lamb, little lamb,
Mary had a little lamb,
Its fleece was white as snow!"

**Kooka's Tips:**
- This song mostly stays on the same notes
- Only "little lamb" in the second line goes down
- Practice slowly first, then speed up!

**Your Challenge:**
Sing both songs with Kooka! Focus on:
- Breathing between phrases (like Kooka taught you)
- Matching the pitch (high and low in the right places)
- Having fun - let your personality shine!

Complete this to unlock Unit 3 - Rhythm Rangers!`,
    imageUrl: 'kooka-simple-songs',
    unlocked: false,
    prerequisite: 'copy-kooka'
  },

  // 🥁 UNIT 3: RHYTHM RANGERS (Getting the Beat)
  {
    id: 'beat-discovery',
    level: 3,
    unit: 3,
    position: 1,
    title: 'Finding the Beat',
    type: 'practice',
    description: 'Learn rhythm with Kooka\'s drumming friends from the forest!',
    content: `Welcome to Rhythm Rangers! Kooka has some friends who are excellent at keeping time.

**Meet the Rhythm Rangers:**

**Exercise 1: Steady Eddie the Woodpecker**
- Eddie pecks the tree: "Tap-tap-tap-tap"
- Keep it steady like a clock: 1-2-3-4
- Clap along with Eddie's drumming

**Exercise 2: Bongo the Kangaroo**
- Bongo hops with a bounce: "Hop-pause-hop-pause"  
- Clap on the hops: "Clap-rest-clap-rest"
- Feel the strong beat and the rest

**Exercise 3: Speedy Sophie the Squirrel**
- Sophie gathers nuts quickly: "Quick-quick-rest-quick-quick-rest"
- Try clapping this fast pattern
- Two quick claps, then rest

**Exercise 4: The Forest Orchestra**
- Combine all three!
- Eddie: steady beat underneath
- Bongo: strong hops  
- Sophie: quick decorations on top

**Your Challenge:**
Clap along to "Kookaburra Sits in the Old Gum Tree" with steady Eddie's beat. Feel how the words fit perfectly with the rhythm!

Rhythm is the heartbeat of music - once you feel it, singing becomes so much easier!`,
    imageUrl: 'kooka-rhythm-friends',
    unlocked: false,
    prerequisite: 'simple-songs'
  },

  {
    id: 'clap-and-sing',
    level: 3,
    unit: 3,
    position: 2,
    title: 'Clap and Sing',
    type: 'practice',
    description: 'Master the art of keeping rhythm while singing - a true musician skill!',
    content: `Time for the ultimate challenge - doing two things at once! Just like Kooka can laugh and fly at the same time.

**Kooka's Coordination Training:**

**Level 1: Just Clapping**
- Clap to "Twinkle, Twinkle, Little Star"
- One clap for each word: "Twin-kle, twin-kle, lit-tle star"
- Keep it steady like Eddie the Woodpecker

**Level 2: Just Singing**  
- Sing "Twinkle, Twinkle" without clapping
- Focus on the melody and pitch
- Make sure you know it perfectly

**Level 3: The Big Challenge**
- Sing AND clap at the same time!
- Start slowly - don't rush
- Your brain is learning to multitask like a musician

**Advanced Challenge:**
Try with "Mary Had a Little Lamb":
- Clap on every word
- Keep singing the right pitches
- Stay together - claps and voice as one!

**Kooka's Secret Tips:**
- If you get confused, go back to just clapping
- Then just singing  
- Then slowly combine them
- Even professional musicians practice this way!
- Your brain is building new pathways - be patient!

This skill separates beginners from real musicians. You've got this!`,
    imageUrl: 'kooka-clap-sing',
    unlocked: false,
    prerequisite: 'beat-discovery'
  },

  // 🎭 UNIT 4: EXPRESSION STATION (Adding Feeling)
  {
    id: 'loud-soft',
    level: 4,
    unit: 4,
    position: 1,
    title: 'Loud and Soft',
    type: 'practice',
    description: 'Learn to control your volume - from whisper quiet to joyfully loud!',
    content: `Kooka is excited to teach you about dynamics - that's the fancy word for loud and soft!

**Kooka's Volume Control:**

**Exercise 1: The Whisper Game**
- Sing "Hoo" very quietly, like telling Kooka a secret
- So soft that only someone very close could hear
- This is called "pianissimo" (very soft)

**Exercise 2: Normal Conversation**
- Sing "Hoo" like you're talking to Kooka normally
- Not too loud, not too soft - just comfortable
- This is called "mezzo" (medium)

**Exercise 3: Calling Across the Forest**
- Sing "Hoo" like you're calling to Kooka in the next tree
- Loud and clear, but don't shout or strain
- This is called "forte" (loud)

**Exercise 4: The Volume Roller Coaster**
- Start soft: "Hoooo..." (pianissimo)
- Get louder: "Hoooo..." (mezzo)  
- End loud: "HOOOO!" (forte)
- Then back down: loud → medium → soft

**Song Practice:**
Sing "Twinkle, Twinkle, Little Star" with dynamics:
- "Twinkle, twinkle" (soft - like a gentle star)
- "little star" (medium)
- "How I wonder what you are" (getting louder with excitement)
- "Up above the world so high" (loud - amazed!)
- Back to soft for the rest

Volume control makes songs more interesting and expressive!`,
    imageUrl: 'kooka-volume',
    unlocked: false,
    prerequisite: 'clap-and-sing'
  },

  {
    id: 'happy-sad-singing',
    level: 4,
    unit: 4,
    position: 2,
    title: 'Happy and Sad Singing',
    type: 'practice',
    description: 'Express emotions through your voice - make your singing come alive!',
    content: `Time to add feelings to your singing! Kooka shows different emotions through her calls.

**Kooka's Emotion Lessons:**

**Happy Kooka:**
- Bright, bouncy voice
- Smile while you sing - you can hear it!
- Light and energetic, like Kooka playing in the sunshine
- Try singing "Kookaburra" like Kooka is very happy

**Sad Kooka:**
- Gentle, slower voice  
- A little breathy and soft
- Like Kooka missing her friends who flew away
- Try singing "Kookaburra" like Kooka is lonely

**Excited Kooka:**
- Fast and energetic
- A bit louder than normal
- Like Kooka found her favorite eucalyptus tree!
- Try singing "Kookaburra" like Kooka just won a prize

**Sleepy Kooka:**
- Very slow and gentle
- Soft and dreamy
- Like Kooka is ready for her afternoon nap
- Try singing "Kookaburra" like a lullaby

**Your Acting Challenge:**
Sing "Twinkle, Twinkle, Little Star" four different ways:
1. Happy (like you just saw the most beautiful star)
2. Sad (like the star is very far away)  
3. Excited (like the star is dancing just for you)
4. Sleepy (like a gentle lullaby)

**Kooka's Secret:**
The feeling in your heart comes out through your voice. Think about the emotion first, then sing!`,
    imageUrl: 'kooka-emotions',
    unlocked: false,
    prerequisite: 'loud-soft'
  }
];

// Helper function to get lessons by unit (for skill tree display)
export const getLessonsByUnit = (unit: number): Lesson[] => {
  return sampleLessons.filter(lesson => lesson.unit === unit).sort((a, b) => (a.position || 0) - (b.position || 0));
};

// Helper function to check if a lesson should be unlocked
export const isLessonUnlocked = (lessonId: string, completedLessons: string[]): boolean => {
  const lesson = sampleLessons.find(l => l.id === lessonId);
  if (!lesson) return false;
  
  // First lesson is always unlocked
  if (lesson.unlocked) return true;
  
  // Check if prerequisite is completed
  if (lesson.prerequisite) {
    return completedLessons.includes(lesson.prerequisite);
  }
  
  return false;
};

// Helper function to get the next lesson in sequence
export const getNextLesson = (currentLessonId: string): Lesson | null => {
  const currentIndex = sampleLessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === sampleLessons.length - 1) {
    return null;
  }
  return sampleLessons[currentIndex + 1];
};

// Helper function to get lessons by level (legacy support)
export const getLessonsByLevel = (level: number): Lesson[] => {
  return sampleLessons.filter(lesson => lesson.level === level);
};

// Helper function to get a specific lesson
export const getLessonById = (id: string): Lesson | undefined => {
  return sampleLessons.find(lesson => lesson.id === id);
};

// Get all units for skill tree display
export const getAllUnits = (): { unit: number, title: string, description: string, lessons: Lesson[] }[] => {
  const units = [
    { unit: 1, title: "Vocal Foundations", description: "Building blocks of singing" },
    { unit: 2, title: "Pitch Adventures", description: "Learning high and low" },
    { unit: 3, title: "Rhythm Rangers", description: "Getting the beat" },
    { unit: 4, title: "Expression Station", description: "Adding feeling" }
  ];
  
  return units.map(unit => ({
    ...unit,
    lessons: getLessonsByUnit(unit.unit)
  }));
};