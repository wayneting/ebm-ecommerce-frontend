import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // VITE_USE_MOCK=true 時啟用 mock server（dev 預設啟用）。
  // VITE_USE_MOCK=false 時走真後端，前端 /ECAPI/* 走 server.proxy。
  const useMock = env.VITE_USE_MOCK !== 'false'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      viteMockServe({
        mockPath: 'mock',
        enable: useMock,
        logger: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        // 當 useMock=false 時，/ECAPI/* 透傳到實際後端
        '/ECAPI': {
          target: env.VITE_API_TARGET ?? 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
