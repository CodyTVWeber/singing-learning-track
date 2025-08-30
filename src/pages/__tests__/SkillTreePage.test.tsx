import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SkillTreePage } from '../SkillTreePage';

vi.mock('../../context/AppContext', () => {
  return {
    useApp: () => ({
      user: {
        id: 'u1',
        name: 'Test User',
        ageGroup: 'kid',
        currentLevel: 1,
        totalPoints: 0,
        streakCount: 1,
        lastStreakDate: null,
      },
      getCompletedLessonIds: () => [],
    }),
  };
});

describe('SkillTreePage', () => {
  it('renders and matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <SkillTreePage />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

