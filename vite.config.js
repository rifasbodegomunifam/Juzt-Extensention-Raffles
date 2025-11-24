// juzt-extension-template/vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({

  server: {
    cors: true,
  },
  
  build: {
    
    outDir: 'assets',

   
    rollupOptions: {
      
      input: {
        
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