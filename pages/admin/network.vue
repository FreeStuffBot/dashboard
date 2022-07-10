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
          <AdminNetworkTable :data="data" />
        </template>
        <template #Raw>
          <Input :multiline="true" :value="dataString" :editor-heights="[100, 500, 2000]" />
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

export default Vue.extend({
  components: {
    Admonition,
    Input,
    Container,
    Tabs,
    Layout,
    AdminNetworkCards,
    AdminNetworkTable
  },
  transition: 'slide-down',
  async fetch() {
    const { data, status, statusText } = await API.adminGetServices()
    if (status !== 200) {
      this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
      return
    }

    this.data = data
  },
  data() {
    return {
      data: null as any,
      error: null as any
    }
  },
  computed: {
    dataString(): string {
      return JSON.stringify(this.data, null, 2)
    }
  },
  methods: {
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
