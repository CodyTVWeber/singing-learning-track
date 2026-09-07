import { describe, expect, it } from 'vitest';
import { happyBirthdayChart } from '../charts/happy-birthday';

const EXPECTED_MIDIS = [
  60, 60, 62, 60, 65, 64,
  60, 60, 62, 60, 67, 65,
  60, 60, 72, 69, 65, 64, 62,
  70, 70, 69, 65, 67, 65,
];

describe('happyBirthdayChart', () => {
  it('has the standard C-major melody MIDI sequence', () => {
    expect(happyBirthdayChart.notes.map((note) => note.midi)).toEqual(EXPECTED_MIDIS);
    expect(happyBirthdayChart.notes).toHaveLength(25);
  });

  it('aligns one lyric syllable per note', () => {
    expect(happyBirthdayChart.notes.every((note) => typeof note.lyric === 'string' && note.lyric.length > 0)).toBe(true);
    expect(happyBirthdayChart.notes).toHaveLength(EXPECTED_MIDIS.length);
  });
});
