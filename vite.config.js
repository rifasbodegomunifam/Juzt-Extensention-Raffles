// juzt-extension-template/vite.config.js

import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({

  plugins: [tailwindcss({
    content: [
      './**/*.{php,twig}',
      './src/**/*.js',
    ]
  })],

  server: {
    cors: true,
  },

  base: '/wp-content/plugins/juzt-extensention-raffles/assets/',

  build: {

    outDir: 'assets',
    assetsDir: '.',
    cssCodeSplit: true,


    rollupOptions: {

      input: {
        index: 'src/js/index.js',
        raffleAdmin: 'src/js/raffle.js',
        raffleDetail: 'src/js/raffle-detail.js',
        rafflePayment: 'src/js/raffle-payment-page.js',
      },

      output: {

        assetFileNames: (assetInfo) => {
          const names = assetInfo.names || [];

          // Debug: ver qué está pasando
          if (names.length > 0 && names[0]?.endsWith('.css')) {
             // ← Agrega esto
          }

          // Mantener las banderas en img/
          if (/flags.*\.png$/.test(assetInfo.name)) {
              return 'img/[name][extname]';
          }

          const name = names[0] || assetInfo.name;
          if (name?.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
        chunkFileNames: 'js/[name].js',
        entryFileNames: 'js/[name].js'
      },
    },
  },
});