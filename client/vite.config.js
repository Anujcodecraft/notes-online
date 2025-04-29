import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // console.log('Backend URL:', env.VITE_BASE_URL_BACKEND);

  return {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/notes': env.VITE_BASE_URL_BACKEND,
      },
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
      },
    },
    build: {
      rollupOptions: {
        external: ['@rollup/rollup-linux-x64-gnu']  // prevent bundling
      }
    }
  };
});