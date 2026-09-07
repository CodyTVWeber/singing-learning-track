import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SingAlongPage } from '../SingAlongPage';

vi.mock('../../context/AppContext', () => ({
  useApp: () => ({
    user: {
      id: 'u1',
      name: 'Test User',
      ageGroup: 'kid',
      currentLevel: 1,
      totalPoints: 0,
      streakCount: 0,
      lastStreakDate: null,
    },
    updateProgress: vi.fn(async () => {}),
    getCompletedLessonIds: () => [],
  }),
}));

describe('SingAlongPage', () => {
  it('renders picker with bundled chart titles', () => {
    render(
      <MemoryRouter initialEntries={['/sing']}>
        <Routes>
          <Route path="/sing" element={<SingAlongPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Twinkle Twinkle Little Star')).toBeInTheDocument();
    expect(screen.getByText('Happy Birthday')).toBeInTheDocument();
  });
});
