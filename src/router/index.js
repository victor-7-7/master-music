import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Manage from '@/views/Manage.vue'
import useUserStore from '@/stores/user'
import useModalStore from "@/stores/modal"

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/manage-music', // Изменили путь, был /manage
    name: 'manage',
    component: Manage,
    /*beforeEnter: (to, from) => {
      console.log('beforeEnter Guard', to, from)
    },*/
    /*// ------ Var.2 (old URL path as alias for new path) ---------
    // Путь в адресной строке НЕ изменится на /manage-music, останется /manage
    alias: '/manage',*/
    meta: {
      requiresAuth: true,
    },
  },
  // ------ Var.1 (redirect old URL path) ---------
  // Путь в адресной строке изменится на /manage-music
  {
    path: '/manage',
    // Старая ссылка /manage должна правильно отработать
    redirect: { name: 'manage' },
  },
  // Var.1 более предпочтителен, чем Var.2 с точки зрения поисковой оптимизации
  // сайта для поисковых движков веба.

  // Если ни один из вышеперечисленных путей не подошел под написанный
  // в адресной строке браузера, то перекидываем юзера на домашку
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
]

const router = createRouter({
  // ...Hash... добавляет к адресу суффикс #/
  // history: createWebHashHistory(import.meta.env.BASE_URL),

  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // <-- routes: routes,
  // Активированный (кликнутый) router-link элемент (ссылка) будет
  // оставаться в этом цвете
  linkExactActiveClass: 'text-yellow-500',
})

// https://router.vuejs.org/guide/advanced/navigation-guards.html
// Глобальный navigation guard будет триггериться на каждый route request
router.beforeEach(async (to, from) => {
  console.log('Global Guard', to, from)
  // Если запрашиваемый рут требует авторизованного пользователя
  if (to.meta.requiresAuth) {
    const userStore = useUserStore()
    // И если юзер не авторизован
    console.log('userLoggedIn', userStore.userLoggedIn)
    if (!userStore.userLoggedIn) {
      // Приглашаем юзера залогиниться
      const modalStore = useModalStore()
      modalStore.isOpen = true
      // И кидаем его на домашнюю страницу
      return { name: 'home' }
    }
  }
})

export default router
