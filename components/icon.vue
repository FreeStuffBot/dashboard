<template>
  <div class="icon component-icon-wrapper" v-html="src" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    src() {
      return require(`assets/icons/${this.name}.svg?raw`)
    }
  }
})
</script>

<style scoped lang="scss">
</style>

<style lang="scss">
.component-icon-wrapper {
  display: flex;
  align-items: center;
  width: 16pt;
  height: 16pt;
}

.component-icon-wrapper svg:not([xmlns\:serif]) path {
  fill: currentColor !important;
}
</style>
