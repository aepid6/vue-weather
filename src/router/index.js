import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/detail/:cityId',
      name: 'Detail',
      component: () => import('@/views/WeatherDetailView.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/WeatherAboutView.vue')
    },
    {
      path: '/cities',
      name: 'Cities',
      component: () => import('@/views/WeatherListView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
})

export default router
