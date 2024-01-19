<template>
  <Container>
    <h1>Jobruns</h1>

    <Layout v-if="list" name="flow">
      <Admonition v-if="error" type="error" :text="error" />

      <NuxtLink v-for="j of list" :key="j._id" class="jobrun" :to="`/admin/jobruns/${j._id}`">
        <span>Job {{ j._id }} ({{ j.type }})</span>
        <span>Scheduled at {{ new Date(j.scheduledAt).toLocaleString() }} by {{ j.scheduledBy }}</span>
        <span>Ran from {{ new Date(j.startedAt).toLocaleString() }} through {{ new Date(j.endedAt).toLocaleString() }}</span>
        <span>Ran by {{ j.runnerName }} on host {{ j.runnerHost }}</span>
      </NuxtLink>
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../../lib/api'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Tabs from '~/components/layout/Tabs.vue'
import Admonition from '~/components/entities/Admonition.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'

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
    const { data, status, statusText } = await API.adminGetJobruns()
    if (status !== 200) {
      this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
      return
    }

    this.list = data
  },
  data() {
    return {
      error: '',
      list: null as any,
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
.jobrun {
  @include box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  text-decoration: none;

  &:hover {
    background-color: $bg-lighter;
  }

  span {
    text-decoration: none;
    color: $color-regular;
    font-family: $font-regular;
    font-size: 11pt;
  }
}
</style>
