<template>
  <!-- ALERT -->
  <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="reg_show_alert" :class="reg_alert_variant">{{ reg_alert_msg }}</div>

  <!-- Registration Form -->
  <!-- https://vee-validate.logaretm.com/v4/guide/components/validation/ -->
  <!-- По дефолту vee-form компонент сгенерит form тэг -->
  <!-- @submit-триггер от vee-form умеет больше, чем @submit от form-тэга,
   триггер не сработает пока все поля формы не будут валидны -->
  <!-- https://vee-validate.logaretm.com/v4/guide/components/handling-forms#initial-values -->
  <vee-form
    :validation-schema="registerSchema"
    @submit="register"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <!-- По дефолту vee-field компонент сгенерит input тэг -->
      <vee-field
        type="text" name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name"/>
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number" name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age"/>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <!-- Вывод сразу нескольких ошибок, обязательно указать :bails="false" -->
      <vee-field
        name="password" :bails="false" v-slot="{ field, errors }">
        <input type="password" class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" placeholder="Password" v-bind="field"/>
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
      <!--<ErrorMessage class="text-red-600" name="password"/>-->
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password" name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password"/>
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field as="select" name="country"
                 class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country"/>
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field type="checkbox" name="tos" value="1"
                 class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
      <!--<label class="inline-block">Accept terms of service</label>-->
      <i18n-t class="inline-block" keypath="register.accept" tag="label">
        <a style="font-weight: bold" href="#">{{ $t("register.tos") }}</a>
      </i18n-t>
      <ErrorMessage class="text-red-600 block" name="tos"/>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700" :disabled="reg_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
  import { defineComponent } from 'vue'
  import useUserStore from '@/stores/user'
  import { mapActions } from 'pinia'

  export default defineComponent({
    name: "RegisterComp",
    data() {
      return {
        registerSchema: {
          name: 'required|min:3|max:100|alpha_dash',
          email: 'required|min:3|max:100|email',
          age: 'required|min_value:18|max_value:100',
          // Запрещаем юзерам устанавливать пароль в виде password
          password: 'required|min:7|max:100|excluded:password',
          confirm_password: 'passwords_mismatch:@password',
          country: 'required|country_excluded:Antarctica',
          tos: 'tos',
        },
        // Дефолтные значения для полей формы, конкретно - для поля country.
        userData: {
          country: 'USA',
        },
        reg_in_submission: false,
        reg_show_alert: false,
        reg_alert_variant: "bg-blue-500",
        reg_alert_msg: "Please wait! Your account is being created.",
      }
    },

    methods: {
      // https://pinia.vuejs.org/core-concepts/actions.html
      ...mapActions(useUserStore, {
        // Pinia user store action register() conflicts with component method register().
        // Для снятия конфликта имен регистрируем экшен под именем createUser().
        createUser: 'register',
      }),
      async register(values) {
        this.reg_show_alert = true
        this.reg_in_submission = true
        this.reg_alert_variant = "bg-blue-500"
        this.reg_alert_msg = "Please wait! Your account is being created."

        try {
          await this.createUser(values)
        }
        catch (error) {
          this.reg_in_submission = false // Чтобы разблочить кнопку Submit
          this.reg_alert_variant = "bg-red-500"
          this.reg_alert_msg = "An unexpected error occurred. Please try again later."
          console.log(error)
          return
        }
        this.reg_alert_variant = "bg-green-500"
        this.reg_alert_msg = "Success! Your account has been created."
        // Это браузерное DOM API. Method reloads the current URL
        window.location.reload()
      },
    },
  })
</script>

<style scoped>

</style>
