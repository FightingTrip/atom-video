import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: path.resolve(__dirname, './src/locales/**'),
      strictMessage: false,
      runtimeOnly: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
  },
  build: {
    outDir: 'dist/build',
    emptyOutDir: true,
    manifest: true,
    target: 'es2022',
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
        if (warning.message?.includes('Big integer literals are not available')) return;
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
      external: ['@faker-js/faker'],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      esmExternals: true,
    },
    chunkSizeWarningLimit: 1600,
  },
  optimizeDeps: {
    exclude: ['@faker-js/faker'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});
