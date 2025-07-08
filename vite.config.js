import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/RS_Rotation_Creator/',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
});
