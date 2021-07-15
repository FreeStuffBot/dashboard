<template>
  <div class="container">
    <h1>Configuration</h1>

    <textarea v-model="configStr" name="config" cols="50" rows="20" />
    <br>
    <span v-if="error" v-text="error" />
    <br>
    <button
      generic
      small
      class="b3"
      @click="apply()"
    >
      Apply
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  transition: 'slide-down',
  data() {
    return {
      configStr: '',
      error: '',
      config: {}
    }
  },
  async fetch() {
    const { data } = await axios.get('/admin/configapi')
    if (!data) return alert('Aoooyooo. Error! Check console.')

    this.config = data
    this.configStr = JSON.stringify(data, null, 2)
  },
  head() {
    return {
      title: 'FreeStuff Admin Panel'
    }
  },
  watch: {
    configStr(val) {
      try {
        this.config = JSON.parse(val)
        this.error = ''
      } catch (ex) {
        this.error = ex
      }
    }
  },
  methods: {
    async apply() {
      const body = this.config
      const { status, statusText } = await axios.patch('/admin/configapi', body, { validateStatus: null })
      alert(`${status}: ${statusText}`)
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;
  display: block;
}

textarea {
  background-color: $bg-bright;
  padding: $box-padding;
  border-radius: $box-border-radius;
  margin: $box-padding/2 0;
  color: $color-major;
  width: 50vw;
}

</style>
