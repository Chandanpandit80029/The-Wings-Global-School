import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // IMPORTANT: Use root base path in development and GitHub Pages base path in production
  base: process.env.NODE_ENV === 'production' ? '/The-Wings-Global-School/' : '/',
  
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure assets are loaded relative to the base path
    assetsDir: 'assets',
  },
})