<template>
  <Container>
    <h1>CMS Currencies</h1>

    <Layout v-if="items" name="flow">
      <CurrencyCard
        v-for="item of items"
        :key="item.id"
        :data="item"
        :editable="true"
        @refresh="reload"
      />

      <Layout name="inline">
        <Button
          type="green"
          text="Add Currency"
          @click="addCurrency"
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
import { openErrorModal, openPopup, openQuestionDialogue, Popup, PopupType } from '../../lib/popups'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import CurrencyCard from '~/components/cards/CurrencyCard.vue'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Container,
    Layout,
    CurrencyCard,
    Button
  },
  transition: 'slide-down',
  computed: {
    items(): any[] {
      return this.$store.state.content.currencies
    }
  },
  methods: {
    async addCurrency() {
      const id = await openQuestionDialogue(
        this.$store,
        'New Currency',
        'Give your new currency a nice id',
        'ID',
        '6',
        (input: string) => /^\d{1,2}$/.test(input)
          ? ''
          : 'Id must be a number'
      )

      if (!id) return

      const { data, status, statusText } = await API.postCurrency(id)
      if (status !== 200) {
        openErrorModal(this.$store, status, statusText, data)
        return
      }

      this.reload(true)

      const popup: Popup<PopupType.EDIT_CURRENCY> = {
        type: PopupType.EDIT_CURRENCY,
        data,
        callback: (refresh: boolean) => this.reload(refresh)
      }

      openPopup(this.$store, popup)
    },
    reload(gate: boolean) {
      if (gate) this.$store.dispatch('content/load', 'currencies')
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
