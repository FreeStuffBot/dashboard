<template>
  <div class="tabs">
    <div class="select">
      <button
        v-for="[ name, display ] of slots"
        :key="name"
        :data-selected="name === selected"
        @click="select(name)"
      >
        <h4 v-text="display" />
      </button>
    </div>
    <div class="content">
      <div v-for="[ name ] of slots" :key="name">
        <slot v-if="name === selected" :name="name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      selected: ''
    }
  },
  computed: {
    slots(): [ string, string ][] {
      return Object
        .keys(this.$slots)
        .map(name => ([ name, this.sanitizeName(name) ]))
    }
  },
  mounted() {
    this.selected = Object.keys(this.$slots)[0]
  },
  methods: {
    select(name: string): void {
      this.selected = name
    },
    sanitizeName(name: string): string {
      return name.replace(/-/g, ' ')
    }
  }
})
</script>

<style scoped lang="scss">
.tabs {
  width: 100%;
  max-width: 550pt;
}

.select {
  display: flex;
  gap: $content-padding;
  margin-bottom: $content-padding;

  button {
    all: unset;
    position: relative;
    border-radius: $content-br;
    padding: $content-padding;
    display: flex;
    gap: $content-padding;
    align-items: center;
    transform: scale(1);
    transition: transform .1s ease-out;
    cursor: pointer;

    h4 {
      font-family: $font-major;
      font-size: 11pt;
      color: $color-sub;
      margin: 0;
      z-index: 1
    }

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: $bg-light;
      border-radius: $content-br;
      background-color: #00000000;
      transform: translateX(-$content-padding) scale(0.8);
      transition:
        background-color .1s ease-out,
        transform .1s ease-out;
    }

    &:not([data-selected]):hover::before {
      transform: translateX(-$content-padding) scale(1);
      background-color: $bg-light;
    }

    &:active {
      transform: scale(0.97);
      transition: transform .02s ease-out;
    }

    &[data-selected] {
      background-color: $bg-lighter;

      &::after { transition: none; }

      h4 {
        color: $color-major !important;
      }
    }
  }
}

.content {
  // background-color: $bg-dark;
  border: $border;
  border-radius: $box-br;
  padding: $box-padding;
}
</style>
