import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000, // in kB
  },

  // Base public path
  base: '/',
  
  // Development server configuration
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true, // Critical for BrowserRouter
  },

  // Preview configuration (for 'vite preview' command)
  preview: {
    port: 3000,
    strictPort: true,
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src', // Setup path aliases
      '@components': '/src/components',
      '@pages': '/src/pages',
    },
  },

  // CSS configuration
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});