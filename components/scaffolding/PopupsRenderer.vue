<template>
  <div class="popups" :empty="!active">
    <div class="curtain" :active="active" />
    <div v-if="popup" class="popup" @click.self="close()">
      <div class="inner" :active="active">
        <h1 v-if="popup.title" v-text="popup.title" />
        <p
          v-for="(line, i) of (popup.text ? popup.text.split('\n') : [])"
          :key="i"
        >
          <span
            v-for="(part, j) of line.split('**')"
            :key="j"
            :bold="j % 2 === 1"
            v-text="part"
          />
        </p>
        <Layout v-if="popup.buttons" name="center" class="buttons">
          <Button
            v-for="(data, i) of popup.buttons"
            :key="i"
            :type="data.type"
            :text="data.text"
            @click="clickButton(data)"
          />
        </Layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from '~/components/layout/Layout.vue'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Layout,
    Button
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
    },
    clickButton(button: any) {
      const closePopup = button.onClick()
      if (closePopup) this.close(true)
    }
  }
})
</script>

<style scoped lang="scss">
.popups[empty] {
  pointer-events: none;
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
  transition: background-color .2s ease;

  &[active] {
    background-color: #000000aa;
  }
}

.popup {
  display: grid;
  place-items: center;
  overflow-x: hidden;
}

.inner {
  box-sizing: border-box;
  width: 90vw;
  max-width: 450pt;
  padding: $box-padding;
  margin: 10vh 0;
  background-color: $backpage;
  border-radius: $box-br;
  transition:
    opacity .2s ease,
    transform .2s ease;

  &:not([active]) {
    opacity: 0;
    transform: translateY(15%) scale(0.96);
  }

  h1 {
    width: 100%;
    margin-top: 0;
    text-align: center;
  }

  p {
    width: 100%;
    margin-top: 0;
    // text-align: center;

    span[bold] {
      font-family: $font-header;
      color: $color-header;
    }
  }

  .buttons {
    margin-top: 0;
  }
}
</style>
