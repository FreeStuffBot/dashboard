<template>
  <div class="container">
    <div class="panel main">
      Loading, please wait
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '~/lib/api'

export default Vue.extend({
  layout: 'blank',
  fetchOnServer: false,
  async fetch() {
    try {
      const { data, status } = await API.authCode(this.$route.params.provider, this.$route.query.code + '')
      if (status !== 200) {
        this.$router.push({ path: '/login' })
        return
      }

      localStorage.setItem('token', data.token)

      this.$store.commit('user/updateUser', data.user)

      // if (data.do_setup) {
      //   this.$router.push({ path: '/callback/setup' })
      //   return
      // }

      this.$router.push({ path: '/' })
    } catch (ex) {
      console.error(ex)
      this.$router.push({ path: '/login' })
    }
  }
})
</script>

<style scoped lang="scss">
</style>
