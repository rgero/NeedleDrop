import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('@mui') || id.includes('@emotion') || id.includes('dayjs')) {
            return 'mui';
          }

          if (id.includes('@tanstack')) {
            return 'tanstack';
          }

          if (id.includes('react-router-dom')) {
            return 'router';
          }

          if (id.includes('@supabase')) {
            return 'supabase';
          }

          if (id.includes('recharts')) {
            return 'charts';
          }

          return 'vendor';
        },
      },
    },
  },
})
