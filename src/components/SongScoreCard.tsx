import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { ratingColor } from './NoteHighway';
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
  gradients,
} from '../theme/theme';
import { midiNoteToName } from '../services/pitch';
import type { SongChart, SongScore } from '../models/songChart';

interface SongScoreCardProps {
  score: SongScore;
  chart: SongChart;
  onTryAgain: () => void;
  onComplete?: (score: number) => void;
}

function headlineForScore(overall: number): string {
  if (overall >= 90) return 'Spectacular!';
  if (overall >= 70) return 'Great singing!';
  if (overall >= 40) return 'Nice try — keep going!';
  return "Let's try that again!";
}

export const SongScoreCard: React.FC<SongScoreCardProps> = ({
  score,
  chart,
  onTryAgain,
  onComplete,
}) => {
  const timelineWidth = chart.durationMs || 1;

  return (
    <Card variant="elevated" style={{ padding: spacing.lg }}>
      <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
        <div
          style={{
            fontSize: fontSize.huge,
            fontWeight: fontWeight.extrabold,
            background: gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}
        >
          {score.overall}%
        </div>
        <p
          style={{
            fontSize: fontSize.xl,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginTop: spacing.sm,
          }}
        >
          {headlineForScore(score.overall)}
        </p>
        <p style={{ fontSize: fontSize.md, color: colors.textLight, marginTop: spacing.xs }}>
          {chart.title}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: spacing.sm,
          marginBottom: spacing.lg,
        }}
      >
        <Stat label="Notes hit" value={`${score.notesHit}/${score.notesTotal}`} />
        <Stat label="Perfect" value={String(score.perfectCount)} accent={colors.success} />
        <Stat label="Good" value={String(score.goodCount)} accent={colors.successLight} />
        <Stat label="Okay" value={String(score.okayCount)} accent={colors.warning} />
        <Stat label="Miss" value={String(score.missCount)} accent={colors.error} />
        {score.averageCentsOff != null && (
          <Stat label="Avg cents off" value={`${Math.round(score.averageCentsOff)}¢`} />
        )}
      </div>

      <div style={{ marginBottom: spacing.lg }}>
        <p
          style={{
            fontSize: fontSize.sm,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.xs,
          }}
        >
          Song timeline
        </p>
        <div
          data-testid="score-timeline"
          style={{
            display: 'flex',
            width: '100%',
            height: '16px',
            borderRadius: borderRadius.pill,
            overflow: 'hidden',
            backgroundColor: colors.gray200,
          }}
        >
          {score.noteScores.map((noteScore) => (
            <div
              key={noteScore.noteId}
              title={`${noteScore.lyric ?? midiNoteToName(noteScore.midi)}: ${noteScore.rating}`}
              style={{
                flex: `${noteScore.durationMs} 0 0`,
                backgroundColor: ratingColor(noteScore.rating),
                minWidth: '2px',
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: fontSize.xxs, color: colors.textLight, marginTop: spacing.xs }}>
          Total length: {Math.round(timelineWidth / 1000)}s
        </p>
      </div>

      {score.noteScores.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: `0 0 ${spacing.lg}`,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xs,
          }}
        >
          {score.noteScores.slice(0, 12).map((noteScore) => (
            <li
              key={`detail-${noteScore.noteId}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: fontSize.sm,
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: borderRadius.sm,
                backgroundColor: colors.gray100,
              }}
            >
              <span style={{ color: colors.text }}>
                {noteScore.lyric ?? midiNoteToName(noteScore.midi)}
              </span>
              <span style={{ color: ratingColor(noteScore.rating), fontWeight: fontWeight.semibold }}>
                {noteScore.rating} ({noteScore.accuracy}%)
              </span>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <Button onClick={onTryAgain} variant="outline" size="large" fullWidth style={{ minHeight: 44 }}>
          Try Again
        </Button>
        {onComplete && (
          <Button
            onClick={() => onComplete(score.overall)}
            variant="gradient"
            size="large"
            fullWidth
            style={{ minHeight: 44 }}
          >
            Save score
          </Button>
        )}
      </div>
    </Card>
  );
};

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.gray200}`,
      }}
    >
      <div style={{ fontSize: fontSize.xs, color: colors.textLight }}>{label}</div>
      <div
        style={{
          fontSize: fontSize.lg,
          fontWeight: fontWeight.bold,
          color: accent ?? colors.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}
