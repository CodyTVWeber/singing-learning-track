import type { MelodyNote, SongChart } from '../../models/songChart';

function buildMelody(
  midis: Array<{ midi: number; durationMs?: number }>,
  lyrics: string[],
): MelodyNote[] {
  let startMs = 0;
  return midis.map((entry, index) => {
    const durationMs = entry.durationMs ?? 500;
    const note: MelodyNote = {
      id: `kooka-${index}`,
      midi: entry.midi,
      startMs,
      durationMs,
      lyric: lyrics[index],
    };
    startMs += durationMs;
    return note;
  });
}

const kookaLaughMidis: Array<{ midi: number; durationMs?: number }> = [
  { midi: 67 }, { midi: 64 }, { midi: 60 }, { midi: 67, durationMs: 1000 },
  { midi: 67 }, { midi: 64 }, { midi: 60 }, { midi: 60, durationMs: 1000 },
];

const kookaLaughLyrics = [
  'Koo', 'ka', 'bur', 'ra',
  'Koo', 'ka', 'bur', 'ra',
];

const kookaLaughNotes = buildMelody(kookaLaughMidis, kookaLaughLyrics);
const kookaLaughDurationMs = kookaLaughNotes.reduce(
  (max, note) => Math.max(max, note.startMs + note.durationMs),
  0,
);

export const kookaLaughChart: SongChart = {
  id: 'kooka-laugh',
  title: 'Kooka Laugh Song',
  durationMs: kookaLaughDurationMs,
  notes: kookaLaughNotes,
  bpm: 120,
};
