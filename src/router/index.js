import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'db-table',
      component: () => import('../views/DbTable.vue'),
    },
    {
      path: '/db-config',
      name: 'db-config',
      component: () => import('../views/DbConfig.vue'),
    }
  ],
})

export default router
