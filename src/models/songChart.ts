export interface MelodyNote {
  id: string;
  midi: number;
  startMs: number;
  durationMs: number;
  lyric?: string;
}

export interface SongChart {
  id: string;
  title: string;
  artist?: string;
  durationMs: number;
  notes: MelodyNote[];
  audioId?: string;
  audioUrl?: string;
  bpm?: number;
}

export interface PitchSample {
  timeMs: number;
  frequencyHz: number | null;
  confidence: number;
}

export type NoteRating = 'perfect' | 'good' | 'okay' | 'miss';

export interface NoteScore {
  noteId: string;
  midi: number;
  startMs: number;
  durationMs: number;
  lyric?: string;
  accuracy: number;
  rating: NoteRating;
  averageCentsOff: number | null;
  voicedRatio: number;
  hitRatio: number;
}

export interface SongScore {
  overall: number;
  notesHit: number;
  notesTotal: number;
  perfectCount: number;
  goodCount: number;
  okayCount: number;
  missCount: number;
  averageCentsOff: number | null;
  noteScores: NoteScore[];
}

export interface ScoringOptions {
  hitCents?: number;
  perfectCents?: number;
  goodCents?: number;
  okayCents?: number;
  minConfidence?: number;
  latencyMs?: number;
  octaveAgnostic?: boolean;
}
