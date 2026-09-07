import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProfileSelectPage } from '../ProfileSelectPage';

const mockNavigate = vi.fn();
const mockReloadUser = vi.fn();
const mockSetActiveProfileId = vi.fn();
const mockGetProfiles = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/AppContext', () => ({
  useApp: () => ({ reloadUser: mockReloadUser }),
}));

vi.mock('../../storage/profilesStore', () => ({
  getProfiles: () => mockGetProfiles(),
  setActiveProfileId: (id: string) => mockSetActiveProfileId(id),
}));

vi.mock('../../services/analytics', () => ({
  analytics: { trackEvent: vi.fn() },
}));

describe('ProfileSelectPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockReloadUser.mockReset();
    mockSetActiveProfileId.mockReset();
    mockGetProfiles.mockReset();
    mockReloadUser.mockResolvedValue(undefined);
    mockSetActiveProfileId.mockResolvedValue(undefined);
    mockGetProfiles.mockResolvedValue([
      {
        id: 'profile-1',
        name: 'Alice',
        email: 'alice@example.com',
        ageGroup: 'kid',
        completedLessons: [],
      },
    ]);
  });

  it('hydrates user via reloadUser after selecting a profile', async () => {
    render(
      <MemoryRouter>
        <ProfileSelectPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Alice'));

    await waitFor(() => {
      expect(mockSetActiveProfileId).toHaveBeenCalledWith('profile-1');
      expect(mockReloadUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/skill-tree');
    });

    expect(mockSetActiveProfileId.mock.invocationCallOrder[0])
      .toBeLessThan(mockReloadUser.mock.invocationCallOrder[0]);
    expect(mockReloadUser.mock.invocationCallOrder[0])
      .toBeLessThan(mockNavigate.mock.invocationCallOrder[0]);
  });
});
