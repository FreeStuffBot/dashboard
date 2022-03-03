<template>
  <div class="layout" :data-layout="name">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped lang="scss">
.layout {
  width: 100%;

  &[data-layout="inline"] {
    display: flex;
    flex-wrap: wrap;
    gap: $box-padding;
  }

  &[data-layout="center"] {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: $box-padding;
  }

  &[data-layout="2dynamic"] {
    display: flex;
    justify-content: space-between;
    gap: $box-padding;
  }

  &[data-layout="2static"] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $box-padding;
  }

  &[data-layout="3dynamic"] {
    display: flex;
    justify-content: space-between;
    gap: $box-padding;
  }

  &[data-layout="3static"] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: $box-padding;
  }

  &[data-layout="component-flow"] {
    display: grid;
    grid-template-columns: 1fr;
    gap: $box-padding;
  }
}
</style>
