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
  layout: 'fullscreen',
  fetchOnServer: false,
  async fetch() {
    try {
      const { data, status } = await API.authCode(this.$route.params.provider, this.$route.query.code + '')
      if (status !== 200) {
        this.$router.push({ path: '/login' })
        return
      }

      localStorage.setItem('token', data.token)

      this.$store.commit('updateUser', data.user)

      // if (data.do_setup) {
      //   this.$router.push({ path: '/callback/setup' })
      //   return
      // }

      this.$router.push({ path: '/' })
    } catch (ex) {
      this.$router.push({ path: '/login' })
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: grid;
  column-gap: 20pt;
  grid-template-columns: 1fr;
  grid-template-areas: "main";
}

.panel {
  height: 100%;
  background-color: $bg-bright;
  border-radius: 5pt;
  padding: 10pt;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: $color-sub;

  &.main { grid-area: main; }

  * { flex-shrink: 0; }
}
</style>
