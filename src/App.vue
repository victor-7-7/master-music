<template>
  <app-header></app-header>

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player></app-player>

  <app-auth></app-auth>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppAuth from "@/components/AppAuth.vue";
import AppPlayer from "@/components/Player.vue"
import { mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'
import { auth } from '@/includes/firebase'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  // Эта life cycle функция вызывается сразу после создания компонента
  created() {
    // Firebase Auth service уже был загружен в main.js.
    // currentUser - the currently signed-in user (or null)
    if (auth.currentUser) {
      // В течение ограниченного предшествующего периода данный юзер (открывающий
      // это приложение в браузере) мог залогиниться в этом браузере. В процессе
      // аутентификации firebase auth сервис сохраняет токен auth-юзера на клиенте
      // (в local store браузера). В тулзах браузера на вкладке Application по пути
      // Storage/indexedDB/firebaseLocalStorageDb в таблице можно найти запись
      // { fbase_key: '<token>', value: {...<auth info>}}. Все эти данные можно
      // удалить из браузера, нажав в боковой панели Storage и затем в окошке
      // нажав кнопку Clear site data.
      // Если firebase auth нам сообщил, что юзер, который открывает
      // это приложение в браузере, является залогиненным, то ставим в true
      // соответствующее стейт-свойство во вьюшной базе pinia.
      this.userLoggedIn = true
    }
  }
}
</script>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
