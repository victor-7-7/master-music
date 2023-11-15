<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- атрибут: exact-active-class="no-active" - видео 12-007 момент 04:25
       чтобы не менять цвет элемента под действием опции linkExactActiveClass.
       значение no-active взято с потолка, но поможет кодеру понять что к чему -->
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        exact-active-class="no-active"
        :to="{ name: 'home', }"
      >Music</router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about', }">About</router-link>
          </li>
          <!-- Navigation Links -->
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
          </li>
          <!-- v-else директива не будет работать повторно в li-элементе, поэтому
           нужен template-раппер -->
          <template  v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage', }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logOut">Logout</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import useModalStore from "@/stores/modal"
import useUserStore from '@/stores/user'

export default {
  name: "AppHeader",
  computed: {
    ...mapWritableState(useModalStore, ['isOpen']),
    ...mapWritableState(useUserStore, ['userLoggedIn']),
    currentLocale() {
      return this.$i18n.locale === "en" ? "En" : "Rus"
    }
  },
  methods: {
    // https://pinia.vuejs.org/core-concepts/actions.html
    ...mapActions(useUserStore, ['userSignOut']),

    toggleAuthModal() {
      this.isOpen = !this.isOpen
      console.log(this.isOpen)
    },

    async logOut() {
      await this.userSignOut()
      // https://router.vuejs.org/guide/
      // Vue is giving access to this.$router as well as the current route
      // as this.$route inside of any component.
      // Vue-движок инжектит рут и рутер в каждый компонент. После разлогинивания
      // если юзер был на странице, требующей аутентификации,
      if (this.$route.meta.requiresAuth) {
        // то выкидываем его на домашнюю страницу сайта.
        this.$router.replace({ name: 'home' })
      }
    },

    changeLocale() {
      // Переключаемся между двумя языками (для простоты)
      this.$i18n.locale = this.$i18n.locale === "en" ? "ru" : "en"
    },
  },
}
</script>

<style scoped>

</style>