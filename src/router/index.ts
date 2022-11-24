import { createRouter, createWebHistory } from 'vue-router'
import docs from '../docs'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/GyHome.vue'),
    },
    {
      path: '/GyMap',
      name: 'GyComponents',
      redirect: {name: 'U-Gy-GyMap-Install'},
      component: () => import('@/views/GyMap.vue'),
      children: docs,
    },
  ]
})

export default router
