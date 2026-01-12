import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Temporarily comment this line out for localhost development
  // base: '/ACC/', 

  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});