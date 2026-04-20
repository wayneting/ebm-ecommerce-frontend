import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // dev 預設啟用 mock，prod 預設關閉。
  // 要反向：在 .env.local 設 VITE_USE_MOCK 覆寫。
  const enableMock = env.VITE_USE_MOCK !== 'false'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      // vite-plugin-mock 只在 dev server 生效（middleware 攔截）。
      // production build 不會 inject 任何 mock 程式碼，打真 API。
      viteMockServe({
        mockPath: 'mock',
        enable: enableMock,
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
        '/ECAPI': {
          target: env.VITE_API_TARGET ?? 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
