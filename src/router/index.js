import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue')
  },
  {
    path: '/manager',
    name: 'manager',
    component: () => import('../views/manager.vue')
  },


]

const router = new VueRouter({
  routes
})

export default router
