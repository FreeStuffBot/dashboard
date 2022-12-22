<template>
  <div class="rich-input">
    <div v-if="enums">
      <label v-text="label" />
      <Layout
        name="$11"
        :tight="true"
      >
        <Input
          v-for="opt of enums"
          :key="opt"
          type="toggle"
          :placeholder="opt"
          :value="enumIncluded(opt)"
          @input="clickEnum(opt)"
        />
      </Layout>
    </div>
    <InputEnum
      v-else-if="array"
      :value="value"
      @input="data => update(data)"
      :label="label"
      add="Add"
    >
      <template slot-scope="{ value, update, remove }">
        <Layout name="$1a" :tight="true">
          <Input v-model="value" :type="type" :placeholder="placeholder" @input="update" />
          <Button text="X" type="light" @click="remove" />
        </Layout>
      </template>
    </InputEnum>
    <Input
      v-else
      :value="value"
      @input="data => update(data)"
      :placeholder="placeholder"
      :label="label"
      :type="type"
      :multiline="multiline"
      :options="options"
      :disabled="disabled"
      :inline="inline"
      :monospace="monospace"
      :numMin="numMin"
      :numMax="numMax"
      :numStep="numStep"
      :editorHeights="editorHeights"
      :error="error"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Input from './Input.vue'
import InputEnum from './InputEnum.vue'
import Button from './Button.vue'

export default Vue.extend({
  components: {
    Input,
    InputEnum,
    Button
  },
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
      type: Array<{ value, label }>,
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
    array: {
      type: Boolean,
      default: false
    },
    enums: {
      type: [ String ],
      default: null
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
  methods: {
    update(value?: any) {
      this.$emit('input', value ?? (this.$refs.input as any)?.value)
    },
    clickEnum(opt: string) {
      if (!this.array) {
        this.update(opt)
        return
      }

      if (!this.value) this.value = []
      if (this.value.includes(opt))
        this.value.splice(this.value.indexOf(opt), 1)
      else
        this.value.push(opt)
      this.update(this.value)
    },
    enumIncluded(opt: string) {
      if (this.array)
        return this.value?.includes(opt)
      return this.value === opt
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
