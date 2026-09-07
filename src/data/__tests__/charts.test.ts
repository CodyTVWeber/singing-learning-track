import { describe, expect, it } from 'vitest';
import { happyBirthdayChart } from '../charts/happy-birthday';
import { kookaLaughChart } from '../charts/kooka-laugh';
import { twinkleChart } from '../charts/twinkle';

const EXPECTED_MIDIS = [
  60, 60, 62, 60, 65, 64,
  60, 60, 62, 60, 67, 65,
  60, 60, 72, 69, 65, 64, 62,
  70, 70, 69, 65, 67, 65,
];

const KOOKA_LAUGH_MIDIS = [67, 64, 60, 67, 67, 64, 60, 60];

describe('kookaLaughChart', () => {
  it('is a short Kooka motif, not Twinkle', () => {
    expect(kookaLaughChart.title).toBe('Kooka Laugh Song');
    expect(kookaLaughChart.notes.map((note) => note.midi)).toEqual(KOOKA_LAUGH_MIDIS);
    expect(kookaLaughChart.notes.every((note) => note.lyric && note.lyric.length > 0)).toBe(true);
    expect(kookaLaughChart.notes.map((note) => note.midi)).not.toEqual(
      twinkleChart.notes.slice(0, KOOKA_LAUGH_MIDIS.length).map((note) => note.midi),
    );
    expect(kookaLaughChart.audioId).toBeUndefined();
  });
});

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
