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
import API from '../../lib/api'

export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const { data } = await API.adminGetConfig()
    if (!data) return alert('Aoooyooo. Error! Check console.')

    this.config = data
    this.configStr = JSON.stringify(data, null, 2)
  },
  data() {
    return {
      configStr: '',
      error: '',
      config: {}
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
      const { status, statusText } = await API.adminPatchConfig(body)
      alert(`${status}: ${statusText}`)
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

textarea {
  background-color: $bg-bright;
  padding: $box-padding;
  border-radius: $box-br;
  margin: $box-padding/2 0;
  color: $color-major;
  width: 50vw;
}

</style>
