import {fileURLToPath, URL} from 'node:url'

import {defineConfig, ConfigEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const AutoImport = require('unplugin-auto-import/vite')
const Components = require('unplugin-vue-components/vite')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')

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
      })
    ],
    resolve: {
      alias: {
        'gy-ui': path.resolve(__dirname, 'packages/gy-ui'),
        'gy-map': path.resolve(__dirname, 'packages/gy-map'),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    },
    build:
      mode === 'map' ?
        {
          outDir: 'lib',
          lib: {
            entry: path.resolve(__dirname, './packages/gy-map/index.ts'),
            name: 'gy-map',
            fileName: (format) => `gy-map.${format}.ts`
          },
          minify: 'terser',
          terserOptions: {
            compress: {
              //生产环境移除console
              drop_console: true,
              drop_debugger: true,
            }
          },
          rollupOptions: {
            external: ['vue'],
            output: {
              globals: {
                vue: 'Vue',
              }
            }
          }
        }
        :  {
          minify: 'terser',
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        }
  }
})
