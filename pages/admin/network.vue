<template>
  <Container>
    <h1>Network</h1>refresh every 30 seconds


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
        </template>
        <template #Raw>
          <Input :multiline="true" :value="dataString" :editor-heights="[100, 500, 2000]" />
        </template>
      </Tabs>

      <h2>Actions</h2>
      <Layout name="component-flow">
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
            type="green"
            text="Reload Remote Config"
            :disabled="sel"
            @click="command('refetch', [ 'config' ])"
          />
          <Button
            type="green"
            text="Reload Experiments"
            :disabled="sel"
            @click="command('refetch', [ 'experiments' ])"
          />
          <Button
            type="green"
            text="Reload Languages"
            :disabled="sel"
            @click="command('refetch', [ 'cms.languages' ])"
          />
          <Button
            type="green"
            text="Reload Constants"
            :disabled="sel"
            @click="command('refetch', [ 'cms.constants' ])"
          />
          <Button
            type="green"
            text="Update Product List"
            :disabled="sel"
            @click="command('refetch', [ 'api.channel.*' ])"
          />
        </Layout>
        <Layout name="inline">
          <Button
            type="red"
            text="Shutdown"
            :disabled="sel"
            @click="command('shutdown')"
          />
          <Button
            type="red"
            text="Force Shutdown"
            :disabled="sel"
            @click="command('__force_shutdown')"
          />
        </Layout>
      </Layout>
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
import { openErrorModal } from '../../lib/popups'

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
    const { data, status, statusText } = await API.getAdminServices()
    if (status !== 200) {
      this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
      return
    }

    this.data = data
  },
  data() {
    return {
      data: null as any,
      selected: [] as any[],
      error: null as any
    }
  },
  computed: {
    dataString(): string {
      return JSON.stringify(this.data, null, 2)
    },
    sel(): boolean {
      return !this.selected.length
    }
  },
  methods: {
    deselect() {
      this.selected = []
    },
    selectAll() {
      this.selected = this.data.flatMap(g => g.services.map(s => s.id))
    },
    async command(name: string, data?: any) {
      const { data: resData, status } = await API.postAdminServicesCommand({ receivers: this.selected, name, data })

      if (status !== 200) {
        openErrorModal(this.$store, status, resData.error)
        return
      }
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
