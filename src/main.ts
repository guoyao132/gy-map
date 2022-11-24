import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.less'
import hljs from 'vue3-hljs'
import "highlight.js/styles/dark.css"

import gyMap from 'gy-map'
import gyUi from 'gy-ui'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(hljs)
app.use(gyMap)
app.use(gyUi)

app.mount('#app')
