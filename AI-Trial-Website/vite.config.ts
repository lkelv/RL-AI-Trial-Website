import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// The Cloudflare plugin is only needed for build/deploy (Workers). It requires
// Node >= 22.15.0 (it imports `registerHooks` from `node:module`), so we load it
// lazily — only for `vite build` — to keep local `vite` dev runnable on older Node.
export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [react(), tailwindcss()]

  if (command === 'build') {
    const { cloudflare } = await import('@cloudflare/vite-plugin')
    plugins.push(cloudflare())
  }

  return { plugins }
})
