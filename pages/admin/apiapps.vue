<template>
  <div class="container">
    <h1>API Apps</h1>

    <h2>List:</h2>
    <div
      v-for="app of list"
      :key="app.id"
      class="app"
    >
      <img :src="app.avatar" alt="Icon">
      <span class="name" v-text="`${app._id} • ${app.type}`" />
      <div class="rest">
        <span v-for="(line,i) of app.description.split('\n')" :key="i" v-text="line" />
        <span>_____</span>
        <br>
        <span>Webhook URL: {{ app.webhook }}</span>
        <span>Webhook Secret: {{ '*'.repeat(app.webhooksecret.length) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'

export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const { data } = await API.adminGetApps()
    this.list = await Promise.all(data.map(async (d: any) => ({
      ...d,
      avatar: (await API.adminGetUser(d._id))?.data?.avatar
        || ((/^[0-9]/.test(d._id))
          ? 'https://cdn.discordapp.com/embed/avatars/0.png'
          : 'https://management.freestuffbot.xyz/_nuxt/assets/img/logo.png'
        )
    })))
  },
  data() {
    return {
      list: []
    }
  },
  fetchOnServer: false,
  head() {
    return {
      title: 'FreeStuff Admin Panel'
    }
  }
})
</script>

<style scoped lang="scss">
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;
  display: block;
}

.app {
  background-color: $bg-light;
  padding: $box-padding;
  border-radius: $box-br;
  margin-bottom: calc(#{$box-padding} / 2);
  display: grid;
  grid-template: auto auto / auto 1fr;
  grid-template-areas: "icon title" "icon rest";
  column-gap: $box-padding;

  img {
    height: 32pt;
    border-radius: 99pt;
    grid-area: icon;
  }

  .name {
    grid-area: title;
    color: $color-major;
    font-family: $font-major;
    margin-bottom: 2pt;
  }

  .rest {
    grid-area: rest;

    * {
      color: $color-sub;
      font-family: $font-sub;
    }
  }
}

</style>
