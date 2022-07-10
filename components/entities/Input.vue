<template>
  <div class="rich-input">
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
    <div
      class="inner"
      :data-multiline="multiline"
      :data-disabled="disabled"
      :data-inline="inline"
      :data-error="!!error"
      :data-type="type"
      :data-value="!!value"
      :data-preview="!!preview"
    >
      <div
        v-if="type === 'toggle'"
        class="toggle"
        :data-state="!!value"
        tabindex="0"
        @click="update(!value)"
        @keydown.enter.prevent="update(!value)"
      >
        <Icon :name="value ? 'toggle-on' : 'toggle-off'" />
        <span v-text="placeholder" />
      </div>
      <textarea
        v-else-if="multiline"
        :id="'dynamic-input-' + uid"
        ref="input"
        :disabled="disabled"
        :placeholder="placeholder"
        :monospace="monospace"
        :value="value"
        :style="editorHeightsCss"
        @input="update()"
        @blur="e => $emit('blur', e)"
      />
      <select
        v-else-if="options"
        :id="'dynamic-input-' + uid"
        ref="input"
        :disabled="disabled"
        :placeholder="placeholder"
        :value="value"
        @input="update()"
        @blur="e => $emit('blur', e)"
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
        :step="numStep"
        :placeholder="placeholder"
        :monospace="monospace"
        :value="value"
        @input="update()"
        @blur="e => $emit('blur', e)"
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
    monospace: {
      type: Boolean,
      default: false
    },
    value: {
      type: [ String, Number, Boolean ],
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
    numStep: {
      type: Number,
      default: 1
    },
    editorHeights: {
      type: Array, // min, default, max
      default: undefined
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
    },
    editorHeightsCss(): string {
      if (!this.editorHeights) return ''
      const heights = this.editorHeights.map(h => (typeof h === 'number' ? `${h}pt` : h))
      return `min-height: ${heights[0]}; height: ${heights[1]}; max-height: ${heights[2]}`
    }
  },
  mounted() {
    this.uid = Math.floor(Math.random() * 0xFFFFFFFF).toString(16)
  },
  methods: {
    update(value?: any) {
      this.$emit('input', value ?? (this.$refs.input as any)?.value)
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

  &:not([data-multiline]) {
    &[data-inline] {
      display: inline-flex;
      width: max-content;
      height: unset;

      input, select { padding: calc($content-padding / 3) !important; }
    }
    &:not([data-inline]) {
      height: $content-height;

      &:not([data-type="toggle"]) {
        height: calc(#{$content-height} - 2px);
      }
    }
  }

  &[data-type="toggle"][data-value] {
    border-color: $color-green !important;
  }

  &[data-preview] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &[data-multiline] textarea {
    height: calc($content-height * 2);
    min-height: calc($content-height / 2);
    max-height: calc($content-height * 5);
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
  &[monospace] { font-family: monospace; }
}

.toggle {
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  box-sizing: border-box;
  padding: $content-padding calc((#{$content-height} - 16pt) / 2);
  gap: $content-padding;
  align-content: center;
  color: $color-regular;

  &[data-state] {
    background-color: $color-green-20;
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
}

label[data-error] { color: $color-red; }
</style>
