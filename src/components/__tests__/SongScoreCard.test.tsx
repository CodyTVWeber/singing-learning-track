import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongScoreCard } from '../SongScoreCard';
import type { SongChart, SongScore } from '../../models/songChart';

const chart: SongChart = {
  id: 'score-card',
  title: 'Score Card Song',
  durationMs: 1000,
  notes: [
    { id: 'n1', midi: 60, startMs: 0, durationMs: 500 },
    { id: 'n2', midi: 62, startMs: 500, durationMs: 500 },
  ],
};

const score: SongScore = {
  overall: 87,
  notesHit: 2,
  notesTotal: 2,
  perfectCount: 1,
  goodCount: 1,
  okayCount: 0,
  missCount: 0,
  averageCentsOff: 12,
  noteScores: [
    {
      noteId: 'n1',
      midi: 60,
      startMs: 0,
      durationMs: 500,
      accuracy: 95,
      rating: 'perfect',
      averageCentsOff: 5,
      voicedRatio: 1,
      hitRatio: 1,
    },
    {
      noteId: 'n2',
      midi: 62,
      startMs: 500,
      durationMs: 500,
      accuracy: 78,
      rating: 'good',
      averageCentsOff: 20,
      voicedRatio: 1,
      hitRatio: 0.8,
    },
  ],
};

describe('SongScoreCard', () => {
  it('shows overall score and hit counts', () => {
    render(<SongScoreCard score={score} chart={chart} onTryAgain={() => {}} />);
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('2/2')).toBeInTheDocument();
  });

  it('fires Try Again callback', () => {
    const onTryAgain = vi.fn();
    render(<SongScoreCard score={score} chart={chart} onTryAgain={onTryAgain} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onTryAgain).toHaveBeenCalledTimes(1);
  });

  it('shows complete button when onComplete provided', () => {
    render(
      <SongScoreCard
        score={score}
        chart={chart}
        onTryAgain={() => {}}
        onComplete={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /save score/i })).toBeInTheDocument();
  });
});
