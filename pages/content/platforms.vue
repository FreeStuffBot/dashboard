<template>
  <Container>
    <h1>CMS Platforms</h1>

    <Admonition v-if="error" type="error" :text="error" />
    <Layout v-else-if="items" name="component-flow">
      <PlatformCard
        v-for="item of items"
        :key="item.id"
        :data="item"
        :editable="true"
        @refresh="(yes) => (yes ? $fetch() : {})"
      />

      <Layout name="inline">
        <Button
          type="green"
          text="Add Platform"
          @click="addPlatform"
        />
      </Layout>
    </Layout>
    <p v-else>
      Loading...
    </p>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import { openErrorModal, openQuestionDialogue } from '../../lib/popups'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import PlatformCard from '~/components/cards/PlatformCard.vue'
import Button from '~/components/entities/Button.vue'
import Admonition from '~/components/entities/Admonition.vue'

export default Vue.extend({
  components: {
    Container,
    Layout,
    PlatformCard,
    Button,
    Admonition
  },
  transition: 'slide-down',
  async fetch() {
    const { data, status, statusText } = await API.getPlatformList()
    if (status === 200) {
      this.items = data
      return
    }

    this.error = `Error. http ${status}: ${statusText}.\n${data?.error}: ${data?.message}`
  },
  data() {
    return {
      error: '',
      items: null
    }
  },
  methods: {
    async addPlatform() {
      const id = await openQuestionDialogue(
        this.$store,
        'New Platform',
        'Give your new platform a nice id',
        'ID',
        'epic',
        (input: string) => /^[a-z]{2,12}$/.test(input)
          ? ''
          : 'Id must match /^[a-z]{2,12}$/'
      )

      if (!id) return

      const { data, status, statusText } = await API.postPlatform(id)
      if (status !== 200) {
        openErrorModal(this.$store, status, statusText, data)
        return
      }

      this.$fetch()
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
