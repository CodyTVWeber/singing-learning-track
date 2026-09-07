import type { MelodyNote, SongChart } from '../../models/songChart';

function buildMelody(
  midis: Array<{ midi: number; durationMs?: number }>,
  lyrics: string[],
): MelodyNote[] {
  let startMs = 0;
  return midis.map((entry, index) => {
    const durationMs = entry.durationMs ?? 500;
    const note: MelodyNote = {
      id: `twinkle-${index}`,
      midi: entry.midi,
      startMs,
      durationMs,
      lyric: lyrics[index],
    };
    startMs += durationMs;
    return note;
  });
}

const twinkleMidis: Array<{ midi: number; durationMs?: number }> = [
  { midi: 60 }, { midi: 60 }, { midi: 67 }, { midi: 67 }, { midi: 69 }, { midi: 69 }, { midi: 67, durationMs: 1000 },
  { midi: 65 }, { midi: 65 }, { midi: 64 }, { midi: 64 }, { midi: 62 }, { midi: 62 }, { midi: 60, durationMs: 1000 },
  { midi: 67 }, { midi: 67 }, { midi: 65 }, { midi: 65 }, { midi: 64 }, { midi: 64 }, { midi: 62, durationMs: 1000 },
  { midi: 67 }, { midi: 67 }, { midi: 65 }, { midi: 65 }, { midi: 64 }, { midi: 64 }, { midi: 62, durationMs: 1000 },
  { midi: 60 }, { midi: 60 }, { midi: 67 }, { midi: 67 }, { midi: 69 }, { midi: 69 }, { midi: 67, durationMs: 1000 },
  { midi: 65 }, { midi: 65 }, { midi: 64 }, { midi: 64 }, { midi: 62 }, { midi: 62 }, { midi: 60, durationMs: 1000 },
];

const twinkleLyrics = [
  'Twin', 'kle', 'twin', 'kle', 'lit', 'tle', 'star',
  'How', 'I', 'won', 'der', 'what', 'you', 'are',
  'Up', 'a', 'bove', 'the', 'world', 'so', 'high',
  'Like', 'a', 'dia', 'mond', 'in', 'the', 'sky',
  'Twin', 'kle', 'twin', 'kle', 'lit', 'tle', 'star',
  'How', 'I', 'won', 'der', 'what', 'you', 'are',
];

const twinkleNotes = buildMelody(twinkleMidis, twinkleLyrics);
const twinkleDurationMs = twinkleNotes.reduce(
  (max, note) => Math.max(max, note.startMs + note.durationMs),
  0,
);

export const twinkleChart: SongChart = {
  id: 'twinkle',
  title: 'Twinkle Twinkle Little Star',
  durationMs: twinkleDurationMs,
  notes: twinkleNotes,
  audioId: 'twinkle-bright-tone',
  bpm: 120,
};
