import type { MelodyNote, SongChart } from '../../models/songChart';

function buildMelody(
  midis: Array<{ midi: number; durationMs?: number }>,
  lyrics: string[],
): MelodyNote[] {
  let startMs = 0;
  return midis.map((entry, index) => {
    const durationMs = entry.durationMs ?? 500;
    const note: MelodyNote = {
      id: `hb-${index}`,
      midi: entry.midi,
      startMs,
      durationMs,
      lyric: lyrics[index],
    };
    startMs += durationMs;
    return note;
  });
}

const happyBirthdayMidis: Array<{ midi: number; durationMs?: number }> = [
  { midi: 60 }, { midi: 60 }, { midi: 62 }, { midi: 60 }, { midi: 65 }, { midi: 64, durationMs: 1000 },
  { midi: 60 }, { midi: 60 }, { midi: 62 }, { midi: 60 }, { midi: 67 }, { midi: 65, durationMs: 1000 },
  { midi: 60 }, { midi: 60 }, { midi: 72 }, { midi: 69 }, { midi: 65 }, { midi: 64 }, { midi: 62, durationMs: 1000 },
  { midi: 70 }, { midi: 70 }, { midi: 69 }, { midi: 65 }, { midi: 67 }, { midi: 65, durationMs: 1000 },
];

const happyBirthdayLyrics = [
  'Hap', 'py', 'birth', 'day', 'to', 'you',
  'Hap', 'py', 'birth', 'day', 'to', 'you',
  'Hap', 'py', 'birth', 'day', 'dear', 'frie', 'nd',
  'Hap', 'py', 'birth', 'day', 'to', 'you',
];

const happyBirthdayNotes = buildMelody(happyBirthdayMidis, happyBirthdayLyrics);
const happyBirthdayDurationMs = happyBirthdayNotes.reduce(
  (max, note) => Math.max(max, note.startMs + note.durationMs),
  0,
);

export const happyBirthdayChart: SongChart = {
  id: 'happy-birthday',
  title: 'Happy Birthday',
  durationMs: happyBirthdayDurationMs,
  notes: happyBirthdayNotes,
  audioId: 'happy-birthday-simple',
  bpm: 120,
};
