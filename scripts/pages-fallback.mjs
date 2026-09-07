import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

if (process.env.GITHUB_PAGES !== 'true') {
  process.exit(0);
}

const dist = resolve(process.cwd(), 'dist');
const indexHtml = resolve(dist, 'index.html');
if (!existsSync(indexHtml)) {
  console.error('pages-fallback: dist/index.html is missing');
  process.exit(1);
}

copyFileSync(indexHtml, resolve(dist, '404.html'));
writeFileSync(resolve(dist, '.nojekyll'), '');
console.log('pages-fallback: wrote dist/404.html and dist/.nojekyll');
