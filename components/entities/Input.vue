<template>
  <div class="rich-input">
    <label
      v-if="label || error"
      :for="'dynamic-input-' + uid"
      :error="!!error"
      v-text="label ? `${label}${(error && typeof error === 'string') ? ` • ${error}` : ''}` : error"
    />
    <div
      class="inner"
      :multiline="multiline"
      :disabled="disabled"
      :inline="inline"
      :error="!!error"
    >
      <textarea
        v-if="multiline"
        :id="'dynamic-input-' + uid"
        ref="input"
        :disabled="disabled"
        :placeholder="placeholder"
        :value="value"
        @input="update()"
      />
      <select
        v-else-if="options"
        :id="'dynamic-input-' + uid"
        ref="input"
        :disabled="disabled"
        :placeholder="placeholder"
        :value="value"
        @input="update()"
      >
        <option
          v-for="option of options"
          :key="option.value"
          :value="option.value"
          v-text="option.label"
        />
      </select>
      <input
        v-else
        :id="'dynamic-input-' + uid"
        ref="input"
        :type="type"
        :disabled="disabled"
        :min="numMin"
        :max="numMax"
        :placeholder="placeholder"
        :value="value"
        @input="update()"
      >
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
    type: {
      type: String,
      default: 'text'
    },
    multiline: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    value: {
      type: [ String, Number ],
      required: true
    },
    numMin: {
      type: Number,
      default: 0
    },
    numMax: {
      type: Number,
      default: 999999999
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
    update() {
      this.$emit('input', (this.$refs.input as any).value)
    }
  }
})
</script>

<style scoped lang="scss">
.rich-input .inner {
  @include a11y-hover;

  display: flex;
  align-items: center;
  overflow: hidden;
  color: $color-regular;
  background-color: $bg-dark;
  border: 1px solid $bg-light;
  border-radius: $content-br;
  transition:
    background-color .1s ease,
    border-color .1s ease;

  ::placeholder {
    font-family: $font-regular;
    color: $color-regular;
    opacity: .5;
  }

  &[error] { border: 1px solid $color-red; }
  &:hover:not([disabled]) { border-color: $bg-lighter; }
  &[disabled] {
    cursor: not-allowed;
    opacity: .8;
  }
  &:not([multiline]) {
    &[inline] {
      display: inline-flex;
      width: max-content;
      height: unset;

      input, select { padding: $content-padding/3 !important; }
    }
    &:not([inline]) {
      height: calc(#{$content-height} - 2px);
    }
  }

  &[multiline] textarea {
    height: $content-height*2;
    min-height: $content-height/2;
    max-height: $content-height*5;
  }

  &:focus-within:not([disabled]) {
    color: $color-major;
    border-color: $color-blue;
  }
}

textarea {
  min-height: 4em;
  max-height: 12em;
  resize: vertical;
}

select {
  width: calc(100% + 2px) !important;
  height: calc(100% + 4px) !important;
  padding: calc(2px + #{$content-padding}) !important;
  margin: -2px -1px !important;
}

option {
  background-color: $bg-dark;
}

input, textarea, select {
  width: 100%;
  padding: $content-padding $content-padding*1.5;
  font-family: $font-regular;
  font-size: 12pt;
  color: inherit;
  background-color: transparent;
  border: none;
  outline: none;

  &:disabled { cursor: not-allowed; }
  &[type^="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
}

label {
  &[error] { color: $color-red; }
}
</style>
