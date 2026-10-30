// vitest.config.ts

import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(import.meta.dirname, 'src/components'),
      '@context': path.resolve(import.meta.dirname, 'src/context'),
      '@hooks': path.resolve(import.meta.dirname, 'src/hooks'),
      '@interfaces': path.resolve(import.meta.dirname, 'src/interfaces'),
      '@pages': path.resolve(import.meta.dirname, 'src/pages'),
      '@services': path.resolve(import.meta.dirname, 'src/services'),
      '@utils': path.resolve(import.meta.dirname, 'src/utils'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    pool: 'threads',
    setupFiles: './tests/setupTests.ts',
    css: false,
    maxWorkers: 12,
    server: {
      deps: {
        inline: ['@mui/material'],
      },
    },
  },
});