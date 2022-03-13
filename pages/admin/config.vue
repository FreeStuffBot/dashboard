<template>
  <Container>
    <h1>Configuration</h1>

    <Admonition v-if="error" type="error" :text="error" />
    <Layout v-if="config" name="component-flow">
      <Input v-model="configStr" :multiline="true" :editor-heights="[ 100, 400, 600 ]" />
      <span v-if="jsonError" v-text="jsonError" />
      <Layout name="inline">
        <Button type="green" text="Apply" @click="apply()" />
      </Layout>
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Admonition from '~/components/entities/Admonition.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Container,
    Layout,
    Admonition,
    Input,
    Button
  },
  transition: 'slide-down',
  async fetch() {
    const { data, status, statusText } = await API.getAdminConfig()
    if (status !== 200) {
      this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
      return
    }

    this.config = data
    this.configStr = JSON.stringify(data, null, 2)
  },
  data() {
    return {
      configStr: '',
      error: '',
      jsonError: '',
      config: {}
    }
  },
  watch: {
    configStr(val) {
      try {
        this.config = JSON.parse(val)
        this.jsonError = ''
      } catch (ex) {
        this.jsonError = ex + ''
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
</style>
