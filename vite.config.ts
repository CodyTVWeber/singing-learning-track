/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function githubPagesBase(): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
  if (env?.GITHUB_PAGES !== 'true') return '/'
  const repo = env.GITHUB_REPOSITORY
  if (!repo) return '/singing-learning-track/'
  const name = repo.split('/')[1]
  if (!name || name.endsWith('.github.io')) return '/'
  return `/${name}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: githubPagesBase(),
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
})
