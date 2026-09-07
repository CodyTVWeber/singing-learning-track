import React, { useMemo } from 'react';
import { colors, borderRadius, fontSize, fontWeight } from '../theme/theme';
import { midiNoteToName } from '../services/pitch';
import type { MelodyNote, NoteScore, SongChart } from '../models/songChart';

const PLAYHEAD_RATIO = 0.22;
const WINDOW_AHEAD_MS = 3000;
const WINDOW_BEHIND_MS = 800;
const HIGHWAY_HEIGHT = 240;

export function ratingColor(rating: NoteScore['rating']): string {
  switch (rating) {
    case 'perfect':
      return colors.success;
    case 'good':
      return colors.successLight;
    case 'okay':
      return colors.warning;
    case 'miss':
    default:
      return colors.error;
  }
}

interface NoteHighwayProps {
  chart: SongChart;
  currentTimeMs: number;
  liveMidi?: number | null;
  noteScores?: NoteScore[];
  className?: string;
  style?: React.CSSProperties;
}

export const NoteHighway: React.FC<NoteHighwayProps> = ({
  chart,
  currentTimeMs,
  liveMidi = null,
  noteScores,
  className = '',
  style,
}) => {
  const { minMidi, maxMidi, gridMidis } = useMemo(() => {
    const midis = chart.notes.map((n) => n.midi);
    let min = Math.min(...midis);
    let max = Math.max(...midis);
    min -= 2;
    max += 2;
    if (max - min < 12) {
      const center = (min + max) / 2;
      min = Math.floor(center - 6);
      max = Math.ceil(center + 6);
    }

    const grid: number[] = [];
    const startC = Math.floor(min / 12) * 12;
    for (let m = startC; m <= max; m += 1) {
      if (m % 12 === 0) grid.push(m);
    }
    return { minMidi: min, maxMidi: max, gridMidis: grid };
  }, [chart.notes]);

  const scoreByNoteId = useMemo(() => {
    const map = new Map<string, NoteScore>();
    noteScores?.forEach((ns) => map.set(ns.noteId, ns));
    return map;
  }, [noteScores]);

  const windowStart = currentTimeMs - WINDOW_BEHIND_MS;
  const windowEnd = currentTimeMs + WINDOW_AHEAD_MS;
  const windowDuration = WINDOW_BEHIND_MS + WINDOW_AHEAD_MS;

  const timeToX = (timeMs: number, width: number): number => {
    const playheadX = width * PLAYHEAD_RATIO;
    const msPerPx = windowDuration / width;
    return playheadX + (timeMs - currentTimeMs) / msPerPx;
  };

  const midiToY = (midi: number, height: number): number => {
    const range = maxMidi - minMidi || 1;
    const normalized = (midi - minMidi) / range;
    return height - normalized * (height - 16) - 8;
  };

  const noteColor = (note: MelodyNote): string => {
    const endMs = note.startMs + note.durationMs;
    if (note.startMs <= currentTimeMs && currentTimeMs < endMs) {
      return colors.primary;
    }
    if (endMs <= currentTimeMs) {
      const scored = scoreByNoteId.get(note.id);
      if (scored) return ratingColor(scored.rating);
      return colors.gray600;
    }
    return colors.secondaryLight;
  };

  return (
    <div
      data-testid="note-highway"
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: `${HIGHWAY_HEIGHT}px`,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: colors.gray900,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
        }}
      >
        <div
          style={{
            width: '52px',
            flexShrink: 0,
            backgroundColor: colors.beakDark,
            borderRight: `1px solid ${colors.gray700}`,
            position: 'relative',
          }}
        >
          {gridMidis.map((midi) => (
            <div
              key={midi}
              style={{
                position: 'absolute',
                left: 4,
                right: 4,
                top: midiToY(midi, HIGHWAY_HEIGHT) - 8,
                fontSize: fontSize.xxs,
                color: colors.featherLight,
                fontWeight: fontWeight.medium,
              }}
            >
              {midiNoteToName(midi)}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          {gridMidis.map((midi) => (
            <div
              key={`grid-${midi}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: midiToY(midi, HIGHWAY_HEIGHT),
                borderTop: `1px dashed ${colors.gray700}`,
                opacity: 0.5,
              }}
            />
          ))}

          {chart.notes
            .filter((note) => note.startMs + note.durationMs >= windowStart && note.startMs <= windowEnd)
            .map((note) => {
              const left = timeToX(note.startMs, 1000);
              const right = timeToX(note.startMs + note.durationMs, 1000);
              const widthPct = Math.max(0.5, ((right - left) / 1000) * 100);
              const leftPct = (left / 1000) * 100;
              const barHeight = Math.max(14, (HIGHWAY_HEIGHT - 24) / (maxMidi - minMidi + 1));
              return (
                <div
                  key={note.id}
                  data-note-id={note.id}
                  title={note.lyric}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    top: midiToY(note.midi, HIGHWAY_HEIGHT) - barHeight / 2,
                    height: `${barHeight}px`,
                    backgroundColor: noteColor(note),
                    borderRadius: borderRadius.sm,
                    opacity: note.startMs > currentTimeMs ? 0.85 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.35)',
                  }}
                >
                  {note.lyric && (
                    <span
                      style={{
                        fontSize: fontSize.xxs,
                        color: colors.textOnPrimary,
                        whiteSpace: 'nowrap',
                        padding: '0 2px',
                      }}
                    >
                      {note.lyric}
                    </span>
                  )}
                </div>
              );
            })}

          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${PLAYHEAD_RATIO * 100}%`,
              width: '2px',
              backgroundColor: colors.warningLight,
              boxShadow: `0 0 8px ${colors.warning}`,
              zIndex: 2,
            }}
          />

          {liveMidi != null && (
            <div
              data-testid="live-pitch-cursor"
              style={{
                position: 'absolute',
                left: `${PLAYHEAD_RATIO * 100}%`,
                top: midiToY(liveMidi, HIGHWAY_HEIGHT),
                width: '14px',
                height: '14px',
                marginLeft: '-7px',
                marginTop: '-7px',
                borderRadius: borderRadius.round,
                backgroundColor: colors.warningLight,
                border: `2px solid ${colors.surface}`,
                boxShadow: `0 0 10px ${colors.warning}`,
                zIndex: 3,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
