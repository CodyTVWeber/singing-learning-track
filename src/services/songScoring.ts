import {
  centsOff,
  frequencyToMidiNote,
  midiNoteToFrequency,
} from './pitch';
import type {
  MelodyNote,
  NoteRating,
  NoteScore,
  PitchSample,
  ScoringOptions,
  SongChart,
  SongScore,
} from '../models/songChart';

const DEFAULT_OPTIONS: Required<ScoringOptions> = {
  hitCents: 50,
  perfectCents: 25,
  goodCents: 50,
  okayCents: 100,
  minConfidence: 0.25,
  latencyMs: 80,
  octaveAgnostic: true,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function resolveOptions(options?: ScoringOptions): Required<ScoringOptions> {
  return { ...DEFAULT_OPTIONS, ...options };
}

function targetHzForComparison(
  sungHz: number,
  targetMidi: number,
  octaveAgnostic: boolean,
): number {
  if (!octaveAgnostic) {
    return midiNoteToFrequency(targetMidi);
  }
  const sungMidi = frequencyToMidiNote(sungHz);
  const targetRef = targetMidi + 12 * Math.round((sungMidi - targetMidi) / 12);
  return midiNoteToFrequency(targetRef);
}

function ratingFromAccuracy(accuracy: number, voicedRatio: number): NoteRating {
  if (voicedRatio === 0) return 'miss';
  if (accuracy >= 90) return 'perfect';
  if (accuracy >= 70) return 'good';
  if (accuracy >= 40) return 'okay';
  return 'miss';
}

export function getActiveNote(chart: SongChart, timeMs: number): MelodyNote | null {
  for (const note of chart.notes) {
    if (timeMs >= note.startMs && timeMs < note.startMs + note.durationMs) {
      return note;
    }
  }
  return null;
}

export function expectedMidiAt(chart: SongChart, timeMs: number): number | null {
  return getActiveNote(chart, timeMs)?.midi ?? null;
}

export function scoreSong(
  chart: SongChart,
  samples: PitchSample[],
  options?: ScoringOptions,
): SongScore {
  const opts = resolveOptions(options);
  const sortedSamples = [...samples].sort((a, b) => a.timeMs - b.timeMs);

  if (chart.notes.length === 0) {
    return {
      overall: 0,
      notesHit: 0,
      notesTotal: 0,
      perfectCount: 0,
      goodCount: 0,
      okayCount: 0,
      missCount: 0,
      averageCentsOff: null,
      noteScores: [],
    };
  }

  const noteScores: NoteScore[] = [];
  let totalWeightedAccuracy = 0;
  let totalDuration = 0;
  let voicedCentsSum = 0;
  let voicedCentsCount = 0;

  for (const note of chart.notes) {
    const windowStart = note.startMs;
    const windowEnd = note.startMs + note.durationMs;
    const noteSamples = sortedSamples.filter((sample) => {
      const adjustedTime = sample.timeMs - opts.latencyMs;
      return adjustedTime >= windowStart && adjustedTime < windowEnd;
    });

    const sampleCount = noteSamples.length;
    let hitCount = 0;
    let perfectishCount = 0;
    let voicedCount = 0;
    let centsSum = 0;

    for (const sample of noteSamples) {
      const { frequencyHz, confidence } = sample;
      if (frequencyHz == null || confidence < opts.minConfidence) {
        continue;
      }

      voicedCount += 1;
      const targetHz = targetHzForComparison(frequencyHz, note.midi, opts.octaveAgnostic);
      const cents = centsOff(frequencyHz, targetHz);
      const absCents = Math.abs(cents);
      centsSum += absCents;
      voicedCentsSum += absCents;
      voicedCentsCount += 1;

      if (absCents <= opts.hitCents) {
        hitCount += 1;
      }
      if (absCents <= opts.goodCents) {
        perfectishCount += 1;
      }
    }

    const voicedRatio = sampleCount > 0 ? voicedCount / sampleCount : 0;
    const hitRatio = sampleCount > 0 ? hitCount / sampleCount : 0;
    const perfectishRatio = sampleCount > 0 ? perfectishCount / sampleCount : 0;

    const accuracy =
      sampleCount === 0
        ? 0
        : clamp(Math.round(100 * (0.7 * hitRatio + 0.3 * perfectishRatio)), 0, 100);

    const rating = ratingFromAccuracy(accuracy, voicedRatio);
    const averageCentsOff = voicedCount > 0 ? centsSum / voicedCount : null;

    noteScores.push({
      noteId: note.id,
      midi: note.midi,
      startMs: note.startMs,
      durationMs: note.durationMs,
      lyric: note.lyric,
      accuracy,
      rating,
      averageCentsOff,
      voicedRatio,
      hitRatio,
    });

    totalWeightedAccuracy += accuracy * note.durationMs;
    totalDuration += note.durationMs;
  }

  const overall = totalDuration > 0 ? Math.round(totalWeightedAccuracy / totalDuration) : 0;

  let perfectCount = 0;
  let goodCount = 0;
  let okayCount = 0;
  let missCount = 0;
  let notesHit = 0;

  for (const ns of noteScores) {
    if (ns.rating === 'perfect') perfectCount += 1;
    else if (ns.rating === 'good') goodCount += 1;
    else if (ns.rating === 'okay') okayCount += 1;
    else missCount += 1;

    if (ns.rating !== 'miss') notesHit += 1;
  }

  return {
    overall,
    notesHit,
    notesTotal: chart.notes.length,
    perfectCount,
    goodCount,
    okayCount,
    missCount,
    averageCentsOff: voicedCentsCount > 0 ? voicedCentsSum / voicedCentsCount : null,
    noteScores,
  };
}
