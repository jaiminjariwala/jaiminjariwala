import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    },
    define: {
      'process.env.TWITTER_BEARER_TOKEN': JSON.stringify(env.TWITTER_BEARER_TOKEN),
      'process.env.VITE_TWITTER_USER_ID': JSON.stringify(env.VITE_TWITTER_USER_ID),
    }
  }
})
