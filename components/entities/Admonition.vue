<template>
  <div class="rich-admonition" :type="type">
    <Icon :name="getIcon" :title="type" />
    <div class="text">
      <span v-for="(line, i) of text.split('\n')" :key="i" v-text="line" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

/**
 * **TYPES**
 * - warning
 * - error
 * - success
 * - info
 * - default
 */
export default Vue.extend({
  props: {
    type: {
      type: String,
      default: 'default'
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    getIcon() {
      if (this.icon) return this.icon
      switch (this.type) {
        case 'success': return 'success'
        case 'info': return 'info'
        case 'warning': return 'warning'
        case 'error': return 'error'
        default: return 'discord'
      }
    }
  }
})
</script>

<style scoped lang="scss">
.rich-admonition {
  @include box;
  position: relative;
  display: grid;
  grid-template-columns: 15pt 1fr;
  gap: $box-padding;
  font-family: $font-regular;
  font-size: 12pt;
  color: $color-major;

  span {
    display: block;

    &:not(:last-child) {
      margin-bottom: calc(#{$content-padding} / 2);
    }
  }

  .icon {
    width: 15pt;
    height: 15pt;
    color: $color-red;
  }

  &[type="default"] {
    background-color: $bg-dark;
    .icon { color: $color-regular; }
  }

  &[type="success"] {
    background-color: $color-green-20;
    .icon { color: $color-green; }
  }

  &[type="info"] {
    background-color: $color-blue-20;
    .icon { color: $color-blue; }
  }

  &[type="warning"] {
    background-color: $color-yellow-20;
    .icon { color: $color-yellow; }
  }

  &[type="error"] {
    background-color: $color-red-20;
    .icon { color: $color-red; }
  }

  * {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }
}
</style>
