<template>
  <h1>This is an About Page</h1>
  <base-button-gen/>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: "AboutComp",
  mounted() {
    console.log('About component mounted')
  },
  unmounted() {
    console.log('About component unmounted')
  },
  activated() {
    console.log('About component activated')
  },
  deactivated() {
    console.log('About component deactivated')
  },
})
</script>

<style scoped>

</style>