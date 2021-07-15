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
import axios from 'axios'

export default Vue.extend({
  transition: 'slide-down',
  data() {
    return {
      content: ''
    }
  },
  async fetch() {
    const path = this.$route.params.file
    if (path) {
      const { data: content, statusText } = await axios.get('/admin/logsapi/' + path, { validateStatus: null })
      this.content = content || statusText
    }
  },
  head() {
    return {
      title: 'FreeStuff Admin Panel'
    }
  },
  watch: {
    async '$route.params.file'(path: string) {
      const { data: content, statusText } = await axios.get('/admin/logsapi/' + path, { validateStatus: null })
      this.content = content || statusText
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

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
