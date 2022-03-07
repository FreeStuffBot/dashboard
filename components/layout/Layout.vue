<template>
  <div class="layout" :data-layout="name" :data-tight="tight">
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
    },
    tight: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped lang="scss">
.layout {
  width: 100%;

  --space: #{$box-padding};
  &[data-tight] { --space: calc(#{$box-padding} / 3); }

  &[data-layout="inline"] {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space);
  }

  &[data-layout="center"] {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space);
  }

  &[data-layout="2dynamic"] {
    display: flex;
    justify-content: space-between;
    gap: var(--space);
  }

  &[data-layout="2static"] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space);
  }

  &[data-layout="3dynamic"] {
    display: flex;
    justify-content: space-between;
    gap: var(--space);
  }

  &[data-layout="3static"] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space);
  }

  &[data-layout="4dynamic"] {
    display: flex;
    justify-content: space-between;
    gap: var(--space);
  }

  &[data-layout="4static"] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--space);
  }

  &[data-layout="component-flow"] {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space);
  }

  &[data-layout^="$"] {
    display: grid;
    gap: var(--space);
  }
  @for $i from 1 through 4 {
    @for $j from 1 through 4 {
      &[data-layout="$#{$i}#{$j}"] { grid-template-columns: #{$i*1fr} #{$j*1fr}; }

      @for $k from 1 through 4 {
        &[data-layout="$#{$i}#{$j}#{$k}"] { grid-template-columns: #{$i*1fr} #{$j*1fr} #{$k*1fr}; }
      }
    }
  }
  &[data-layout="$1221"] { grid-template-columns: 1fr 2fr 2fr 1fr; }
}
</style>
