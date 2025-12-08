// juzt-extension-template/vite.config.js

import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({

  plugins: [tailwindcss()],

  server: {
    cors: true,
  },
  
  build: {
    
    outDir: 'assets',

   
    rollupOptions: {
      
      input: {
        raffleAdmin:'src/js/raffle.js', 
        script: 'src/js/index.js', 
        style: 'src/css/index.css',
      },

      output: {
        
        assetFileNames: (assetInfo) => {
          
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].[ext]'; 
          }
          
          return '[name].[ext]';
        },
        chunkFileNames: 'js/[name].js',
        entryFileNames: 'js/[name].js'
      },
    },
  },
});