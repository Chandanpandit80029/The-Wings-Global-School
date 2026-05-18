import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Base path configuration
  // For root deployment (Vercel, Netlify, Render): use '/'
  // For GitHub Pages subdirectory: use '/repository-name/'
  // Environment variable support: process.env.VITE_BASE_PATH || '/'
  base: process.env.VITE_BASE_PATH || '/',
  
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    // Proxy configuration for local Firebase emulator
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    // Disable sourcemap in production for security
    sourcemap: process.env.NODE_ENV !== 'production',
    // Ensure assets are loaded relative to the base path
    assetsDir: 'assets',
    // Minification and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk sizes
    rollupOptions: {
      output: {
        // Manual chunk configuration for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-animation';
          }
        },
      },
    },
    // Compression settings
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    // Target modern browsers
    target: 'es2020',
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth'],
  },
})