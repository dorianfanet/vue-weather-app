import Home from '../views/Home.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/:id', name: 'Home', component: Home }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})