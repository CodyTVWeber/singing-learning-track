import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingPage } from '../OnboardingPage';

vi.mock('../../context/AppContext', () => {
  return {
    useApp: () => ({
      setUser: vi.fn(async () => {}),
    }),
  };
});

describe('OnboardingPage', () => {
  it('renders and matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

