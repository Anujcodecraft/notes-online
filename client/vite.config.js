import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      // Anything starting with /notes will be proxied to backend
      '/notes': 'http://localhost:3000',
    }
  }
})
