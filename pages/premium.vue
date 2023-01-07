<template>
  <Container>
    <h1>FreeStuff Premium</h1>
    <p>Purchase FreeStuff Premium for your Discord Server.</p>
    <Layout v-if="data" name="flow">
      <SubscriptionSlot v-for="slot,i of data.slots" :key="slot.id" :index="i" :data="slot" />
      <!-- <SubscriptionSlot :data="null" /> -->
      <!-- TODO show ADD SUBSCRIPTION button -->
      <!-- TODO show ENTER CODE button -->
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'
import Layout from '~~/components/layout/Layout.vue'
import SubscriptionSlot from '~~/components/other/SubscriptionSlot.vue'


export default Vue.extend({
  components: {
    SubscriptionSlot,
    Layout,
    Container
},
  transition: 'slide-down',
  async fetch() {
  },
  data() {
    return {
      error: '',
      data: {
        slots: [
          {
            // unique slot id
            id: 'ab71be7ca732',
            // used for which discord server
            usedFor: '94412477139248572',
            // where does the slot come from?
            source: {
              // this one is a subscription. could also be a coupon/gift code, patreon unlocked or similar
              type: 'subscription',
              // reference to the source. since this is a subscription it just shows the user who subscribed
              ref: '13748128472212342'
            }
          },
          {
            id: '4d81e8a8831',
            usedFor: '',
            source: {
              type: 'code',
              ref: '73b9aea718d2'
            }
          }
        ]
      }
    }
  },
  fetchOnServer: false,
  methods: {
  },
  head() {
    return {
      title: 'Buy FreeStuff Premium'
    }
  }
})
</script>

<style scoped lang="scss">

</style>
