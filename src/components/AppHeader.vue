<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
          </li>
          <!-- v-else директива не будет работать повторно в li-элементе, поэтому
           нужен template-раппер -->
          <template  v-else>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="manage">Manage</a>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logOut">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import useModalStore from "@/stores/modal";
import useUserStore from '@/stores/user'

export default {
  name: "AppHeader",
  computed: {
    ...mapWritableState(useModalStore, ['isOpen']),
    ...mapWritableState(useUserStore, ['userLoggedIn']),
  },
  methods: {
    // https://pinia.vuejs.org/core-concepts/actions.html
    ...mapActions(useUserStore, ['userSignOut']),

    toggleAuthModal() {
      this.isOpen = !this.isOpen
      console.log(this.isOpen)
    },

    manage() {

    },

    async logOut() {
      await this.userSignOut()
    },
  },
}
</script>

<style scoped>

</style>