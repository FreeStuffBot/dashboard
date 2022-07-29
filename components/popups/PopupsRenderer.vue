<template>
  <div class="popups" :empty="!active">
    <div class="curtain" :active="active" />
    <div v-if="popup" class="popup" :active="active" :mobile="popup.type >= 100" @click.self="close()">
      <PopupFrameModal v-if="popup.type === 0" :data="popup" @close="close" />
      <PopupFrameNewProduct v-if="popup.type === 1" :data="popup" @close="close" />
      <PopupFrameEditPlatform v-if="popup.type === 2" :data="popup" @close="close" />
      <PopupFrameEditCurrency v-if="popup.type === 3" :data="popup" @close="close" />
      <PopupFrameQuestion v-if="popup.type === 4" :data="popup" @close="close" />
      <PopupFrameForm v-if="popup.type === 5" :data="popup" @close="close" />

      <PopupFrameProductCardAction v-if="popup.type === 101" :data="popup" @close="close" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PopupFrameModal from '~/components/popups/PopupFrameModal.vue'
import PopupFrameNewProduct from '~/components/popups/PopupFrameNewProduct.vue'
import PopupFrameEditPlatform from '~/components/popups/PopupFrameEditPlatform.vue'
import PopupFrameEditCurrency from '~/components/popups/PopupFrameEditCurrency.vue'
import PopupFrameQuestion from '~/components/popups/PopupFrameQuestion.vue'
import PopupFrameForm from '~/components/popups/PopupFrameForm.vue'
import PopupFrameProductCardAction from './mobile/PopupFrameProductCardAction.vue'

export default Vue.extend({
  components: {
    PopupFrameModal,
    PopupFrameNewProduct,
    PopupFrameEditPlatform,
    PopupFrameEditCurrency,
    PopupFrameQuestion,
    PopupFrameForm,
    PopupFrameProductCardAction
},
  data() {
    return {
      lastPopup: {} as any
    }
  },
  computed: {
    popups(): any[] {
      return this.$store.state.popups
    },
    active(): boolean {
      return !!this.$store.state.popups.length
    },
    popup(): any {
      return this.$store.state.popups[this.$store.state.popups.length - 1] || this.lastPopup
    }
  },
  watch: {
    '$store.state.popups.length'(len) {
      if (!len) return
      this.lastPopup = this.$store.state.popups[len - 1]
    }
  },
  methods: {
    close(handled = false) {
      this.$store.commit('closePopup')
      this.popup.onClose?.(handled)
    }
  }
})
</script>

<style scoped lang="scss">
.popups {
  overflow: hidden;

  &[empty] {
    pointer-events: none;
  }
}

.container, .curtain, .popup {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
}

.curtain {
  background-color: #88888800;
  backdrop-filter: blur(0);
  transition:
    background-color .2s ease,
    backdrop-filter .2s ease;

  &[active] {
    background-color: #000000aa;
    backdrop-filter: blur(2px);
  }
}

.popup {
  display: grid;
  place-items: center;
  overflow-x: hidden;

  & > div {
    box-sizing: border-box;
    width: 90vw;
    max-width: 450pt;
    padding: $box-padding;
    margin: 10vh 0;
    background-color: $backpage;
    border-radius: $box-br;
    box-shadow:
      0 0 0 1px #ffffff22 inset,
      0 2px 10px #000000aa;
    transition:
      opacity .2s ease,
      transform .2s ease,
      box-shadow .2s ease;
  }

  &:not([active]) > div {
    opacity: 0;
    transform: translateY(15%) scale(0.96);
    box-shadow:
      0 0 0 1px #ffffff22 inset,
      0 5px 30px #00000033;
  }

  &[mobile] {
    place-items: end stretch;

    & > div {
      width: 100vw;
      margin-bottom: 0;
      border-radius: calc($box-br * 2) calc($box-br * 2) 0 0;
      box-shadow: 0 2px 10px #000000aa;
    }

    &:not([active]) > div {
      transform: translateY(100%);
      box-shadow: 0 5px 30px #00000033;
    }
  }
}
</style>
