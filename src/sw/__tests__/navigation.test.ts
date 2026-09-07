import { describe, it, expect } from 'vitest';
import {
  createAppShellResponse,
  isNavigationRequest,
  shouldUseNetworkNavigationResponse,
} from '../navigation';

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

describe('shouldUseNetworkNavigationResponse', () => {
  it('returns true for an OK response on the same path', () => {
    expect(
      shouldUseNetworkNavigationResponse(
        { ok: true, redirected: false, url: 'https://example.com/skill-tree' },
        'https://example.com/skill-tree'
      )
    ).toBe(true);
  });

  it('returns false when the response was redirected', () => {
    expect(
      shouldUseNetworkNavigationResponse(
        { ok: true, redirected: true, url: 'https://example.com/' },
        'https://example.com/skill-tree'
      )
    ).toBe(false);
  });

  it('returns false when the final URL path differs from the request', () => {
    expect(
      shouldUseNetworkNavigationResponse(
        { ok: true, redirected: false, url: 'https://example.com/' },
        'https://example.com/lesson/echo-introduction'
      )
    ).toBe(false);
  });

  it('returns false for non-OK responses', () => {
    expect(
      shouldUseNetworkNavigationResponse(
        { ok: false, redirected: false, url: 'https://example.com/skill-tree' },
        'https://example.com/skill-tree'
      )
    ).toBe(false);
  });
});

describe('createAppShellResponse', () => {
  it('returns a 200 HTML response for shell content', async () => {
    const response = createAppShellResponse('<html><body>app</body></html>');

    expect(response).not.toBeNull();
    expect(response!.status).toBe(200);
    expect(response!.headers.get('Content-Type')).toBe('text/html');
    await expect(response!.text()).resolves.toBe('<html><body>app</body></html>');
  });

  it('returns null when shell content is missing', () => {
    expect(createAppShellResponse(null)).toBeNull();
    expect(createAppShellResponse('')).toBeNull();
  });
});
