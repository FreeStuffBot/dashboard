<template>
  <Container>
    <h1>Content Moderation</h1>
    <p>You stand between the pages. What do you want?</p>

    <Layout name="3static">
      <Pagelink
        title="Publishing"
        text="Create and moderate announcements."
        icon="emojis/twemoji_mega"
        to="/content/publishing"
      />
      <Pagelink
        title="View History"
        text="Show a list of all published products."
        icon="emojis/twemoji_news"
        to="/content/history"
      />
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
