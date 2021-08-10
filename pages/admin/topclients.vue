<template>
  <div class="container">
    <h1>Top Clients</h1>

    <h2>List:</h2>
    <div
      v-for="client of list"
      :key="client.id"
      class="server"
      :setup="client.setup"
    >
      <img :src="client.icon || 'https://cdn.discordapp.com/embed/avatars/1.png'" alt="Icon">
      <span class="name" v-text="`${client.name} • ${client.size}`" />
      <span class="rest" v-html="(client.features && client.features.length) ? client.features.map(f => f.replaceAll('_', ' ').toLowerCase()).join('<br>') : '(None)'" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'

export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const { data } = await API.adminGetTopClients()
    this.list = data.sort((a: any, b: any) => b.size - a.size)
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

.server {
  background-color: $bg-bright;
  padding: $box-padding;
  border-radius: $box-border-radius;
  margin-bottom: $box-padding / 2;
  display: grid;
  grid-template: auto auto / auto 1fr;
  grid-template-areas: "icon title" "icon rest";
  column-gap: $box-padding;

  &:not([setup]) { opacity: .5; }

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
    color: $color-sub;
    font-family: $font-sub;
    text-transform: capitalize;
  }
}

</style>
