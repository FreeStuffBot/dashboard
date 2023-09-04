<template>
  <Container>
    <h1>Announcement History</h1>
    <Layout name="flow">
      <Admonition
        v-if="error"
        type="error"
        :text="error"
      />
      <div v-for="announcement of list" class="announcement">
        <div class="header">
          <h2>{{ $store.state.lang[announcement.responsible] }} &mdash; {{ new Date(announcement.published).toLocaleString() }}</h2>
          <span v-text="idToFsuri(announcement.id, 'A')" />
        </div>
        <div class="products">
          <ProductCard
            v-for="product of announcement.products"
            :key="product.name"
            :data="product"
          />
        </div>
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
import { idToFsuri } from '~/lib/utils'

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
      list: [],
    }
  },
  methods: {
    idToFsuri,
    async loadMore() {
      const { data, status, statusText } = await API.getAnnouncementHistory({
        offset: this.list.length
      })

      if (status !== 200) {
        this.error = `Error. http ${status}: ${statusText}. ${data?.error}: ${data?.message}`
        return
      }
      if (!data) return

      this.error = ''
      this.list.push(...data)
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
.announcement {
  background-color: $bg-dark;
  border-radius: $content-br;
  overflow: hidden;
}

.header {
  color: $color-major;
  font-family: $font-major;
  font-size: 14pt;
  background-color: $bg-darker;
  padding: 8pt 14pt;
  display: flex;
  align-items: center;

  h2 {
    margin: 0;
    flex-grow: 1;
    font-size: 12pt;
  }

  span {
    display: block;
    background-color: $color-green-20;
    border: 1px solid $color-green;
    padding: 5pt 7pt;
    border-radius: 999pt;
    font-size: 9pt;
  }
}

.products {
  padding: $content-padding;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: $content-padding;
}
</style>
