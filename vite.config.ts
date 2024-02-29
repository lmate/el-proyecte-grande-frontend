import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://10.44.11.25:8080',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://10.44.11.25:8080',
        ws: true
      }
    }
  },
})
