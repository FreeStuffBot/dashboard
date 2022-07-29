<template>
  <Container>
    <h1>Internal</h1>
    <h2>Send Command</h2>
    <Layout name="$31">
      <Input v-model="command" />
      <Button type="green" text="Submit" @click="submit()" />
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Tabs from '~/components/layout/Tabs.vue'
import Admonition from '~/components/entities/Admonition.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'
import { openInfoDialogue } from '../../lib/popups'

export default Vue.extend({
  components: {
    Container,
    Layout,
    Tabs,
    Admonition,
    Input,
    Button
  },
  transition: 'slide-down',
  async fetch() {

  },
  data() {
    return {
      command: ''
    }
  },
  methods: {
    async submit(): Promise<void> {
      const { status, statusText } = await API.adminPostInternalCommand(this.command)
      openInfoDialogue(this.$store, status === 200 ? 'Done!' : 'Error!', `${status}: ${statusText}`)
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
</style>
