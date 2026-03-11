import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/frontend/setup.js',
    include: ['tests/frontend/**/*.test.{js,jsx}'],
  },
  resolve: {
    alias: {
      'import.meta.env': JSON.stringify({ VITE_API_BASE_URL: 'http://localhost:3000/api' }),
    },
  },
});
