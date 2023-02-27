import { defineConfig } from 'vite';
// import { ghPages } from 'vite-plugin-gh-pages';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/postapoc',
  plugins: [react(), eslintPlugin()], // ghPages() // uncomment to deploy to gh-pages
  server: { host: '0.0.0.0', port: 8000 }
});
