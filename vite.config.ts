import { defineConfig } from 'vite';
// import { ghPages } from 'vite-plugin-gh-pages';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

export default defineConfig({
    base: '/postapoc',
    plugins: [react(), eslintPlugin()], // ghPages() // uncomment to deploy to gh-pages
    server: { host: '0.0.0.0', port: 8000 },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@systems': path.resolve(__dirname, 'src/systems'),
            '@entities': path.resolve(__dirname, 'src/entities'),
            '@utilities': path.resolve(__dirname, 'src/utilities')
        }
    },
    build: {
        sourcemap: true
    }
});
