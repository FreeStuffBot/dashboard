<template>
  <NuxtLink class="pagelink" :to="to">
    <Icon v-if="icon" :name="icon" />
    <h3 v-text="title" />
    <span v-text="text" />
  </NuxtLink>
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
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    to: {
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
.pagelink {
  @include box;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-decoration: none;
  gap: $content-padding;
  cursor: pointer;

  &:hover { background-color: $bg-lighter; }
}

h3 {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

span {
  color: $color-sub;
  font-family: $font-regular;
  font-size: 11pt;
}

.icon {
  width: 32pt;
  height: 32pt;
  margin-bottom: $content-padding;
}
</style>
