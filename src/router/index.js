import { createRouter, createWebHistory } from 'vue-router'
import home from '../components/componenteHome.vue'
import crearSinFoto from '../components/componenteCrearSinCloudinary.vue' 
import crearConFoto from '../components/componenteCrearConCloudinary.vue'
import verListaObjetos1 from '../components/componenteListaObjetos1.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },

    {
      path:'/crearSinFoto',
      name: 'crearSinFoto',
      component: crearSinFoto
    },

    {
      path: '/crearConFoto',
      name: 'crearConFoto',
      component: crearConFoto
    },

    {
      path: '/verListaObjetos1',
      name: 'verListaObjetos1',
      component: verListaObjetos1
    }
  ]
})

export default router
