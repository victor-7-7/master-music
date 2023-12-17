import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from './includes/validation'

import './assets/base.css'
import './assets/main.css'

import { auth } from './includes/firebase'

import Icon from "./directives/icon"
import i18n from '@/includes/i18n'
import { registerSW } from 'virtual:pwa-register'

import GlobalComponents from "./includes/_globals"

// Рекомендуется зарегить Service Worker (библиотечка гугла) как можно раньше,
// так как у воркер-процесса отсутствуют хуки
registerSW({
  // Не ждать, пока окно аппы будет загружено
  immediate: true,
})

let app = null
// Мы должны сначала загрузить Firebase Auth service, чтобы знать
// есть ли в local store браузера токен для данного юзера и валиден ли он
auth.onAuthStateChanged(() => {
  // Реагируем только на первый ивент при изменении auth-стейта
  if (!app) {
    // Создаем Vue App после того, как нам стала доступна инфа по аутентификации
    app = createApp(App)
    // Регистрируем плагины
    .use(createPinia())
    .use(router)
    .use(VeeValidatePlugin, /*{ foo: 100 }*/)
    // Регистрируем плагин интернационализации интерфейса
    .use(i18n)
    // Регистрируем глобальные компоненты (base comps)
    .use(GlobalComponents)
    // Регистрируем кастомную директиву. Теперь в темплейте любого компонента
    // мы можем использовать на элементах атрибут v-icon.
    .directive("icon", Icon)
    // Монтируем Vue App в html-элемент с id="app" (в index.html). Этот
    // элемент будет root-контейнером для Vue App.
    .mount('#app')
  }
})
