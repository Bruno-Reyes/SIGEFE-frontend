import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true,
    port: 5173,
    // ⚠️ Permite rutas dinámicas
    historyApiFallback: true,
  },
  
})
