// vite.config.js
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as path from 'path';

export default defineConfig({
  base: '/postapoc/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'assets/*',
          dest: 'assets',
        },
      ],
    }),
  ],
});
