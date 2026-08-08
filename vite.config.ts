import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // docs/16-Development-Standards.md §70 — split vendor code from
    // app code so the entry chunk stays small and vendor code (which
    // changes far less often than feature code) caches independently.
    // This project's Vite 8 uses the Rolldown bundler, whose
    // manualChunks-equivalent is output.codeSplitting.groups (the
    // older Rollup `manualChunks` option is deprecated/ignored here).
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router)/,
            },
            { name: 'supabase-vendor', test: /node_modules[\\/]@supabase/ },
            { name: 'query-vendor', test: /node_modules[\\/]@tanstack/ },
            {
              name: 'forms-vendor',
              test: /node_modules[\\/](react-hook-form|@hookform|zod)/,
            },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
})
