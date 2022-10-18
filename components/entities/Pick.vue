<template>
  <div class="rich-pick">
    <label
      v-if="label || error"
      :for="'dynamic-input-' + uid"
      :data-error="!!error"
      v-text="label ? `${label}${(error && typeof error === 'string') ? ` • ${error}` : ''}` : error"
    />
    <div
      v-if="preview"
      class="preview"
      :data-error="!!error"
    >
      <slot name="preview" />
    </div>
    <div class="wrapper">
      <div
        v-for="option of options"
        :key="option.value"
        class="inner"
        :data-disabled="disabled"
        :data-error="!!error"
        :data-preview="!!preview"
        :data-state="option.value === value"
        tabindex="0"
        @click="update(option.value)"
        @keydown.enter.prevent="update(option.value)"
      >
        <Icon :name="(option.value === value) ? 'toggle-on' : 'toggle-off'" />
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
  computed: {
    preview(): boolean {
      return !!(this.$slots as any).preview
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
.rich-pick .wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: $content-padding;
}

.rich-pick .inner {
  @include a11y-hover;

  align-items: center;
  overflow: hidden;
  color: $color-regular;
  background-color: $bg-dark;
  border: 1px solid $bg-light;
  border-radius: $content-br;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  box-sizing: border-box;
  padding: $content-padding calc((#{$content-height} - 16pt) / 2);
  gap: $content-padding;
  align-content: center;
  transition:
    background-color .1s ease,
    border-color .1s ease;

  &[data-state] {
    background-color: $color-green-20;
    border-color: $color-green !important;
  }

  .icon {
    width: 16pt;
    height: 16pt;
    color: inherit;
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

  &:hover:not([data-disabled]):not([data-error]) {
    border-color: $bg-lighter;
  }

  &[data-preview] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &:focus-within:not([data-disabled]) {
    color: $color-major;
    border-color: $color-blue !important;
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
