import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
      interval: 1000, // Reduziere Polling-Intervall von default 300ms auf 1000ms
    },
    hmr: {
      overlay: false, // Deaktiviere HMR Overlay für weniger Overhead
    }
  }
})
