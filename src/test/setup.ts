import '@testing-library/jest-dom';

// Polyfills and test environment guards for browser APIs used in components
// localStorage mock
if (typeof window !== 'undefined' && !('localStorage' in window)) {
  // @ts-ignore - define minimal localStorage for tests
  window.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null as any,
    length: 0,
  } as any;
}

// Service worker stubs used in src/main.tsx
if (typeof navigator !== 'undefined' && !("serviceWorker" in navigator)) {
  // @ts-ignore
  navigator.serviceWorker = {
    register: async () => ({ scope: '/' }),
  } as any;
}

// Audio and mediaDevices stubs to prevent runtime errors in tests
if (typeof navigator !== 'undefined' && !navigator.mediaDevices) {
  // @ts-ignore
  navigator.mediaDevices = {
    getUserMedia: async () => {
      throw new Error('getUserMedia not available in tests');
    },
  } as any;
}

// Minimal HTMLMediaElement.play/pause stubs
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  // @ts-ignore
  value: async function play() { return; },
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  // @ts-ignore
  value: function pause() { return; },
});

// jsdom does not implement layout; guard getBoundingClientRect uses
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function () {
  const rect = originalGetBoundingClientRect.call(this);
  if (rect.width === 0 && rect.height === 0) {
    return { ...rect, width: 100, height: 20 } as DOMRect;
  }
  return rect;
};

