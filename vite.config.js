import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/', 
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['firebase']  
    }
  },
  plugins: [react()],
});