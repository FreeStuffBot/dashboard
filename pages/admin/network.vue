<template>
  <Container>
    <h1>Network</h1>

    <Admonition v-if="error" type="error" :text="error" />
    <p v-else-if="!data">
      Loading...
    </p>
    <div v-else>
      <h2>Overview</h2>
      <p>Soon&trade;</p>

      <h2>Services</h2>
      <Tabs>
        <!-- <template #Cards>
          <AdminNetworkCards :data="data" />
        </template> -->
        <template #Table>
          <AdminNetworkTable :data="data" :selected="selected" />

          <Layout name="flow">
            <Layout name="inline">
              <Button
                type="light"
                text="Deselect"
                @click="deselect()"
              />
              <Button
                type="light"
                text="Select all"
                @click="selectAll()"
              />
            </Layout>
            <Layout name="inline">
              <Button
                v-for="cmd of commandsInSelection"
                :key="cmd.name"
                type="green"
                :text="cmd.name"
                :content="cmd.description"
                @click="command(cmd.name)"
                v-tippy
              />
              <Button
                v-if="!commandsInSelection.length && selected.length"
                type="red"
                :disabled="true"
                :lite="true"
                text="Selected services do not support commands"
              />
              <Button
                v-else-if="!commandsInSelection.length"
                type="green"
                :disabled="true"
                :lite="true"
                text="Select a service for options"
              />
            </Layout>
          </Layout>
        </template>
        <template #Raw>
          <Input :multiline="true" :value="dataString" :editor-heights="[100, 500, 2000]" />
        </template>
        <template #Edit_Composition>
          <Layout v-if="config" name="flow">
            <Input v-model="configStr" :multiline="true" :monospace="true" :editor-heights="[ 100, 400, 600 ]" />
            <span v-if="jsonError" v-text="jsonError" />
            <Layout name="inline">
              <Button :type="hasChanges ? 'green' : 'light'" text="Apply" :disabled="!!jsonError" @click="applyComposition()" />
              <Button v-if="hasChanges" type="red" text="You have unsaved changes!" :lite="true" :disabled="true" />
            </Layout>
          </Layout>
        </template>
      </Tabs>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import Admonition from '~/components/entities/Admonition.vue'
import Input from '~/components/entities/Input.vue'
import Container from '~/components/layout/Container.vue'
import Tabs from '~/components/layout/Tabs.vue'
import Layout from '~/components/layout/Layout.vue'
import AdminNetworkCards from '~/components/other/AdminNetworkCards.vue'
import AdminNetworkTable from '~/components/other/AdminNetworkTable.vue'
import Button from '../../components/entities/Button.vue'
import { openConfirmDialogue, openErrorModal, openFormDialogue, openInfoDialogue } from '../../lib/popups'

export default Vue.extend({
  components: {
    Admonition,
    Input,
    Container,
    Tabs,
    Layout,
    AdminNetworkCards,
    AdminNetworkTable,
    Button
  },
  transition: 'slide-down',
  async fetch() {
    this.fetchServices()
    this.fetchConfig()
  },
  data() {
    return {
      data: null as any,
      selected: [] as any[],
      error: null as any,
      configStr: '',
      jsonError: '',
      config: {},
      orgConfig: '',
      reloadTimer: null
    }
  },
  mounted() {
    if (this.reloadTimer)
      clearInterval(this.reloadTimer)
    this.reloadTimer = setInterval(self => self.$fetch(), 30000, this)
  },
  beforeDestroy() {
    if (this.reloadTimer)
      clearInterval(this.reloadTimer)
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
  computed: {
    dataString(): string {
      return JSON.stringify(this.data, null, 2)
    },
    sel(): boolean {
      return !this.selected.length
    },
    hasChanges(): boolean {
      return JSON.stringify(this.config) !== this.orgConfig
    },
    commandsInSelection(): any[] {
      const allServices = this.data.flatMap(group => group.services)
      const instances = allServices
        .filter(s => this.selected.includes(s.id))
        .flatMap(s => s.found)
      for (const service of allServices) {
        for (const instance of service.found) {
          if (instances.some(i => i.id === instance.id))
            continue
          if (this.selected.includes(instance.id))
            instances.push(instance)
        }
      }
      const commands = []
      for (const instance of instances) {
        if (!instance.info?.commands) continue
        for (const command of instance.info.commands) {
          if (commands.some(c => c.name === command.name))
            continue
          commands.push(command)
        }
      }
      return commands
    },
    allCommands(): any[] {
      const instances = this.data
        .flatMap(group => group.services)
        .flatMap(s => s.found)
      const commands = []
      for (const instance of instances) {
        if (!instance.info?.commands) continue
        for (const command of instance.info.commands) {
          if (commands.some(c => c.name === command.name))
            continue
          commands.push(command)
        }
      }
      return commands
    }
  },
  methods: {
    async fetchServices() {
      const { data, status, statusText } = await API.getAdminServices()
      if (status !== 200) {
        this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
        return
      }

      this.data = data
    },
    async fetchConfig() {
      const { data, status, statusText } = await API.getAdminConfig('service-composition')

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
    deselect() {
      this.selected = []
    },
    selectAll() {
      this.selected = this.data.flatMap(g => g.services.map(s => s.id))
    },
    async command(name: string) {
      const command = this.allCommands.find(c => c.name === name)

      let data = {}
      if (command.arguments?.length) {
        data = await openFormDialogue(this.$store, {
          title: `Command ${command.name}`,
          text: command.description,
          inputs: command.arguments.map(arg => ({
            id: arg.name,
            type: (arg.type === 'boolean') ? 'toggle'
              : (arg.type === 'number') ? 'number'
              : 'text',
            label: arg.name,
            placeholder: arg.description,
            array: arg.array,
            enum: arg.enum
          }))
        })
        if (!data) return
      } else {
        const yes = await openConfirmDialogue(this.$store, `Run ${command.name}?`, command.description)
        if (!yes) return
      }

      const { data: resData, status } = await API.postAdminServicesCommand({ receivers: this.selected, name, data })

      if (status !== 200) {
        openErrorModal(this.$store, status, resData.error)
        return
      }
    },
    async applyComposition(): Promise<void> {
      const body = this.config
      const { status, statusText } = await API.patchAdminConfig('service-composition', body)
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
