<template>
  <div class="container">
    <span
      v-for="(line, i) of content.split('\n')"
      :key="i"
      v-text="line"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../../lib/api'

export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const path = this.$route.params.file
    if (path) {
      const { data: content, statusText } = await API.adminGetLogFile(path)
      if (typeof content === 'string')
        this.content = content || statusText || 'error'
      else this.content = ''
    }
  },
  data() {
    return {
      content: ''
    }
  },
  watch: {
    async '$route.params.file'(path: string) {
      const { data: content, statusText } = await API.adminGetLogFile(path)
      if (typeof content === 'string')
        this.content = content || statusText || 'error'
      else this.content = ''
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
.container {
  padding: 10pt;
}

span {
  color: white;
  font-family: monospace;
  font-size: 11pt;
  display: block;
}

</style>
