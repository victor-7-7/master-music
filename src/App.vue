<template>
  <app-header></app-header>

  <router-view></router-view>

    <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center">
      <span class="song-title font-bold">Song Title</span> by
      <span class="song-artist">Artist</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button">
        <i class="fa fa-play text-gray-500 text-xl"></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">00:00</div>
      <!-- Scrub Container  -->
      <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer">
        <!-- Player Ball -->
        <span class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg" style="left: 50%">
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          style="width: 50%"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">03:06</div>
    </div>
  </div>

  <app-auth></app-auth>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppAuth from "@/components/AppAuth.vue";
import { mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'
import { auth } from '@/includes/firebase'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
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
