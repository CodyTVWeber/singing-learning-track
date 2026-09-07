import type { MelodyNote, SongChart } from '../models/songChart';

const HEADER_MAGIC = [0x4d, 0x54, 0x68, 0x64]; // MThd
const TRACK_MAGIC = [0x4d, 0x54, 0x72, 0x6b]; // MTrk

interface ParsedNoteEvent {
  channel: number;
  midi: number;
  startMs: number;
  endMs: number | null;
}

interface TempoChange {
  tick: number;
  microsecondsPerQuarter: number;
}

function readUint32(data: Uint8Array, offset: number): number {
  return (
    ((data[offset] << 24) >>> 0) +
    (data[offset + 1] << 16) +
    (data[offset + 2] << 8) +
    data[offset + 3]
  );
}

function readUint16(data: Uint8Array, offset: number): number {
  return (data[offset] << 8) + data[offset + 1];
}

function readVariableLength(data: Uint8Array, offset: number): { value: number; nextOffset: number } {
  let value = 0;
  let i = offset;
  while (i < data.length) {
    const byte = data[i];
    value = (value << 7) | (byte & 0x7f);
    i += 1;
    if ((byte & 0x80) === 0) break;
  }
  return { value, nextOffset: i };
}

function ticksToMs(tick: number, tempoMap: TempoChange[], ticksPerQuarter: number): number {
  if (tick <= 0) return 0;

  let ms = 0;
  let prevTick = 0;
  let tempo = tempoMap[0]?.microsecondsPerQuarter ?? 500_000;

  for (let i = 1; i < tempoMap.length; i += 1) {
    const change = tempoMap[i];
    if (change.tick >= tick) break;
    ms += ((change.tick - prevTick) * tempo) / ticksPerQuarter / 1000;
    prevTick = change.tick;
    tempo = change.microsecondsPerQuarter;
  }

  ms += ((tick - prevTick) * tempo) / ticksPerQuarter / 1000;
  return ms;
}

/** Skyline / top-voice extraction: highest sounding pitch per time slice. */
function extractTopVoiceMelody(notes: ParsedNoteEvent[]): MelodyNote[] {
  const intervals: Array<{ startMs: number; endMs: number; midi: number }> = [];
  for (const note of notes) {
    const endMs = note.endMs ?? note.startMs + 250;
    if (endMs - note.startMs < 50) continue;
    intervals.push({ startMs: note.startMs, endMs, midi: note.midi });
  }

  if (intervals.length === 0) return [];

  const timestamps = new Set<number>();
  for (const interval of intervals) {
    timestamps.add(interval.startMs);
    timestamps.add(interval.endMs);
  }
  const sortedTimes = [...timestamps].sort((a, b) => a - b);

  const slices: Array<{ startMs: number; endMs: number; midi: number }> = [];
  for (let i = 0; i < sortedTimes.length - 1; i += 1) {
    const startMs = sortedTimes[i];
    const endMs = sortedTimes[i + 1];
    if (endMs - startMs < 50) continue;

    let highestMidi: number | null = null;
    for (const interval of intervals) {
      if (interval.startMs < endMs && interval.endMs > startMs) {
        if (highestMidi == null || interval.midi > highestMidi) {
          highestMidi = interval.midi;
        }
      }
    }

    if (highestMidi != null) {
      slices.push({ startMs, endMs, midi: highestMidi });
    }
  }

  const merged: Array<{ startMs: number; endMs: number; midi: number }> = [];
  for (const slice of slices) {
    const last = merged[merged.length - 1];
    if (last && last.midi === slice.midi && last.endMs === slice.startMs) {
      last.endMs = slice.endMs;
    } else {
      merged.push({ ...slice });
    }
  }

  return merged
    .filter((slice) => slice.endMs - slice.startMs >= 50)
    .map((slice, index) => ({
      id: `midi-${index}`,
      midi: slice.midi,
      startMs: Math.round(slice.startMs),
      durationMs: Math.max(50, Math.round(slice.endMs - slice.startMs)),
    }));
}

