import { describe, expect, it } from 'vitest';
import { publicUrl, routerBasename } from '../publicUrl';

describe('publicUrl', () => {
  it('keeps root-relative public assets when base is /', () => {
    expect(publicUrl('/img/kooka.png')).toBe('/img/kooka.png');
    expect(publicUrl('audio/echo.mp3')).toBe('/audio/echo.mp3');
  });

  it('leaves remote, blob, and data URLs unchanged', () => {
    expect(publicUrl('https://cdn.example/x.png')).toBe('https://cdn.example/x.png');
    expect(publicUrl('blob:http://localhost/abc')).toBe('blob:http://localhost/abc');
    expect(publicUrl('data:image/png;base64,xx')).toBe('data:image/png;base64,xx');
  });
});

describe('routerBasename', () => {
  it('is undefined when the app is served from /', () => {
    expect(routerBasename()).toBeUndefined();
  });
});
