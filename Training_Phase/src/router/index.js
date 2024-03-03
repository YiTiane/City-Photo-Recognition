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
    path: '/CityImageCalibration2',
    name: 'CityImageCalibration2',
    component: () => import(/* webpackChunkName: "CityImageCalibration" */ '@/components/CityImageCalibration_10_B.vue')
  },
  {
    path: '/CityImageCalibration5',
    name: 'CityImageCalibration5',
    component: () => import(/* webpackChunkName: "CityImageCalibration" */ '@/components/CityImageCalibration_10_W_NoF.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
