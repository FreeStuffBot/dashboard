<template>
  <Container>
    <h1>Configuration</h1>
    <Layout name="flow">
      <Tabs v-model="activeTab">
        <template #Visual_Editor>
          <Layout v-if="config && config.global" name="flow">
            <!-- <Input v-model="config.global.announcement_message_delay" label="Announcement Message Delay (ms)" /> -->
            <Input v-model="configLocal.global.excessiveLogging" type="toggle" placeholder="Enabled" label="Excessive Logging" />
            <InputEnum
              v-model="configLocal.global.botAdmins"
              label="Bot Admins"
              add="Add User"
              default-value="123456789"
            >
              <template slot-scope="{ value, update, remove }">
                <Layout name="$1a" :tight="true">
                  <Input v-model="value" @input="update" />
                  <Button text="X" type="light" @click="remove" />
                </Layout>
              </template>
            </InputEnum>
          </Layout>
        </template>
        <template #Text_Editor>
          <Layout v-if="config" name="flow">
            <Admonition v-if="error" type="error" :text="error" />
            <Input v-model="configStr" :multiline="true" :monospace="true" :editor-heights="[ 100, 400, 600 ]" />
            <span v-if="jsonError" v-text="jsonError" />
          </Layout>
        </template>
      </Tabs>
      <Layout name="inline">
        <Button :type="hasChanges ? 'green' : 'light'" text="Apply" :disabled="!!jsonError" @click="apply()" />
        <Button v-if="hasChanges" type="red" text="You have unsaved changes!" :lite="true" :disabled="true" />
      </Layout>
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
import InputEnum from '~/components/entities/InputEnum.vue'
import Button from '~/components/entities/Button.vue'
import { openInfoDialogue } from '../../lib/popups'


export default Vue.extend({
  components: {
    Container,
    Layout,
    Tabs,
    Admonition,
    Input,
    InputEnum,
    Button
  },
  transition: 'slide-down',
  async fetch() {
    const { data, status, statusText } = await API.getAdminConfig('global')

    if (status !== 200) {
      this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
      this.config = {}
      this.configLocal = {}
      this.configStr = '{}'
      this.orgConfig = '{}'
      return
    }

    this.error = ''
    this.config = data
    this.configLocal = JSON.parse(JSON.stringify(this.config))
    this.configStr = JSON.stringify(data, null, 2)
    this.orgConfig = JSON.stringify(data)
  },
  data() {
    return {
      activeTab: 'Remote_Config',
      // config as a string
      configStr: '',
      // error with api
      error: '',
      // error parsing json
      jsonError: '',
      // compiled config object
      config: {},
      // copy of the config object to be used for the visual editor
      configLocal: {},
      // stringified copy of the config for detecting changes
      orgConfig: ''
    }
  },
  watch: {
    configStr(val) {
      try {
        this.config = JSON.parse(val)
        this.configLocal = JSON.parse(val)
        this.jsonError = ''
      } catch (ex) {
        this.jsonError = ex + ''
      }
    },
    configLocal: {
      deep: true,
      handler(val) {
        this.configStr = JSON.stringify(val, null, 2)
        this.config = JSON.parse(this.configStr)
      }
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
      const { status, statusText } = await API.patchAdminConfig('global', body)
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
