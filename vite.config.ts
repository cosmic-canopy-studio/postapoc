import { defineConfig } from 'vite';
import path from 'path';

// This helper function returns the resolved absolute path for a given folder
const resolvePath = (folder: string) => path.resolve(__dirname, folder);

export default defineConfig({
  server: {
    port: 4000,
  },
  build: { outDir: 'dist' },
  resolve: {
    alias: {
      '@src': resolvePath('src'),
    },
  },
});
