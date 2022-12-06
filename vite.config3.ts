import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import type {ConfigEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
const resolve = (str: string) => {
  return path.resolve(__dirname, str)
}
// @ts-ignore
export default defineConfig(({mode}: ConfigEnv) => {
  let outDir = 'pakMap/lib/v3';
  let name = 'gy-map';
  let entry = resolve('./packages/gy-map/index.ts');
  if(mode === 'sjmap'){
    outDir = 'pakSjMap/lib/v3';
    entry = resolve('./packages/gy-sjmap/index.ts');
    name = 'gy-sjmap';
  }
  console.log(entry);
  console.log(name);
  return {
    base: './',
    plugins: [
      vue(),
    ],
    resolve: {
      resolve: {
        alias: {
          '@': resolve(__dirname)
        }
      },
    },
    build:{
      outDir: outDir,
      lib: {
        entry: entry,
        name: name,
        fileName: (format) => `${name}.${format}.js`,
        formats: ['es', 'cjs', 'umd']
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
        external: ['vue', 'vue-demi'],
        output: {
          globals: {
            vue: 'Vue',
            'vue-demi': 'VueDemi'
          }
        }
      },
    },
    optimizeDeps: {
      exclude: ['vue-demi']
    },
  }
})
