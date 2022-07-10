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
          :selected="selected.includes(service.id)"
        >
          <p class="id" v-text="service.id" @click="toggleSelect(service.id)" />
          <p class="minmax" :data-ok="isServiceOk(service)" v-text="`${service.found.length} / ${service.min}-${service.max}`" />
          <div class="instances">
            <span
              v-for="container of service.found"
              :key="container.id"
              :selected="selected.includes(container.id)"
              @click="toggleSelect(container.id)"
              v-text="container.id.substring(0, 6)"
            />
          </div>
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
    },
    selected: {
      type: Array,
      default: []
    }
  },
  methods: {
    isServiceOk(service: any): boolean {
      const count = service.found.length
      if (count < service.min) return false
      if (count > service.max) return false
      return true
    },
    toggleSelect(name: string): void {
      if (this.selected.includes(name))
        this.selected.splice(this.selected.indexOf(name), 1)
      else
        this.selected.push(name)
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

  .id {
    cursor: pointer;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $color-border;
  }

  &[selected] {
    background-color: $color-major;
    * { color: $color-blue; }
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

.instances {
  display: flex;
  align-items: center;
  height: 100%;

  span {
    background-color: $color-blue-20;
    color: $color-major;
    height: fit-content;
    font-family: monospace;
    font-size: 11pt;
    padding: 3pt 4pt;
    border-radius: 3px;
    // border: 1px solid $backpage;
    cursor: pointer;

    &[selected] {
      background-color: $color-major;
      color: $color-blue;
    }
  }
}
</style>
