// vite.config.js
import { defineConfig } from "vite";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist"
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  preview: {
    port: 4173,
    strictPort: true,
    open: false
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src")
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "assets/*",
          dest: "assets"
        }
      ]
    })
  ]
});
