<template>
  <Container>
    <h1>Billing</h1>
    <p>Paypal test</p>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'


export default Vue.extend({
  components: {
  },
  transition: 'slide-down',
  async fetch() {
  },
  data() {
    return {
      data: null as any,
      error: ''
    }
  },
  fetchOnServer: false,
  methods: {
  },
  head() {
    return {
      title: 'FreeStuff Billing'
    }
  }
})
</script>

<style scoped lang="scss">

</style>
