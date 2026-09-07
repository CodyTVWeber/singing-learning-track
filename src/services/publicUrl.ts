/**
 * Prefix a public-folder path with Vite's base URL.
 * Required for GitHub Pages project sites (e.g. /singing-learning-track/).
 */
export function publicUrl(path: string): string {
  if (!path) return path;
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const trimmed = path.replace(/^\//, '');
  return `${base}${trimmed}`;
}

/** React Router basename derived from Vite `base` (no trailing slash). */
export function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL || '/';
  const trimmed = base.replace(/\/$/, '');
  return trimmed === '' ? undefined : trimmed;
}
