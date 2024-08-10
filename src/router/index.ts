import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../page/HomeView.vue';
import AboutView from '../page/AboutView.vue';

// Define tus rutas
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  // Agrega otras rutas aquí
];

// Crea el enrutador
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
