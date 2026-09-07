import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LessonPage } from '../LessonPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
      isLoading: false,
      updateProgress: vi.fn(async () => {}),
    }),
  };
});

describe('LessonPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

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

  it('does not navigate away on mount with a valid lesson and user', () => {
    render(
      <MemoryRouter initialEntries={["/lesson/echo-introduction"]}>
        <Routes>
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

