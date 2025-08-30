import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LessonPage } from '../LessonPage';

vi.mock('../../context/AppContext', () => {
  return {
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
    }),
  };
});

describe('LessonPage', () => {
  it('renders and matches snapshot for echo lesson', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={["/lesson/echo-introduction"]}>
        <Routes>
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