function upsertTempo(tempoMap: TempoChange[], tick: number, microsecondsPerQuarter: number): void {
  const existing = tempoMap.find((change) => change.tick === tick);
  if (existing) {
    existing.microsecondsPerQuarter = microsecondsPerQuarter;
  } else {
    tempoMap.push({ tick, microsecondsPerQuarter });
  }
}

function scanTrackTempo(
  data: Uint8Array,
  offset: number,
  length: number,
  tempoMap: TempoChange[],
): void {
  const end = offset + length;
  let pos = offset;
  let tick = 0;
  let runningStatus = 0;

  while (pos < end) {
    const delta = readVariableLength(data, pos);
    tick += delta.value;
    pos = delta.nextOffset;

    if (pos >= end) break;
    let status = data[pos];

    if (status === 0xff) {
      pos += 1;
      const metaType = data[pos];
      pos += 1;
      const metaLen = readVariableLength(data, pos);
      pos = metaLen.nextOffset;

      if (metaType === 0x51 && metaLen.value === 3) {
        const uspq = (data[pos] << 16) + (data[pos + 1] << 8) + data[pos + 2];
        upsertTempo(tempoMap, tick, uspq);
      }

      pos += metaLen.value;
      continue;
    }

    if (status === 0xf0 || status === 0xf7) {
      pos += 1;
      const sysexLen = readVariableLength(data, pos);
      pos = sysexLen.nextOffset + sysexLen.value;
      continue;
    }

    if (status < 0x80) {
      if (runningStatus === 0) {
        throw new Error('Invalid MIDI: unexpected running status');
      }
      status = runningStatus;
    } else {
      runningStatus = status;
      pos += 1;
    }

    const command = status & 0xf0;
    if (command === 0xc0 || command === 0xd0) {
      pos += 1;
    } else if (command === 0xe0 || command === 0x80 || command === 0x90 || command === 0xa0 || command === 0xb0) {
      pos += 2;
    } else {
      pos += 2;
    }
  }
}

function parseTrackNotes(
  data: Uint8Array,
  offset: number,
  length: number,
  ticksPerQuarter: number,
  tempoMap: TempoChange[],
): { notes: ParsedNoteEvent[]; lastEventMs: number } {
  const end = offset + length;
  let pos = offset;
  let tick = 0;
  let runningStatus = 0;
  const activeNotes = new Map<string, { startMs: number; channel: number; midi: number }>();
  const notes: ParsedNoteEvent[] = [];
  let lastEventMs = 0;

  while (pos < end) {
    const delta = readVariableLength(data, pos);
    tick += delta.value;
    pos = delta.nextOffset;
    const eventMs = ticksToMs(tick, tempoMap, ticksPerQuarter);
    lastEventMs = Math.max(lastEventMs, eventMs);

    if (pos >= end) break;
    let status = data[pos];

    if (status === 0xff) {
      pos += 1;
      pos += 1; // meta type
      const metaLen = readVariableLength(data, pos);
      pos = metaLen.nextOffset;
      pos += metaLen.value;
      continue;
    }

    if (status === 0xf0 || status === 0xf7) {
      pos += 1;
      const sysexLen = readVariableLength(data, pos);
      pos = sysexLen.nextOffset + sysexLen.value;
      continue;
    }

    if (status < 0x80) {
      if (runningStatus === 0) {
        throw new Error('Invalid MIDI: unexpected running status');
      }
      status = runningStatus;
    } else {
      runningStatus = status;
      pos += 1;
    }

    const command = status & 0xf0;
    const channel = status & 0x0f;

    if (command === 0x90) {
      const note = data[pos];
      const velocity = data[pos + 1];
      pos += 2;

      if (velocity === 0) {
        if (channel === 9) continue;
        const key = `${channel}-${note}`;
        const active = activeNotes.get(key);
        if (active) {
          notes.push({
            channel,
            midi: note,
            startMs: active.startMs,
            endMs: eventMs,
          });
          activeNotes.delete(key);
        }
      } else if (channel !== 9) {
        activeNotes.set(`${channel}-${note}`, { startMs: eventMs, channel, midi: note });
      }
    } else if (command === 0x80) {
      const note = data[pos];
      pos += 2;
      if (channel === 9) continue;

      const key = `${channel}-${note}`;
      const active = activeNotes.get(key);
      if (active) {
        notes.push({
          channel,
          midi: note,
          startMs: active.startMs,
          endMs: eventMs,
        });
        activeNotes.delete(key);
      }
    } else if (command === 0xc0 || command === 0xd0) {
      pos += 1;
    } else if (command === 0xe0) {
      pos += 2;
    } else {
      pos += 2;
    }
  }

  for (const active of activeNotes.values()) {
    notes.push({
      channel: active.channel,
      midi: active.midi,
      startMs: active.startMs,
      endMs: active.startMs + 250,
    });
  }

  return { notes, lastEventMs };
}

