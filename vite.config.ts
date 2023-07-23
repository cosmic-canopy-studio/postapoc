// vite.config.js
import * as path from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/postapoc',
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
