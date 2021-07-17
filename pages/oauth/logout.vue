<template>
  <div class="container">
    Loading...
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'auth',
  fetchOnServer: false,
  mounted() {
    localStorage.clear()
    this.$router.replace('/login')
  }
})
</script>

<style scoped lang="scss">
</style>
