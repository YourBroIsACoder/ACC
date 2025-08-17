// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // This is the most important line for GitHub Pages.
  // It tells Vite to add "/ACC" in front of all asset paths during the build.
  base: '/ACC/', 

  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
