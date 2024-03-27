import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  //change it to other ip
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:8080',  //change it to other ip
        ws: true
      }
    }
  },
})
