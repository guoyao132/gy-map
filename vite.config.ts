import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import type {ConfigEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import compressPlugin from 'vite-plugin-compression';

const AutoImport = require('unplugin-auto-import/vite')
const Components = require('unplugin-vue-components/vite')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')

const resolve = (str: string) => {
  return path.resolve(__dirname, str)
}
// https://vitejs.dev/config/
export default defineConfig(({mode}: ConfigEnv) => {
  return {
    base: './',
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      compressPlugin({
        ext: '.gz',
        deleteOriginFile: false, // 是否删除原始文件
      })
    ],
    resolve: {
      alias: {
        'gy-ui': resolve('packages/gy-ui'),
        'gy-map': resolve('packages/gy-map'),
        'gy-sjmap': resolve('packages/gy-sjmap'),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    },
    build:{
      minify: 'terser',
      chunkSizeWarningLimit: 2000,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      exclude: ['vue-demi']
    },
  }
})
