<template>
  <div class="admin-network-table">
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
          <p class="id" v-text="service.id" />
          <p class="minmax" :data-ok="isServiceOk(service)" v-text="`${service.found.length} / ${service.min}-${service.max}`" />
          <p class="status" v-text="getStates(service.found)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    isServiceOk(service: any): boolean {
      const count = service.found.length
      if (count < service.min) return false
      if (count > service.max) return false
      return true
    },
    getStates(found: any): string {
      if (!found?.length) return ''

      const list = {} as any
      for (const container of found)
        list[container.state] = (list[container.state] ?? 0) + 1

      return Object.entries(list)
        .map(([ name, amount ]) => `${amount} ${name}`)
        .join(', ')
    }
  }
})
</script>

<style scoped lang="scss">
.admin-network-table {
  width: calc(100% + #{$box-padding} * 2);
  margin: calc(-1 * #{$box-padding});
}

.group {
  display: grid;
  grid-template-columns: 1fr 5fr;

  &:not(:last-child) {
    border-bottom: 1px solid $color-border;
  }
}

h3 {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: $content-padding;
  border-right: 1px solid $color-border;
}

.service {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  padding-left: $content-padding;

  &:not(:last-child) {
    border-bottom: 1px solid $color-border;
  }
}

.minmax {
  font-family: $font-major;

  &[data-ok] {
    color: $color-green;
  }

  &:not([data-ok]) {
    color: $color-red;
  }
}
</style>
