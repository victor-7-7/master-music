<template>
  <!-- ALERT -->
  <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="login_show_alert" :class="login_alert_variant">{{ login_alert_msg }}</div>

  <!-- Login Form -->
  <vee-form
    :validation-schema="loginSchema"
    @submit="login"
  >
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email"/>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password" name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password"/>
    </div>
    <button
      type="submit" :disabled="login_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
  import { defineComponent } from 'vue'
  import { mapActions, mapWritableState } from 'pinia'
  import useUserStore from '@/stores/user'

  export default defineComponent({
    name: "LoginComp",
    data() {
      return {
        loginSchema: {
          email: 'required|email',
          password: 'required|min:7|max:100',
        },
        login_in_submission: false,
        login_show_alert: false,
        login_alert_variant: "bg-blue-500",
        login_alert_msg: "Please wait! We are logging you in.",
      }
    },
    computed: {
      ...mapWritableState(useUserStore, ['userLoggedIn'])
    },
    methods: {
      // https://pinia.vuejs.org/core-concepts/actions.html
      ...mapActions(useUserStore, ['authenticate']),

      async login(values) {
        this.login_in_submission = true
        this.login_show_alert = true
        this.login_alert_variant = "bg-blue-500"
        this.login_alert_msg = "Please wait! We are logging you in."

        try {
          await this.authenticate(values)
        }
        catch(error) {
          this.login_in_submission = false // Чтобы разблочить кнопку Submit
          this.login_alert_variant = "bg-red-500"
          this.login_alert_msg = "Invalid login details. Please try again."
          console.log(error)
          return
        }
        // Signed in
        this.login_alert_variant = "bg-green-500"
        this.login_alert_msg = "Success! You are now logged in. Welcome home."
        // Это браузерное DOM API. Method reloads the current URL
        window.location.reload()

        /*signInWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential) => {
            // Signed in
            this.userLoggedIn = true
            this.login_alert_variant = "bg-green-500"
            this.login_alert_msg = "Success! You are now logged in. Welcome home."
            console.log('SING IN', userCredential)
          })
          .catch((error) => {
            this.login_in_submission = false // Чтобы разблочить кнопку Submit
            this.login_alert_variant = "bg-red-500"
            this.login_alert_msg = "An unexpected error occurred. Please try again later."
            console.log(error)
          })*/
      },
    },
  })
</script>

<style scoped>

</style>
