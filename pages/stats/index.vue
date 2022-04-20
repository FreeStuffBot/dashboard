<template>
  <Container>
    <h1>Stats</h1>
    <p>Stats will be back soon. Please hold on a bit while we polish things up!</p>
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
  head() {
    return {
      title: 'FreeStuff Management'
    }
  }
})
</script>
