import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // Dev server only: forwards /api to a deployed backend so a relative
  // VITE_API_BASE_URL works on localhost, which production CORS refuses.
  const proxyTarget = env.VITE_API_PROXY_TARGET

  return {
    plugins: [react(), tailwindcss()],
    server: proxyTarget ? { proxy: { '/api': { target: proxyTarget, changeOrigin: true } } } : undefined,
  }
})
