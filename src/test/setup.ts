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

// Deterministic randomness for stable snapshots
// Simple seeded PRNG (Mulberry32)
const PRNG_SEED = 0x12345678;
let prngState = PRNG_SEED;

function seededRandom() {
  // Mulberry32 algorithm
  prngState |= 0;
  prngState = (prngState + 0x6D2B79F5) | 0;
  let t = Math.imul(prngState ^ (prngState >>> 15), 1 | prngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function resetSeed() {
  prngState = PRNG_SEED;
}

// Save original in case a test needs it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const originalMathRandom: any = Math.random;
Math.random = () => seededRandom();

// Ensure deterministic results per test
// Vitest globals are enabled; beforeEach is available
// Reset the seed before each test so test order does not affect snapshots
// @ts-ignore - beforeEach provided by Vitest globals
beforeEach(() => {
  resetSeed();
});

// Provide deterministic crypto.getRandomValues for libraries like uuid
// Use the same seeded source so it's stable across runs
// @ts-ignore
if (typeof globalThis.crypto === 'undefined') {
  // @ts-ignore
  globalThis.crypto = {};
}
// Preserve any existing crypto properties
// @ts-ignore
const originalGetRandomValues = globalThis.crypto.getRandomValues?.bind(globalThis.crypto);
// @ts-ignore
globalThis.crypto.getRandomValues = (array: Uint8Array | Uint16Array | Uint32Array) => {
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(seededRandom() * 256);
  }
  return array;
};

