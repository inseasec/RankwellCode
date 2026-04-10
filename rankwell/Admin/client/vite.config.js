import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_PORT) || 5173
  const host = env.VITE_HOST || true

  return {
    // App is served at http://<host>:<port>/admin/ (see BrowserRouter basename in App.jsx)
    base: '/admin',
    plugins: [tailwindcss(), react()],
    server: {
      host,
      port
    }
  }
})