export function parseMidiToChart(
  bytes: Uint8Array,
  meta?: { id?: string; title?: string },
): SongChart {
  if (bytes.length < 14) {
    throw new Error('Invalid MIDI: file too short');
  }

  for (let i = 0; i < 4; i += 1) {
    if (bytes[i] !== HEADER_MAGIC[i]) {
      throw new Error('Invalid MIDI: missing MThd header');
    }
  }

  const headerLength = readUint32(bytes, 4);
  if (headerLength !== 6) {
    throw new Error('Invalid MIDI: unsupported header length');
  }

  const format = readUint16(bytes, 8);
  const numTracks = readUint16(bytes, 10);
  const division = readUint16(bytes, 12);

  if (format > 1) {
    throw new Error('Invalid MIDI: format 2 is not supported');
  }
  if ((division & 0x8000) !== 0) {
    throw new Error('Invalid MIDI: SMPTE timing is not supported');
  }

  const ticksPerQuarter = division;
  const trackChunks: Array<{ offset: number; length: number }> = [];
  let offset = 8 + headerLength;

  for (let t = 0; t < numTracks; t += 1) {
    if (offset + 8 > bytes.length) {
      throw new Error('Invalid MIDI: unexpected end of file');
    }

    for (let i = 0; i < 4; i += 1) {
      if (bytes[offset + i] !== TRACK_MAGIC[i]) {
        throw new Error('Invalid MIDI: missing MTrk chunk');
      }
    }

    const trackLength = readUint32(bytes, offset + 4);
    offset += 8;
    trackChunks.push({ offset, length: trackLength });
    offset += trackLength;
  }

  const tempoMap: TempoChange[] = [{ tick: 0, microsecondsPerQuarter: 500_000 }];
  for (const track of trackChunks) {
    scanTrackTempo(bytes, track.offset, track.length, tempoMap);
  }
  tempoMap.sort((a, b) => a.tick - b.tick);

  const allNotes: ParsedNoteEvent[] = [];
  let lastEventMs = 0;
  for (const track of trackChunks) {
    const parsed = parseTrackNotes(bytes, track.offset, track.length, ticksPerQuarter, tempoMap);
    allNotes.push(...parsed.notes);
    lastEventMs = Math.max(lastEventMs, parsed.lastEventMs);
  }

  const melodyNotes = extractTopVoiceMelody(allNotes);
  const lastNoteEnd = melodyNotes.reduce(
    (max, note) => Math.max(max, note.startMs + note.durationMs),
    0,
  );
  const durationMs = Math.max(lastNoteEnd, lastEventMs);

  return {
    id: meta?.id ?? 'imported-midi',
    title: meta?.title ?? 'Imported MIDI',
    durationMs,
    notes: melodyNotes,
    bpm: Math.round(60_000_000 / (tempoMap[0]?.microsecondsPerQuarter ?? 500_000)),
  };
}

function isMelodyNote(value: unknown): value is MelodyNote {
  if (!value || typeof value !== 'object') return false;
  const note = value as Record<string, unknown>;
  return (
    typeof note.id === 'string' &&
    typeof note.midi === 'number' &&
    note.midi >= 0 &&
    note.midi <= 127 &&
    typeof note.startMs === 'number' &&
    typeof note.durationMs === 'number' &&
    note.durationMs > 0
  );
}

