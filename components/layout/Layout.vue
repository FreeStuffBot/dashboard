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
  --space: #{$box-padding};
  &[data-tight] { --space: calc(#{$box-padding} / 3); }
  
  width: 100%;
  display: grid;
  gap: var(--space);

  &[data-layout="inline"] {
    display: flex;
    flex-wrap: wrap;
  }

  &[data-layout="center"] {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  &[data-layout="2dynamic"] {
    display: flex;
    justify-content: space-between;
  }

  &[data-layout="2static"] {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  &[data-layout="3dynamic"] {
    display: flex;
    justify-content: space-between;
  }

  &[data-layout="3static"] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  &[data-layout="4dynamic"] {
    display: flex;
    justify-content: space-between;
  }

  &[data-layout="4static"] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  &[data-layout="flow"] {
    display: grid;
    grid-template-columns: 1fr;
  }

  @for $i from 1 through 4 {
    &[data-layout="#{$i}a"] { grid-template-columns: #{$i*1fr} auto; }

    @for $j from 1 through 4 {
      &[data-layout="#{$i}#{$j}"] { grid-template-columns: #{$i*1fr} #{$j*1fr}; }
      &[data-layout="#{$i}#{$j}a"] { grid-template-columns: #{$i*1fr} #{$j*1fr} auto; }

      @for $k from 1 through 4 {
        &[data-layout="#{$i}#{$j}#{$k}"] { grid-template-columns: #{$i*1fr} #{$j*1fr} #{$k*1fr}; }
      }
    }
  }
  &[data-layout="1221"] { grid-template-columns: 1fr 2fr 2fr 1fr; }
  &[data-layout="1141"] { grid-template-columns: 1fr 1fr 4fr 1fr; }


  @media screen and (max-width: $res-tablet-width) {
    &[data-layout="2static"] {
      grid-template-columns: 1fr;
    }

    &[data-layout="3static"] {
      grid-template-columns: 1fr 1fr;
    }

    &[data-layout="4static"] {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (max-width: $res-mobile-width) {
    &[data-layout="2static"] {
      grid-template-columns: 1fr;
    }

    &[data-layout="3static"] {
      grid-template-columns: 1fr;
    }

    &[data-layout="4static"] {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
