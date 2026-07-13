import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Проект публикуется на GitHub Pages в подпапке /hexlet-vibecoding/
  base: '/hexlet-vibecoding/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
