import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      modernPolyfills: true,
    }),
    VueI18nPlugin({
      include: path.resolve(__dirname, './src/locales/**'),
      strictMessage: false,
      runtimeOnly: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, './node_modules'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.css";`,
      },
    },
  },
  build: {
    outDir: 'dist/build',
    emptyOutDir: true,
    manifest: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_NOT_FOUND') return;
        if (warning.code === 'MISSING_EXPORT') return;
        if (warning.code === 'EMPTY_BUNDLE') return;
        warn(warning);
      },
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: assetInfo => {
          const name = assetInfo.name || '';
          const info = name.split('.');
          let extType = info[info.length - 1];

          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) {
            extType = 'img';
          } else if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            extType = 'fonts';
          } else if (/\.css$/.test(name)) {
            extType = 'css';
          }

          return `${extType}/[name]-[hash][extname]`;
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      esmExternals: true,
    },
    chunkSizeWarningLimit: 1600,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});
