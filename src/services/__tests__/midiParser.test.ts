import { describe, expect, it } from 'vitest';
import {
  buildMinimalMidi,
  parseMidiToChart,
  parseSongChartJson,
} from '../midiParser';

describe('parseMidiToChart', () => {
  it('parses a minimal MIDI file with note timing', () => {
    const bytes = buildMinimalMidi({
      ticksPerQuarter: 480,
      tempoUsec: 500_000,
      notes: [
        { midi: 60, startTick: 0, durationTicks: 480 },
        { midi: 64, startTick: 480, durationTicks: 480 },
        { midi: 67, startTick: 960, durationTicks: 480 },
      ],
    });

    const chart = parseMidiToChart(bytes, { id: 'mini', title: 'Mini' });
    expect(chart.notes).toHaveLength(3);
    expect(chart.notes.map((n) => n.midi)).toEqual([60, 64, 67]);
    expect(chart.notes[0].durationMs).toBeGreaterThanOrEqual(450);
    expect(chart.notes[0].durationMs).toBeLessThanOrEqual(550);
    expect(chart.durationMs).toBeGreaterThan(1400);
  });

  it('extracts top voice from overlapping notes (skyline)', () => {
    const bytes = buildMinimalMidi({
      ticksPerQuarter: 480,
      tempoUsec: 500_000,
      notes: [
        { midi: 60, startTick: 0, durationTicks: 1000 },
        { midi: 64, startTick: 0, durationTicks: 480 },
      ],
    });

    const chart = parseMidiToChart(bytes);
    expect(chart.notes).toHaveLength(2);
    expect(chart.notes[0].midi).toBe(64);
    expect(chart.notes[1].midi).toBe(60);
    expect(chart.notes[0].startMs).toBe(0);
    expect(chart.notes[0].durationMs).toBeGreaterThanOrEqual(450);
    expect(chart.notes[0].durationMs).toBeLessThanOrEqual(550);
    expect(chart.notes[1].startMs).toBeGreaterThanOrEqual(450);
    expect(chart.notes[1].startMs).toBeLessThanOrEqual(550);
    expect(chart.notes[1].durationMs).toBeGreaterThanOrEqual(450);
    expect(chart.notes[0].startMs + chart.notes[0].durationMs).toBe(chart.notes[1].startMs);
  });

  it('ignores drum channel notes present in the file', () => {
    const bytes = buildMinimalMidi({
      notes: [
        { midi: 60, startTick: 0, durationTicks: 480 },
        { midi: 38, startTick: 0, durationTicks: 480, channel: 9 },
      ],
    });
    const chart = parseMidiToChart(bytes);
    expect(chart.notes).toHaveLength(1);
    expect(chart.notes[0].midi).toBe(60);
  });

  it('throws on invalid bytes', () => {
    expect(() => parseMidiToChart(new Uint8Array([1, 2, 3]))).toThrow(/Invalid MIDI/);
  });
});

describe('parseSongChartJson', () => {
  it('accepts a valid chart', () => {
    const chart = parseSongChartJson({
      id: 'json-song',
      title: 'JSON Song',
      durationMs: 1000,
      notes: [{ id: 'a', midi: 60, startMs: 0, durationMs: 500, lyric: 'la' }],
    });
    expect(chart.id).toBe('json-song');
    expect(chart.notes[0].lyric).toBe('la');
    expect(chart.durationMs).toBeGreaterThanOrEqual(500);
  });

  it('rejects missing title or notes', () => {
    expect(() => parseSongChartJson({ id: 'x', notes: [] })).toThrow(/title/);
    expect(() => parseSongChartJson({ id: 'x', title: 'T' })).toThrow(/notes/);
  });
});

describe('buildMinimalMidi', () => {
  it('creates parseable format 0 and format 1 files', () => {
    const f0 = buildMinimalMidi({
      format: 0,
      notes: [{ midi: 62, startTick: 0, durationTicks: 240 }],
    });
    const f1 = buildMinimalMidi({
      format: 1,
      notes: [{ midi: 62, startTick: 0, durationTicks: 240 }],
    });
    expect(parseMidiToChart(f0).notes[0].midi).toBe(62);
    expect(parseMidiToChart(f1).notes[0].midi).toBe(62);
  });

  it('writes drum channel events into the byte stream', () => {
    const bytes = buildMinimalMidi({
      notes: [{ midi: 38, startTick: 0, durationTicks: 480, channel: 9 }],
    });
    expect(bytes.some((byte, index) => byte === (0x90 | 9) && bytes[index + 1] === 38)).toBe(true);
    const chart = parseMidiToChart(bytes);
    expect(chart.notes).toHaveLength(0);
  });
});
