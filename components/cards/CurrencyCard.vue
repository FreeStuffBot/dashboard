<template>
  <div class="box" :data-editable="editable">
    <div class="symbol">
      <div>
        <span v-text="data.symbol" />
      </div>
    </div>
    <h3 v-text="data.name" />
    <span class="id" v-text="data.id" />
    <Button
      type="blue"
      text="Edit"
      @click="edit"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { openPopup, Popup, PopupType } from '../../lib/popups'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Button
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    edit() {
      const popup: Popup<PopupType.EDIT_CURRENCY> = {
        type: PopupType.EDIT_CURRENCY,
        data: this.data,
        callback: (refresh: boolean) => this.$emit('refresh', refresh)
      }

      openPopup(this.$store, popup)
    }
  }
})
</script>

<style scoped lang="scss">
.box {
  position: relative;
  display: grid;
  background-color: $bg-light;
  padding: $box-padding;
  border-radius: $box-br;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 0 0 1px #ffffff11 inset;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  grid-template-areas: "icon name button" "icon details button";
  column-gap: $box-padding;
  transition: background-color .1s ease-out;

  &:not([data-editable]) { opacity: .5; }

  .symbol {
    grid-area: icon;
    width: $content-height;
    height: $content-height;
    display: inline;

    div {
      display: grid;
      place-items: center;
      width: inherit;
      height: inherit;
      border-radius: $content-br;
      background-color: $bg-lighter;

      span {
        color: $color-major;
        font-family: $font-major;
        font-size: calc(#{$content-height} / 2);
      }
    }
  }

  h3 {
    grid-area: name;
  }

  .rich-button {
    grid-area: button;
  }

  .id {
    grid-area: details;
    color: $color-sub;
    font-family: $font-sub;
    font-size: 12pt;
  }
}
</style>
