import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      // Anything starting with /notes will be proxied to backend
      '/notes': import.meta.env.VITE_BASE_URL_BACKEND,
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      // "Cross-Origin-Embedder-Policy": "require-corp",
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    },
  }
})