export function parseSongChartJson(data: unknown): SongChart {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid chart JSON: expected an object');
  }

  const chart = data as Record<string, unknown>;
  if (typeof chart.id !== 'string' || !chart.id) {
    throw new Error('Invalid chart JSON: missing id');
  }
  if (typeof chart.title !== 'string' || !chart.title) {
    throw new Error('Invalid chart JSON: missing title');
  }
  if (!Array.isArray(chart.notes) || chart.notes.length === 0) {
    throw new Error('Invalid chart JSON: notes must be a non-empty array');
  }

  const notes: MelodyNote[] = chart.notes.map((note, index) => {
    if (!isMelodyNote(note)) {
      throw new Error(`Invalid chart JSON: note at index ${index} is malformed`);
    }
    return {
      id: note.id,
      midi: note.midi,
      startMs: note.startMs,
      durationMs: note.durationMs,
      lyric: typeof note.lyric === 'string' ? note.lyric : undefined,
    };
  });

  notes.sort((a, b) => a.startMs - b.startMs);
  const lastNoteEnd = notes.reduce(
    (max, note) => Math.max(max, note.startMs + note.durationMs),
    0,
  );
  const durationMs =
    typeof chart.durationMs === 'number'
      ? Math.max(chart.durationMs, lastNoteEnd)
      : lastNoteEnd;

  return {
    id: chart.id,
    title: chart.title,
    artist: typeof chart.artist === 'string' ? chart.artist : undefined,
    durationMs,
    notes,
    audioId: typeof chart.audioId === 'string' ? chart.audioId : undefined,
    audioUrl: typeof chart.audioUrl === 'string' ? chart.audioUrl : undefined,
    bpm: typeof chart.bpm === 'number' ? chart.bpm : undefined,
  };
}

/** Test helper: build a minimal valid Standard MIDI File. */
export function buildMinimalMidi(options: {
  notes: Array<{ midi: number; startTick: number; durationTicks: number; channel?: number }>;
  ticksPerQuarter?: number;
  tempoUsec?: number;
  format?: 0 | 1;
}): Uint8Array {
  const ticksPerQuarter = options.ticksPerQuarter ?? 480;
  const tempoUsec = options.tempoUsec ?? 500_000;
  const format = options.format ?? 0;

  const trackEvents: number[] = [];
  let lastTick = 0;

  const pushVarLen = (value: number) => {
    const buffer: number[] = [];
    buffer.push(value & 0x7f);
    let v = value >> 7;
    while (v > 0) {
      buffer.unshift((v & 0x7f) | 0x80);
      v >>= 7;
    }
    trackEvents.push(...buffer);
  };

  pushVarLen(0);
  trackEvents.push(0xff, 0x51, 0x03, (tempoUsec >> 16) & 0xff, (tempoUsec >> 8) & 0xff, tempoUsec & 0xff);

  type MidiEvent = { tick: number; kind: 'on' | 'off'; channel: number; midi: number };
  const events: MidiEvent[] = [];
  for (const note of options.notes) {
    const channel = note.channel ?? 0;
    events.push({ tick: note.startTick, kind: 'on', channel, midi: note.midi });
    events.push({
      tick: note.startTick + note.durationTicks,
      kind: 'off',
      channel,
      midi: note.midi,
    });
  }
  events.sort((a, b) => a.tick - b.tick || (a.kind === 'on' ? -1 : 1));

  for (const event of events) {
    pushVarLen(event.tick - lastTick);
    if (event.kind === 'on') {
      trackEvents.push(0x90 | event.channel, event.midi & 0x7f, 0x64);
    } else {
      trackEvents.push(0x80 | event.channel, event.midi & 0x7f, 0x00);
    }
    lastTick = event.tick;
  }

  pushVarLen(0);
  trackEvents.push(0xff, 0x2f, 0x00);

  const trackData = new Uint8Array(trackEvents);
  const header = new Uint8Array([
    0x4d, 0x54, 0x68, 0x64,
    0x00, 0x00, 0x00, 0x06,
    0x00, format,
    0x00, 0x01,
    (ticksPerQuarter >> 8) & 0xff,
    ticksPerQuarter & 0xff,
    0x4d, 0x54, 0x72, 0x6b,
    (trackData.length >> 24) & 0xff,
    (trackData.length >> 16) & 0xff,
    (trackData.length >> 8) & 0xff,
    trackData.length & 0xff,
  ]);

  const file = new Uint8Array(header.length + trackData.length);
  file.set(header, 0);
  file.set(trackData, header.length);
  return file;
}
