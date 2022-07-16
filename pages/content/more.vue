<template>
  <Container>
    <h1>More Content Moderation</h1>
    <p>These are the secret archives</p>

    <Layout name="3static">
      <Pagelink
        title="Edit Platforms"
        text="Change names, assets, meta info, and more"
        icon="emojis/twemoji_shopping_cart"
        to="/content/platforms"
      />
      <Pagelink
        title="Edit Currencies"
        text="Change names, assets, and more"
        icon="emojis/twemoji_coin"
        to="/content/currencies"
      />
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'
import Pagelink from '~/components/entities/Pagelink.vue'


export default Vue.extend({
  components: {
    Container,
    Pagelink
  },
  transition: 'slide-down',
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
