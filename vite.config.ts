import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Allow phones and tablets on the same trusted Wi-Fi to preview Mela.
    host: '0.0.0.0',
    port: 5179,
    strictPort: true,
  },
})
