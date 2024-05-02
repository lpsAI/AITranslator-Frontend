import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteImageOptimizer(), 
    chunkSplitPlugin({
      strategy: 'single-vendor',
      customChunk: (args) => {
        let { file } = args;
        if (file.startsWith('src/components/')) {
          file = file.substring(4);
          file = file.replace(/\.[^.$]+$/, '');
          return file;
        }
        return null;
      },
    })],
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': '.jsx',
      },
    },
  },
  build: {
    minify: 'esbuild',
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})
