import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/db_guard': {
        target: 'http://localhost:8083', // 从环境变量中读取后端服务地址，如果未设置则使用默认值
        changeOrigin: true, // 允许跨域
        // pathRewrite: {
        //   '^/db_guard': '' // 重写路径（可选）
        // }
        // rewrite: (path) => path.replace(/^\/api/, '')

      }
    }
  }
})