// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // We remove the 'base' property from here.
  // It will be provided by the build script.
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});