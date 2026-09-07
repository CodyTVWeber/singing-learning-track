import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Alert } from './Alert';
import { NoteHighway } from './NoteHighway';
import { SongScoreCard } from './SongScoreCard';
import { Icon } from './Icon';
import { useSongPerformance } from '../hooks/useSongPerformance';
import { parseMidiToChart, parseSongChartJson } from '../services/midiParser';
import { frequencyToMidiNote, midiNoteToName } from '../services/pitch';
import { expectedMidiAt } from '../services/songScoring';
import { analytics } from '../services/analytics';
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
} from '../theme/theme';
import type { SongChart } from '../models/songChart';

interface SongPerformanceProps {
  chart: SongChart;
  onComplete?: (score: number) => void;
  allowCustomChart?: boolean;
}

const CHART_LOAD_ERROR =
  "Couldn't read that file. Try a Standard MIDI (.mid) or a song chart JSON.";

function formatDuration(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}:${String(seconds).padStart(2, '0')}` : `${seconds}s`;
}

function liveRatingLabel(rating: string | null): string {
  if (!rating) return 'Sing!';
  if (rating === 'perfect') return 'Perfect!';
  if (rating === 'good') return 'Good!';
  if (rating === 'okay') return 'Close!';
  return 'Try again';
}

function isSupportedChartFile(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.json') || lower.endsWith('.mid') || lower.endsWith('.midi');
}

export const SongPerformance: React.FC<SongPerformanceProps> = ({
  chart: initialChart,
  onComplete,
  allowCustomChart = true,
}) => {
  const [chart, setChart] = useState(initialChart);
  const [loadError, setLoadError] = useState<string | null>(null);
  const performance = useSongPerformance(chart);

  const chartMidiRange = useMemo(() => {
    const midis = chart.notes.map((note) => note.midi);
    return {
      min: Math.min(...midis) - 2,
      max: Math.max(...midis) + 2,
    };
  }, [chart.notes]);

  const liveMidi = useMemo(() => {
    if (performance.liveHz == null || performance.liveConfidence < 0.25) return null;
    const expected = expectedMidiAt(chart, performance.currentTimeMs);
    const raw = frequencyToMidiNote(performance.liveHz);
    if (expected != null) {
      return expected + 12 * Math.round((raw - expected) / 12);
    }
    const rounded = Math.round(raw);
    return Math.max(chartMidiRange.min, Math.min(chartMidiRange.max, rounded));
  }, [
    chart,
    chartMidiRange.max,
    chartMidiRange.min,
    performance.currentTimeMs,
    performance.liveConfidence,
    performance.liveHz,
  ]);

  const noteScoresForHighway =
    performance.status === 'singing'
      ? performance.liveScore?.noteScores
      : performance.score?.noteScores;

  useEffect(() => {
    setChart(initialChart);
  }, [initialChart]);

  const handleStart = useCallback(async () => {
    analytics.trackEvent('song_performance_started', { chartId: chart.id });
    await performance.start();
  }, [chart.id, performance]);

  const handleTryAgain = useCallback(() => {
    setLoadError(null);
    performance.reset();
  }, [performance]);

  const handleComplete = useCallback(
    (overall: number) => {
      onComplete?.(overall);
    },
    [onComplete],
  );

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupportedChartFile(file.name)) {
      setLoadError(CHART_LOAD_ERROR);
      event.target.value = '';
      return;
    }

    try {
      if (file.name.toLowerCase().endsWith('.json')) {
        const text = await file.text();
        const parsed = parseSongChartJson(JSON.parse(text));
        setChart(parsed);
      } else {
        const buffer = await file.arrayBuffer();
        const parsed = parseMidiToChart(new Uint8Array(buffer), {
          id: file.name.replace(/\.(mid|midi)$/i, ''),
          title: file.name.replace(/\.(mid|midi)$/i, ''),
        });
        setChart(parsed);
      }
      setLoadError(null);
      performance.reset();
    } catch {
      setLoadError(CHART_LOAD_ERROR);
    } finally {
      event.target.value = '';
    }
  }, [performance]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <Card variant="glass" style={{ padding: spacing.lg }}>
        <h2
          style={{
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: colors.text,
            margin: 0,
            marginBottom: spacing.xs,
          }}
        >
          {chart.title}
        </h2>
        <p style={{ margin: 0, color: colors.textLight, fontSize: fontSize.md }}>
          {formatDuration(chart.durationMs)} · Sing the notes as they reach the line
        </p>
      </Card>

      {loadError && (
        <Alert type="error" title="Could not load file" message={loadError} />
      )}

      {performance.status === 'idle' && (
        <Card variant="elevated" style={{ padding: spacing.lg, textAlign: 'center' }}>
          <p style={{ fontSize: fontSize.lg, color: colors.text, marginBottom: spacing.lg }}>
            Ready to sing? Tap start and follow the note highway.
          </p>
          <Button
            onClick={() => void handleStart()}
            size="large"
            variant="gradient"
            fullWidth
            style={{ minHeight: 44, marginBottom: spacing.md }}
          >
            Start Singing
          </Button>
          {allowCustomChart && (
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.md,
                border: `1px dashed ${colors.secondary}`,
                color: colors.secondary,
                cursor: 'pointer',
                minHeight: 44,
                fontSize: fontSize.sm,
                fontWeight: fontWeight.medium,
              }}
            >
              <Icon name="settings" size={16} />
              Load MIDI or chart (.mid, .json)
              <input
                type="file"
                accept=".mid,.midi,.json"
                onChange={(event) => void handleFileChange(event)}
                style={{ display: 'none' }}
                data-testid="chart-file-input"
              />
            </label>
          )}
        </Card>
      )}

      {performance.status === 'countdown' && (
        <div
          data-testid="countdown-overlay"
          style={{
            position: 'relative',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: borderRadius.lg,
            backgroundColor: colors.beakDark,
          }}
        >
          <span
            style={{
              fontSize: fontSize.huge,
              fontWeight: fontWeight.extrabold,
              color: colors.featherLight,
            }}
          >
            {performance.countdown}
          </span>
        </div>
      )}

      {performance.status === 'singing' && (
        <>
          <NoteHighway
            chart={chart}
            currentTimeMs={performance.currentTimeMs}
            liveMidi={liveMidi}
            noteScores={noteScoresForHighway}
          />
          <Card variant="glass" style={{ padding: spacing.md }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: spacing.md,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: fontSize.sm, color: colors.textLight }}>Detected</div>
                <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text }}>
                  {liveMidi != null ? midiNoteToName(liveMidi) : '—'}
                  {performance.liveCents != null && (
                    <span style={{ marginLeft: spacing.sm, color: colors.secondary }}>
                      {Math.round(performance.liveCents)}¢
                    </span>
                  )}
                </div>
                <div style={{ fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold }}>
                  {liveRatingLabel(performance.liveRating)}
                </div>
              </div>
              <Button onClick={performance.stop} variant="outline" size="large" style={{ minHeight: 44 }}>
                Stop
              </Button>
            </div>
          </Card>
        </>
      )}

      {performance.status === 'error' && (
        <Alert
          type="error"
          title="Microphone needed"
          message={performance.error ?? 'Microphone access is required.'}
        />
      )}

      {performance.status === 'error' && (
        <div style={{ marginTop: spacing.md }}>
          <Button onClick={() => void handleStart()} size="large" style={{ minHeight: 44 }}>
            Retry
          </Button>
        </div>
      )}

      {performance.status === 'finished' && performance.score && (
        <SongScoreCard
          score={performance.score}
          chart={chart}
          onTryAgain={handleTryAgain}
          onComplete={onComplete ? handleComplete : undefined}
        />
      )}
    </div>
  );
};
