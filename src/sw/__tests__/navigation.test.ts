import { describe, it, expect } from 'vitest';
import { isNavigationRequest } from '../navigation';

describe('isNavigationRequest', () => {
  it('returns true for navigate mode', () => {
    expect(isNavigationRequest({ mode: 'navigate', destination: '' })).toBe(true);
  });

  it('returns true for document destination', () => {
    expect(isNavigationRequest({ mode: 'same-origin', destination: 'document' })).toBe(true);
  });

  it('returns false for asset requests', () => {
    expect(isNavigationRequest({ mode: 'same-origin', destination: 'script' })).toBe(false);
  });
});
