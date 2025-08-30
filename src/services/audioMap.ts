import type { ResolvedAudio } from './tone';

/**
 * Resolve lesson content `audio` identifiers to playable sources.
 * - Returns either a file path in the public folder, or a tone/glide sequence
 *   to be rendered with the ToneGenerator.
 */
export function resolveAudioId(audioId?: string | null): ResolvedAudio | null {
  if (!audioId) return null;

  // Direct file mappings (public/audio/...)
  const fileMap: Record<string, string> = {
    'happy-birthday-simple': '/audio/nursery_rhymes/happyBirthday.mp3',
    'are-you-sleeping-round': '/audio/nursery_rhymes/areYouSleepingBrotherJohn.mp3',
    'twinkle-bright-tone': '/audio/nursery_rhymes/twinkleTwinkle.mp3',
    'rowboat-simple': '/audio/nursery_rhymes/areYouSleepingBrotherJohn.mp3',
    'light-of-mine-simple': '/audio/nursery_rhymes/ifYoureHappyAndYouKnowIt.mp3',
  };

  if (audioId in fileMap) {
    return { type: 'file', src: fileMap[audioId] };
  }

  // Common tone sequences
  if (audioId === 'pitch-examples') {
    // low vs high: A4 -> C5
    return {
      type: 'sequence',
      sequence: [
        { frequency: 440.0, durationMs: 1000, gapMs: 200 },
        { frequency: 523.25, durationMs: 1000, gapMs: 0 },
      ],
      volume: 0.2,
    };
  }

  if (audioId === 'piano-intervals') {
    // same, then different: C4 -> C4, C4 -> E4
    return {
      type: 'sequence',
      sequence: [
        { frequency: 261.63, durationMs: 800, gapMs: 200 },
        { frequency: 261.63, durationMs: 800, gapMs: 600 },
        { frequency: 261.63, durationMs: 800, gapMs: 200 },
        { frequency: 329.63, durationMs: 800, gapMs: 0 },
      ],
      volume: 0.2,
    };
  }

  if (audioId === 'vowel-scale-tones' || audioId === 'solfege-scale' || audioId === 'do-re-mi-simple') {
    // C major up 5 then down
    const up = [261.63, 293.66, 329.63, 349.23, 392.0];
    const down = [...up].reverse();
    return {
      type: 'sequence',
      sequence: [...up, ...down].map((f) => ({ frequency: f, durationMs: 800, gapMs: 120 })),
      volume: 0.18,
    };
  }

  if (audioId === 'siren-tones' || audioId === 'range-siren') {
    // Glide low to high and back
    return { type: 'glide', fromHz: 196.0, toHz: 784.0, durationMs: 3000, volume: 0.15 };
  }

  if (audioId === 'sustain-tone' || audioId === 'long-tone-15s') {
    return { type: 'sequence', sequence: [{ frequency: 220.0, durationMs: 5000 }], volume: 0.15 };
  }

  // Echo prompts fallback
  if (audioId.includes('echo') || audioId.includes('prompt')) {
    return { type: 'file', src: '/audio/echo_prompt.mp3' };
  }

  return null;
}

