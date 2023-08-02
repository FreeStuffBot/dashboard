<template>
  <div class="rich-radio">
    <label
      v-if="label || error"
      :for="'dynamic-input-' + uid"
      :data-error="!!error"
      v-text="label ? `${label}${(error && typeof error === 'string') ? ` • ${error}` : ''}` : error"
    />
    <div class="wrapper">
      <div
        v-for="option of options"
        :key="option.value"
        class="inner"
        :data-disabled="disabled"
        :data-error="!!error"
        :data-state="option.value === value"
        tabindex="0"
        @click="update(option.value)"
        @keydown.enter.prevent="update(option.value)"
      >
        <div class="knob" :data-active="(option.value === value)">
          <div />
        </div>
        <span v-text="option.label" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array<{ value, label }>,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [ String, Number, Boolean ],
      required: true
    },
    error: {
      type: [ String, Boolean ],
      default: false
    }
  },
  data() {
    return {
      uid: ''
    }
  },
  mounted() {
    this.uid = Math.floor(Math.random() * 0xFFFFFFFF).toString(16)
  },
  methods: {
    update(value: any) {
      this.$emit('input', value)
    }
  }
})
</script>

<style scoped lang="scss">
.rich-radio .wrapper {
  border: 1px solid $bg-light;
  border-radius: $content-br;
  background-color: $bg-dark;
}

.rich-radio .inner {
  @include a11y-hover;

  align-items: center;
  overflow: hidden;
  color: $color-regular;
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 1fr;
  box-sizing: border-box;
  padding: calc($content-padding * 1.5);
  gap: $content-padding;
  align-content: center;
  border: 1px solid transparent;
  transition:
    background-color .1s ease;

  &[data-state] {
    background-color: $color-green-20;
    border: 1px solid $color-green !important;
  }

  &:first-child {
    border-radius: $content-br $content-br 0 0;
  }

  &:last-child {
    border-radius: 0 0 $content-br $content-br;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $bg-light;
  }

  .knob {
    width: 12pt;
    height: 12pt;
    border: 2px solid $color-regular;
    border-radius: 999pt;
    display: grid;
    place-items: center;

    &[data-active] div {
      background-color: $color-regular;
      width: 9pt;
      height: 9pt;
      border-radius: 999pt;
    }
  }

  span {
    font-family: $font-regular;
    font-size: 12pt;
    color: inherit;
    user-select: none;
  }

  &[data-error] {
    border-color: $color-red;
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: .8;
    color: $color-sub;
    border-color: $bg-dark;
  }

  &[data-preview] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}

.preview {
  display: flex;
  align-items: center;
  overflow: hidden;
  color: $color-regular;
  background-color: $bg-dark;
  border: 1px solid $bg-light;
  border-bottom: none;
  border-radius: $content-br $content-br 0 0;

  &[data-error] {
    border-color: $color-red;
  }
}
</style>
