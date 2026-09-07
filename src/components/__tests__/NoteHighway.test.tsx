import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoteHighway } from '../NoteHighway';
import type { SongChart } from '../../models/songChart';

const chart: SongChart = {
  id: 'highway',
  title: 'Highway Test',
  durationMs: 1500,
  notes: [
    { id: 'a', midi: 60, startMs: 0, durationMs: 500, lyric: 'la' },
    { id: 'b', midi: 62, startMs: 500, durationMs: 500, lyric: 'li' },
    { id: 'c', midi: 64, startMs: 1000, durationMs: 500 },
  ],
};

describe('NoteHighway', () => {
  it('renders note-highway test id', () => {
    render(<NoteHighway chart={chart} currentTimeMs={250} />);
    expect(screen.getByTestId('note-highway')).toBeInTheDocument();
  });

  it('renders a bar per note', () => {
    render(<NoteHighway chart={chart} currentTimeMs={250} />);
    expect(document.querySelector('[data-note-id="a"]')).toBeTruthy();
    expect(document.querySelector('[data-note-id="b"]')).toBeTruthy();
    expect(document.querySelector('[data-note-id="c"]')).toBeTruthy();
  });

  it('shows lyrics when provided', () => {
    render(<NoteHighway chart={chart} currentTimeMs={100} />);
    expect(screen.getByText('la')).toBeInTheDocument();
    expect(screen.getByText('li')).toBeInTheDocument();
  });
});
