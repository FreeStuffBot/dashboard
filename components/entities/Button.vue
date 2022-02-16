<template>
  <div
    :disabled="disabled"
    class="rich-button"
  >
    <div
      class="button-main"
      :type="type"
      :lite="lite"
      :text="!!text"
      :img="!!img"
      :icon="!!icon"
      tabindex="0"
      @click.prevent="e => $emit('click', e)"
      @keydown.enter.prevent="e => $emit('click', e)"
    >
      <div class="inner">
        <img
          v-if="img"
          class="visual"
          :src="img"
          :imgcrop="imgcrop"
          alt=""
        >
        <Icon
          v-if="icon"
          class="visual"
          :name="icon"
          :imgcrop="imgcrop"
        />
        <span v-if="text" v-text="text" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

/**
 * **TYPES**
 * - primary
 * - secondary
 * - neutral
 * - success
 * - danger
*/
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'blue'
    },
    lite: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    imgcrop: {
      type: String,
      default: 'round'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    overflow: {
      /** { text: string, href?: string, click?: func } */
      type: Array,
      default: () => undefined
    }
  }
})
</script>

<style scoped lang="scss">

.rich-button {
  display: inline-flex;

  &[disabled] {
    pointer-events: none;
    cursor: not-allowed;
    opacity: .5;
  }
}

.button-main {
  @include a11y-hover;

  box-sizing: border-box;
  flex-grow: 1;
  height: $content-height;
  padding: $content-padding $content-padding*2;
  color: #ffffff;
  cursor: pointer;
  border-radius: $content-br;
  outline: none;
  transition:
    background-color .1s ease,
    filter .1s ease;

  * { transition: color .1s ease; }

  &[text] .visual {
    margin-right: $content-padding;
  }

  .inner {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &[img] {
    padding-left: $content-padding;
    &[text] { padding-right: $content-padding*2; }
    &:not([text]) { padding-right: $content-padding; }
  }

  &[icon] {
    padding-left: $content-padding*2;
    &[text] { padding-right: $content-padding*2; }
    &:not([text]) { padding-right: $content-padding*2; }
  }

  &:hover { filter: brightness(1.1); }

  &[type="red"] { --color: #{$color-red}; }
  &[type="yellow"] { --color: #{$color-yellow}; }
  &[type="blue"] { --color: #{$color-blue}; }
  &[type="green"] { --color: #{$color-green}; }
  &[type="dark"] { --color: #{$bg-darker}; }
  &[type="light"] { --color: #{$bg-lighter}; }

  &[lite] {
    margin: 0 #{-$content-padding};
    color: var(--color);
  }
  &:not([lite]) {
    background-color: var(--color);
  }
}

.icon {
  width: 16pt;
  height: 16pt;
  color: inherit;
}

span {
  flex-grow: 1;
  font-family: $font-major;
  font-size: 12pt;
  color: inherit;
  text-align: center;
}

img {
  width: $content-height;
  height: $content-height;

  &[imgcrop="round"] { border-radius: 99pt; }
  &[imgcrop="square"] { border-radius: 4pt; }
}
</style>
