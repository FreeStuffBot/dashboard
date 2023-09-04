<template>
  <div
    class="product-card"
    :draggable="draggable"
    :dragged="dragged"
    @dragstart.self="e => passEvent('dragstart', e)"
    @dragend.self="e => passEvent('dragend', e)"
    @click.left.exact="e => clicked(e)"
    @click.right.exact.prevent="passEvent('moveannounce')"
  >
    <div v-if="data.status === 'processing'" class="thumb processing">
      <Icon name="animated/loading_processing" />
    </div>
    <div v-else class="thumb" :style="`background-image: url('${data.data.thumbnails.org}')`" />
    <h3 v-text="data.data.title || '‎'" />
    <span class="status" :style="`--color: ${statusColor}`" v-text="$store.state.lang[data.status]" />
    <span v-text="`${$store.state.lang[data.responsible]}, ${data.data.platform}`" />
    <span v-text="localizedChangedText" />
    <span class="fsuri" v-text="idToFsuri(data.id, 'P')" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { openPopup, PopupType } from '../../lib/popups'
import { idToFsuri } from '~/lib/utils'

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
    statusColor(): string {
      switch (this.data.status) {
        case 'pending': return 'var(--color-orange)'
        case 'approved': return 'var(--color-green)'
        case 'published': return 'var(--color-blue)'
        case 'declined': return 'var(--color-red)'
        default: return 'var(--color-minor)'
      }
    },
    localizedChangedText(): string {
      return new Date(this.data.changed)
        .toLocaleString(undefined, {
          day: 'numeric',
          month: 'numeric',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
    },
    draggable() {
      return this.$listeners && this.$listeners.dragstart
    }
  },
  methods: {
    idToFsuri,
    passEvent(name: string, data: any = null) {
      this.$emit(name, data)
    },
    clicked(e: PointerEvent) {
      if (e.pointerType === 'mouse') {
        this.$router.push(`/content/${this.data.id}`)
      } else {
        openPopup(this.$store, {
          type: PopupType.MOBILE_PRODUCT_CARD_ACTION,
          data: JSON.parse(JSON.stringify(this.data)),
          doEdit: () => this.$router.push(`/content/${this.data.id}`),
          doMoveToAnnouncement: () => this.passEvent('moveannounce')
        })
      }
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
  gap: 2pt;
  cursor: pointer;
  box-shadow:
    0 0 0 1px #ffffff11 inset,
    0 2px 6px #00000077;
  transition:
    background-color .1s ease-out,
    box-shadow .1s ease-out,
    transform .1s ease-out;

  &[draggable] {
    cursor: grab;
  }

  &[dragged] {
    opacity: .5;

    * {
      opacity: 0;
      pointer-events: none;
    }
  }

  &[status="pending"] { --statusColor: #AB6B31; }
  &[status="declined"] { --statusColor: #AB3231; }
  &[status="approved"] { --statusColor: #59AB31; }
  &[status="scheduled"] { --statusColor: #3190AB; }

  &:hover {
    background-color: $bg-lighter;

    &[draggable] {
      box-shadow:
        0 0 0 1px #ffffff11 inset,
        0 7px 15px #00000099;
      transform: translateY(-2px)
    }
  }
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

  &.fsuri {
    width: fit-content;
    background-color: $bg-lighter;
    border: 1px solid $color-border;
    padding: 2pt 4pt;
    border-radius: 999pt;
    font-size: 9pt;
    font-family: $font-major;
    margin-top: 8pt;
  }
}

.thumb {
  width: calc(100% + 2 * #{$box-padding});
  margin: calc(-1 * #{$box-padding});
  display: flex;
  justify-content: center;
  align-items: flex-end;
  box-sizing: border-box;
  margin-bottom: 0;
  background-size: cover;
  background-position: center;
  background-color: #ffffff08;
  height: 50pt;

  @supports(aspect-ratio: 1) {
    height: unset;
    aspect-ratio: 324 / 151;
  }

  &.processing {
    background: transparent !important;
  }

  .icon {
    height: 32pt;
    width: 32pt;
    color: $color-minor;
  }

  @media screen and (max-width: $res-mobile-width) {
    aspect-ratio: unset !important;
    height: 30pt;
  }
}
</style>
