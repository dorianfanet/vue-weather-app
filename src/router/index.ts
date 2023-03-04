import Weather from '../views/Weather.vue'
import Home from '../views/Home.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: Home},
  { path: '/:id', name: 'Weather', component: Weather }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})