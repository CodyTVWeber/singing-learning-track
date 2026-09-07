import { describe, expect, it } from 'vitest';
import { midiNoteToFrequency } from '../pitch';
import { scoreSong } from '../songScoring';
import type { PitchSample, SongChart } from '../../models/songChart';

const fixtureChart: SongChart = {
  id: 'test',
  title: 'Test',
  durationMs: 2000,
  notes: [
    { id: 'n1', midi: 60, startMs: 0, durationMs: 500 },
    { id: 'n2', midi: 62, startMs: 500, durationMs: 500 },
    { id: 'n3', midi: 64, startMs: 1000, durationMs: 500 },
    { id: 'n4', midi: 65, startMs: 1500, durationMs: 500 },
  ],
};

function samplesForNote(
  noteIndex: number,
  centsOffset = 0,
  sampleEveryMs = 20,
  marginMs = 100,
): PitchSample[] {
  const note = fixtureChart.notes[noteIndex];
  const baseHz = midiNoteToFrequency(note.midi);
  const hz = baseHz * Math.pow(2, centsOffset / 1200);
  const samples: PitchSample[] = [];
  const start = note.startMs + marginMs;
  const end = note.startMs + note.durationMs - 20;
  for (let t = start; t < end; t += sampleEveryMs) {
    samples.push({ timeMs: t, frequencyHz: hz, confidence: 0.9 });
  }
  return samples;
}

function samplesForAllNotes(centsOffset = 0): PitchSample[] {
  return fixtureChart.notes.flatMap((_, index) => samplesForNote(index, centsOffset));
}

describe('scoreSong', () => {
  it('scores perfect unison on every note as 100 overall', () => {
    const score = scoreSong(fixtureChart, samplesForAllNotes(0), { latencyMs: 0 });
    expect(score.overall).toBe(100);
    expect(score.notesHit).toBe(score.notesTotal);
    expect(score.perfectCount).toBe(4);
    expect(score.missCount).toBe(0);
  });

  it('scores complete silence as 0 with all misses', () => {
    const score = scoreSong(fixtureChart, []);
    expect(score.overall).toBe(0);
    expect(score.notesHit).toBe(0);
    expect(score.missCount).toBe(4);
    expect(score.noteScores.every((n) => n.rating === 'miss')).toBe(true);
  });

  it('scores wrong pitch by a fifth as miss / low score', () => {
    const score = scoreSong(fixtureChart, samplesForAllNotes(700), { octaveAgnostic: false });
    expect(score.overall).toBeLessThan(40);
    expect(score.missCount).toBeGreaterThan(0);
  });

  it('accepts octave errors when octaveAgnostic is true', () => {
    const octaveBelow = fixtureChart.notes.flatMap((note, index) =>
      samplesForNote(index, 0).map((s) => ({
        ...s,
        frequencyHz: (s.frequencyHz ?? 0) / 2,
      })),
    );
    const withOctave = scoreSong(fixtureChart, octaveBelow, { octaveAgnostic: true, latencyMs: 0 });
    const withoutOctave = scoreSong(fixtureChart, octaveBelow, { octaveAgnostic: false, latencyMs: 0 });
    expect(withOctave.overall).toBeGreaterThan(80);
    expect(withoutOctave.overall).toBeLessThan(withOctave.overall);
  });

  it('duration-weights partial performance near 50%', () => {
    const firstHalf = [
      ...samplesForNote(0),
      ...samplesForNote(1),
    ];
    const score = scoreSong(fixtureChart, firstHalf);
    expect(score.overall).toBeGreaterThanOrEqual(40);
    expect(score.overall).toBeLessThanOrEqual(60);
  });

  it('applies latency compensation', () => {
    const lateSamples = samplesForAllNotes(0).map((s) => ({
      ...s,
      timeMs: s.timeMs + 80,
    }));
    const score = scoreSong(fixtureChart, lateSamples, { latencyMs: 80 });
    expect(score.overall).toBe(100);
  });

  it('returns zero for empty chart notes', () => {
    const empty: SongChart = { id: 'empty', title: 'Empty', durationMs: 0, notes: [] };
    const score = scoreSong(empty, samplesForAllNotes());
    expect(score.overall).toBe(0);
    expect(score.notesTotal).toBe(0);
  });

  it('treats all-null frequencies as misses', () => {
    const silent = samplesForAllNotes().map((s) => ({ ...s, frequencyHz: null, confidence: 0 }));
    const score = scoreSong(fixtureChart, silent);
    expect(score.overall).toBe(0);
    expect(score.missCount).toBe(4);
  });
});
