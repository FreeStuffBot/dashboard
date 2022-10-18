<template>
  <div class="admin-network-cards">
    <Layout name="flow">
      <div
        v-for="group of data"
        :key="group.name"
        class="group"
        :data="group"
      >
        <h3 v-text="group.name" />
        <div class="services">
          <div
            v-for="service of group.services"
            :key="service.id"
            class="service"
          >
            <p v-text="service.id" />
          </div>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from '~/components/layout/Layout.vue'

export default Vue.extend({
  components: {
    Layout
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  }
})
</script>

<style scoped lang="scss">
.admin-network-cards {
  width: 100%;
  max-width: 550pt;
}
</style>
