import { createRouter, createWebHistory } from 'vue-router';
import BacktestView from '../views/BacktestView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: BacktestView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
