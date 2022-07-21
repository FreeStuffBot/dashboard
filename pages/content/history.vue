<template>
  <Container>
    <h1>Announcement History</h1>
    <Layout name="component-flow">
      <Admonition
        v-if="error"
        type="error"
        :text="error"
      />
      <div v-for="day of list">
        <h2 v-text="day[1]" />
        <Layout name="3static">
          <ProductCard
            v-for="product of day[2]"
            :key="product.name"
            :data="product"
          />
        </Layout>
      </div>
      <Layout name="inline">
        <Button
          type="blue"
          text="Load More"
          @click="loadMore()"
        />
      </Layout>
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'
import ProductCard from '~/components/cards/ProductCard.vue'
import Button from '~/components/entities/Button.vue'
import API from '../../lib/api'
import Admonition from '../../components/entities/Admonition.vue'
import Layout from '../../components/layout/Layout.vue'

export default Vue.extend({
  components: {
    Container,
    ProductCard,
    Button,
    Admonition,
    Layout
},
  transition: 'slide-down',
  async fetch() {
    this.loadMore()
  },
  data() {
    return {
      error: '',
      list: [] as [number, string, any[]][],
      offset: 0
    }
  },
  methods: {
    appendItems(items: any[]) {
      this.offset += items.length

      for (const item of items) {
        const date = new Date(item.changed)
        const dateIdx = date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDay()
        const dateTitle = date.toDateString()
        const found = this.list.find(([ idx ]) => (idx === dateIdx))
        if (found) {
          found[2].push(item)
        } else {
          this.list.push([ dateIdx, dateTitle, [ item ] ])
          this.list = this.list.sort(([a], [b]) => (b - a))
        }
      }
    },
    async loadMore() {
      const { data, status, statusText } = await API.getProductList({
        offset: this.offset,
        queryName: 'published'
      })

      if (status !== 200) {
        this.error = `Error. http ${status}: ${statusText}. ${data?.error}: ${data?.message}`
        return
      }
      if (!data) return

      this.error = ''
      this.appendItems(data)
    }
  },
  head() {
    return {
      title: 'FreeStuff CMS'
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">

</style>
