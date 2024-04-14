import Vue from 'vue';
import VueRouter from 'vue-router';
import StartMenu from '@/components/StartMenue.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'StartMenu',
    component: StartMenu,
  },
  {
    path: '/CityImageExperiment',
    name: 'CityImageExperiment',
    component: () => import(/* webpackChunkName: "CityImageExperiment" */ '@/components/CityImageExperiment.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
