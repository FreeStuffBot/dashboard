<template>
  <Container>
    <div v-if="!prod">
      <p v-text="error || 'Loading...'" />
    </div>
    <div v-else>
      <h1 v-text="prod.data.title || ':)'" />
      <h2>General Information</h2>
      <Layout name="component-flow">
        <Input v-model="prod.data.title" label="Title" />
        <Input v-model="prod.data.urls.org" label="URL" />
        <Layout name="2static">
          <Input v-model="prod.data.type" label="Type" :options="dropdowns.type" />
          <Input v-model="prod.data.kind" label="Kind" :options="dropdowns.kind" />
        </Layout>
        <Layout name="2static">
          <Input v-model="broker.until" type="datetime-local" label="Until" :min="new Date().toISOString().split('T')[0]+'T00:00'" />
        </Layout>
      </Layout>
      <h2>Product Details</h2>
      <Layout name="component-flow">
        <Input v-model="prod.data.description" label="Description" :multiline="true" />
        <Layout name="2static">
          <Input v-model="prod.data.platform" label="Platform" :options="[]" />
          <Input v-model="broker.rating" label="Rating (0-100)" placeholder="69" />
        </Layout>
        <Input v-model="broker.tags" label="Tags (Comma Separated)" placeholder="Single Player, Co-Op, wait that doesnt make sense" />
      </Layout>
      <h2>Pricing</h2>
      <Layout name="component-flow">
        <!-- Add Prices -->
      </Layout>
      <h2>Assets</h2>
      <Layout name="component-flow">
        <!-- Thumbnail -->
      </Layout>
      <h2>Metadata</h2>
      <Layout name="component-flow">
        <!-- Flags -->
        <!-- Store Meta (subids) -->
      </Layout>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Input from '~/components/entities/Input.vue'

const dropdowns = {
  kind: [
    { value: 'game', label: 'Game' },
    { value: 'dlc', label: 'DLC' },
    { value: 'software', label: 'General Software' },
    { value: 'art', label: 'Artwork (Digital)' },
    { value: 'ost', label: 'OST / Soundtrack' },
    { value: 'book', label: 'Book / EBook' },
    { value: 'other', label: 'Other' }
  ],
  type: [
    { value: 'free', label: 'Free to keep' },
    { value: 'weekend', label: 'Free to play (weekend)' },
    { value: 'discount', label: 'Discounted' },
    { value: 'ad', label: 'Advertisement' },
    { value: 'unknown', label: 'Unknown' }
  ]
}

export default Vue.extend({
  components: {
    Container,
    Layout,
    Input
  },
  transition: 'slide-down',
  async fetch() {
    const { status, statusText, data } = await API.getProduct(this.$route.params.id)

    if (status !== 200) {
      this.error = `Error. http ${status}: ${statusText}. ${data?.error}: ${data?.message}`
      return
    }
    if (!data) return

    this.prod = data

    if (this.prod.data.until === 0) {
      this.broker.until = new Date().toISOString().split('T')[0] + 'T00:00'
      this.broker.noDate = true
    } else {
      const d = new Date(this.prod.info.until * 1000)
      this.broker.until = `${d.toISOString().split('T')[0]}T${(d.getHours() + '').padStart(2, '0')}:${(d.getMinutes() + '').padStart(2, '0')}`
    }
    this.broker.flagTrash = !!(this.prod.data.flags & 1)
    this.broker.flagThirdparty = !!(this.prod.data.flags & 2)
    this.broker.flagPermanent = !!(this.prod.data.flags & 4)
    this.broker.flagStaffPick = !!(this.prod.data.flags & 8)
    this.broker.tags = this.prod.data.tags.join(', ') || ''
    this.broker.rating = ~~((this.prod.data.rating || 0) * 100)
  },
  data() {
    return {
      prod: null as any,
      broker: {
        until: '',
        noDate: false,
        flagTrash: false,
        flagThirdparty: false,
        flagPermanent: false,
        flagStaffPick: false,
        tags: '',
        rating: 0
      },
      dropdowns,
      error: ''
    }
  }
})
</script>

<style scoped lang="scss">

</style>
