import Vue from 'vue'
import VueRouter from 'vue-router'

import Accueil from '@/views/Accueil'
 // route level code-splitting
// this generates a separate chunk (basket.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const Shopping = () => import(/* webpackChunkName: "shopping" */ '@/views/Shopping')
const Basket = () => import(/* webpackChunkName: "basket" */ '@/views/Basket')
const UnknownURL = () => import(/* webpackChunkName: "404" */ '@/components/base/404')


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil
  },
  {
    path: '/shopping',
    name: 'Shopping',
    component: Shopping
  },
  {
    path: '/myBasket',
    name: 'Basket',
    component: Basket
  },
  {
    path: '/404',
    name: 'Unknown_URL',
    component: UnknownURL
  },
  {
    path: '*',
    redirect: {name: 'Unknown_URL'}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
