import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@frontend': resolve(__dirname, './frontend/src'),
      '@backend': resolve(__dirname, './backend/src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./frontend/src/assets/styles/variables.scss";',
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'pinia', 'vue-router'],
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: true,
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['naive-ui'],
        },
      },
    },
  },
});
