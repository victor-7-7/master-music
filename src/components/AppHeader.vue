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
          <li>
            <a class="px-2 text-white" href="#" v-if="userLoggedIn" @click.prevent="logOut">Logout</a>
            <a class="px-2 text-white" href="#" v-else @click.prevent="toggleAuthModal">Login / Register</a>
          </li>
          <li>
            <a class="px-2 text-white" href="#">Manage</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapWritableState } from 'pinia'
import useModalStore from "@/stores/modal";
import useUserStore from '@/stores/user'
import { auth, signOut } from '@/includes/firebase'

export default {
  name: "AppHeader",
  computed: {
    ...mapWritableState(useModalStore, ['isOpen']),
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  methods: {
    toggleAuthModal() {
      this.isOpen = !this.isOpen
      console.log(this.isOpen)
    },
    logOut() {
      signOut(auth)
      this.userLoggedIn = false
      console.log(this.userLoggedIn)
    },
  },
}
</script>

<style scoped>

</style>