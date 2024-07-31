import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/randombook/',  // Nombre del repositorio en GitHub
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
});