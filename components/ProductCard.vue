<template>
  <div
    class="product-card"
    draggable="true"
    :dragged="dragged"
    @dragstart.self="e => passEvent('dragstart', e)"
    @dragend.self="e => passEvent('dragend', e)"
    @click.left.exact="$router.push(`/content/${data.id}`)"
  >
    <div class="thumb" :style="`background-image: url('${data.data.thumbnails.org}')`" />
    <h3 v-text="data.data.name" />
    <span class="status" :style="`--color: ${statusColor}`" v-text="$store.state.lang[data.status]" />
    <span v-text="$store.state.lang[data.responsible]" />
    <span v-text="'text'" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true
    },
    dragged: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    statusColor() {
      switch (this.data.status) {
        case 'pending': return 'var(--color-orange)'
        default: return 'var(--color-blue)'
      }
    }
  },
  methods: {
    passEvent(name: string, data: any) {
      this.$emit(name, data)
    }
  }
})
</script>

<style scoped lang="scss">
.product-card {
  position: relative;
  display: grid;
  background-color: $bg-light;
  padding: $box-padding;
  border-radius: $box-br;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 0 0 1px #ffffff11 inset;
  gap: 2pt;
  transition: background-color .1s ease-out;
  // cursor: grab;
  cursor: pointer;

  &[dragged] {
    opacity: .5;
    * { opacity: 0; }
  }

  &[status="pending"] { --statusColor: #AB6B31; }
  &[status="declined"] { --statusColor: #AB3231; }
  &[status="approved"] { --statusColor: #59AB31; }
  &[status="scheduled"] { --statusColor: #3190AB; }

  &:hover { background-color: $bg-lighter; }
}

span, h3 {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

h3 {
  margin: $box-padding 0 $content-padding 0;
}

span {
  font-family: $font-regular;
  font-size: 10pt;
  color: $color-regular;

  &.status {
    color: var(--color);
    font-family: $font-major;
    text-transform: capitalize;
  }
}

.thumb {
  width: calc(100% + 2 * #{$box-padding});
  margin: calc(-1 * #{$box-padding});
  box-sizing: border-box;
  margin-bottom: 0;
  background-size: cover;
  background-position: center;
  height: 50pt;
  cursor: grab;

  @supports(aspect-ratio: 1) {
    height: unset;
    aspect-ratio: 16 / 9;
  }
}
</style>
