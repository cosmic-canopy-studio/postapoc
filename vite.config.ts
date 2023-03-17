import { defineConfig } from 'vite';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import path from 'path';

export default defineConfig({
    base: '/postapoc',
    plugins: [eslintPlugin()],
    server: { host: '0.0.0.0', port: 8000 },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src')
        }
    },
    build: {
        sourcemap: true
    }
});
