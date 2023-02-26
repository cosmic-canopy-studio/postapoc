import { defineConfig } from 'vite';
import { ghPages } from 'vite-plugin-gh-pages';
import eslintPlugin from '@nabla/vite-plugin-eslint';

export default defineConfig({
  base: '/postapoc',
  plugins: [ghPages(), eslintPlugin()],
  server: { host: '0.0.0.0', port: 8000 }
});
