<template>
  <Container>
    <div v-if="!prod">
      <Admonition
        v-if="error"
        type="error"
        :text="error"
      />
      <p v-else>
        Loading...
      </p>
    </div>
    <EditableProduct v-else-if="component === 'editable'" :product="prod" @fetch="$fetch" />
    <ProcessingProduct v-else-if="component === 'processing'" :product="prod" @update="update" />
    <PublishedProduct v-else-if="component === 'published'" :product="prod" @fetch="$fetch" />
    <div v-else>
      <p>This product has an unknown status. Could not render view.</p>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import Container from '~/components/layout/Container.vue'
import EditableProduct from '~/components/pages/content/EditableProduct.vue'
import ProcessingProduct from '~/components/pages/content/ProcessingProduct.vue'
import Admonition from '~/components/entities/Admonition.vue'
import PublishedProduct from '../../components/pages/content/PublishedProduct.vue'

export default Vue.extend({
  components: {
    Container,
    EditableProduct,
    ProcessingProduct,
    Admonition,
    PublishedProduct
},
  transition: 'slide-down',
  async fetch() {
    const { status, statusText, data } = await API.getProduct(this.$route.params.id)

    if (status !== 200) {
      this.error = `Error. http ${status}: ${statusText}. ${data?.error}: ${data?.message}`
      return
    }
    if (!data) return

    this.update(data)
  },
  data() {
    return {
      prod: null as any,
      error: ''
    }
  },
  computed: {
    component(): string {
      switch (this.prod?.status) {
        case 'pending': return 'editable'
        case 'approved': return 'editable'
        case 'processing': return 'processing'
        case 'published': return 'published'
        default: return ''
      }
    }
  },
  methods: {
    update(newData: any): void {
      this.$set(this, 'prod', newData)
    }
  }
})
</script>

<style scoped lang="scss">
</style>
