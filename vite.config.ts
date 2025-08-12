// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // You can keep this if you still need it, otherwise it can be removed.
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});