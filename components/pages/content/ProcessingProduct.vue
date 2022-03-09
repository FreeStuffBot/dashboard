<template>
  <div>
    <h1>Processing...</h1>
    <Admonition type="info" icon="animated/loading_processing" text="This product is being processed, please wait a few seconds." />
    <h2>What does this mean?</h2>
    <p>The product is most likely getting scraped by our automated systems right now. This page will automatically update once the data is there and ready to be checked.</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../../lib/api'
import Admonition from '~/components/entities/Admonition.vue'

export default Vue.extend({
  components: {
    Admonition
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      interval: 0 as any
    }
  },
  mounted() {
    if (this.interval) clearInterval(this.interval)
    this.interval = setInterval(() => this.checkForUpdates(), 2000)
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval)
  },
  methods: {
    async checkForUpdates() {
      const { status, data } = await API.getProduct(this.$route.params.id)
      if (status === 200 && data.status !== 'processing')
        this.$emit('update', data)
    }
  }
})
</script>

<style scoped lang="scss">
.thumbnail-preview {
  display: block;
  height: 200pt;
  width: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
