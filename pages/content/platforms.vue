<template>
  <Container>
    <h1>CMS Platforms</h1>
    <p>Soon&trade;</p>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'

export default Vue.extend({
  components: {
    Container
  },
  transition: 'slide-down',
  async fetch() {
  },
  data() {
    return {
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
