import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SongPerformance } from '../SongPerformance';
import type { SongChart } from '../../models/songChart';

const chart: SongChart = {
  id: 'perf',
  title: 'Performance Test',
  durationMs: 1000,
  notes: [{ id: 'n1', midi: 60, startMs: 0, durationMs: 1000 }],
};

describe('SongPerformance', () => {
  it('shows Start Singing in idle state', () => {
    render(<SongPerformance chart={chart} />);
    expect(screen.getByRole('button', { name: /start singing/i })).toBeInTheDocument();
  });

  it('shows chart file input when custom charts allowed', () => {
    render(<SongPerformance chart={chart} allowCustomChart />);
    expect(screen.getByTestId('chart-file-input')).toBeInTheDocument();
  });

  it('displays chart title and instructions', () => {
    render(<SongPerformance chart={chart} />);
    expect(screen.getByText('Performance Test')).toBeInTheDocument();
    expect(screen.getByText(/sing the notes as they reach the line/i)).toBeInTheDocument();
  });
});
