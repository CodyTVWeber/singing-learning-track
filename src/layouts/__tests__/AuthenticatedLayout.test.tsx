import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthenticatedLayout } from '../AuthenticatedLayout';

const mockUseApp = vi.fn();

vi.mock('../../context/AppContext', () => ({
  useApp: () => mockUseApp(),
}));

describe('AuthenticatedLayout', () => {
  beforeEach(() => {
    mockUseApp.mockReset();
  });

  it('does not redirect home while loading', () => {
    mockUseApp.mockReturnValue({ user: null, isLoading: true });

    render(
      <MemoryRouter initialEntries={['/lesson/echo-introduction']}>
        <Routes>
          <Route
            path="/lesson/:lessonId"
            element={
              <AuthenticatedLayout>
                <div>Lesson content</div>
              </AuthenticatedLayout>
            }
          />
          <Route path="/" element={<div>Home hub</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Home hub')).not.toBeInTheDocument();
    expect(screen.queryByText('Lesson content')).not.toBeInTheDocument();
  });

  it('renders children after load when user is present', () => {
    mockUseApp.mockReturnValue({
      user: { id: 'u1', name: 'Test' },
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/lesson/echo-introduction']}>
        <Routes>
          <Route
            path="/lesson/:lessonId"
            element={
              <AuthenticatedLayout>
                <div>Lesson content</div>
              </AuthenticatedLayout>
            }
          />
          <Route path="/" element={<div>Home hub</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Lesson content')).toBeInTheDocument();
    expect(screen.queryByText('Home hub')).not.toBeInTheDocument();
  });

  it('redirects home after load when no user', () => {
    mockUseApp.mockReturnValue({ user: null, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/skill-tree']}>
        <Routes>
          <Route
            path="/skill-tree"
            element={
              <AuthenticatedLayout>
                <div>Skill tree</div>
              </AuthenticatedLayout>
            }
          />
          <Route path="/" element={<div>Home hub</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home hub')).toBeInTheDocument();
    expect(screen.queryByText('Skill tree')).not.toBeInTheDocument();
  });
});
