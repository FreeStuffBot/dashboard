<template>
  <Container>
    <h1>Configuration</h1>
      <Tabs v-model="activeTab">
        <template #Remote_Config>
          <Layout v-if="config" name="component-flow">
            <Admonition v-if="error" type="error" :text="error" />
            <Input v-model="configStr" :multiline="true" :monospace="true" :editor-heights="[ 100, 400, 600 ]" />
            <span v-if="jsonError" v-text="jsonError" />
            <Layout name="inline">
              <Button :type="hasChanges ? 'green' : 'light'" text="Apply" :disabled="!!jsonError" @click="apply()" />
              <Button v-if="hasChanges" type="red" text="You have unsaved changes!" :lite="true" :disabled="true" />
            </Layout>
          </Layout>
        </template>
        <template #Service_Composition>
          <Layout v-if="config" name="component-flow">
            <Admonition v-if="error" type="error" :text="error" />
            <Input v-model="configStr" :multiline="true" :monospace="true" :editor-heights="[ 100, 400, 600 ]" />
            <span v-if="jsonError" v-text="jsonError" />
            <Layout name="inline">
              <Button :type="hasChanges ? 'green' : 'light'" text="Apply" :disabled="!!jsonError" @click="apply()" />
              <Button v-if="hasChanges" type="red" text="You have unsaved changes!" :lite="true" :disabled="true" />
            </Layout>
          </Layout>
        </template>
      </Tabs>
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

const configMapping = {
  'Remote_Config': 'global',
  'Service_Composition': 'service-composition'
}

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

    const { data, status, statusText } = await API.getAdminConfig(configMapping[this.activeTab])

    if (status !== 200) {
      this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
      this.config = {}
      this.configStr = '{}'
      this.orgConfig = '{}'
      return
    }

    this.error = ''
    this.config = data
    this.configStr = JSON.stringify(data, null, 2)
    this.orgConfig = JSON.stringify(data)
  },
  data() {
    return {
      activeTab: 'Remote_Config',
      configStr: '',
      error: '',
      jsonError: '',
      config: {},
      orgConfig: ''
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
    },
    activeTab(val) {
      this.$nextTick(() => this.$fetch())
    }
  },
  computed: {
    hasChanges() {
      return JSON.stringify(this.config) !== this.orgConfig
    }
  },
  methods: {
    async apply(): Promise<void> {
      const body = this.config
      const { status, statusText } = await API.patchAdminConfig(configMapping[this.activeTab], body)
      openInfoDialogue(this.$store, status === 200 ? 'Saved!' : 'Error!', `${status}: ${statusText}`)
      this.$fetch()
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
