<template>
  <div class="container">
    <div class="fullsize">
      <div class="sidebar">
        <h1>Logs</h1>
        <nuxt-link
          v-for="file of files"
          :key="file"
          :to="`/admin/logs/${file.split('/').join('__')}`"
          v-text="file"
        />
      </div>
      <div class="viewpane">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../../lib/api'

export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const { data: files } = await API.adminGetLogs()
    if (!files) return alert('Aoooyooo. Error! Check console.')
    this.files = files
  },
  data() {
    return {
      files: [],
      content: ''
    }
  },
  head() {
    return {
      title: 'FreeStuff Admin Panel'
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;
  display: block;
}

.fullsize {
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  padding: 10pt;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 10pt;

  & > * {
    background-color: $bg-light;
    border-radius: $box-br;
    overflow-x: hidden;
  }
}

.sidebar {
  h1 {
    margin-bottom: 4pt;
    padding: 10pt 15pt;
    border-bottom: 1px solid $backpage;
  }

  a {
    display: block;
    padding: 5pt 8pt;
    margin: 0 4pt 1pt 4pt;
    color: $color-regular;
    font-family: monospace;
    text-decoration: none;
    border-radius: $content-br;
    transition: background-color .1s ease;

    &.nuxt-link-active { background-color: $backpage; }
    &:hover { background-color: $bg-dark; }
  }
}

</style>
