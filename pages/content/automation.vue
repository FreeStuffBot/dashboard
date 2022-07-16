<template>
  <Container>
    <h1>Content Automation</h1>
    <h2>Emergency Controls</h2>

    <Button
      type="red"
      text="Disable all automation"
      :disabled="true /* TODO */"
    />

    <h2>Platforms</h2>
    <div class="platform-table">
      <div>
        <h3>Automated</h3>
        <div v-for="p of automatedPlatforms" class="platform" @click="editPlatform(p)">
          <img :src="p.assets.icon" alt="Platform icon">
          <span v-text="p.name" />
        </div>
      </div>
      <div>
        <h3>Manual</h3>
        <div v-for="p of manualPlatforms" class="platform" @click="editPlatform(p)">
          <img :src="p.assets.icon" alt="Platform icon">
          <span v-text="p.name" />
        </div>
      </div>
    </div>

    <h2>More soon!</h2>
    <p>Got plans for this!</p>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'
import Pagelink from '~/components/entities/Pagelink.vue'
import Button from '../../components/entities/Button.vue'
import { openPopup, Popup, PopupType } from '../../lib/popups'


export default Vue.extend({
  components: {
    Container,
    Pagelink,
    Button
  },
  transition: 'slide-down',
  head() {
    return {
      title: 'FreeStuff CMS'
    }
  },
  fetchOnServer: false,
  computed: {
    automatedPlatforms(): any[] {
      return this.$store.state.content.platforms
        .filter(p => p.autoPublish)
    },
    manualPlatforms() {
      return this.$store.state.content.platforms
        .filter(p => !p.autoPublish)
    }
  },
  methods: {
    editPlatform(platform: any) {
      const popup: Popup<PopupType.EDIT_PLATFORM> = {
        type: PopupType.EDIT_PLATFORM,
        data: platform,
        callback: (refresh: boolean) => this.reload(refresh)
      }

      openPopup(this.$store, popup)
    },
    reload(gate: boolean) {
      if (gate) this.$store.dispatch('content/load', 'platforms')
    }
  }
})
</script>

<style scoped lang="scss">
.platform-table {
  width: 100%;
  border: $border;
  border-radius: $box-br;
  display: grid;
  grid-template-columns: 1fr 1fr;
  
  & > :not(:last-child) {
    border-right: $border;
  }

  & > * {
    padding: $box-padding;
  }

  h3 {
    margin-bottom: 10pt;
  }

  .platform {
    $padding: 6pt;

    padding: $padding;
    margin: 0 calc(-1 * $padding);
    border-radius: $content-br;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: $padding;
    transition: background-color .1s ease;

    &:hover {
      background-color: $bg-light;
    }

    &:last-child {
      margin-bottom: calc(-1 * $padding);
    }

    img {
      width: 15pt;
      height: 15pt;
    }

    span {
      color: $color-regular;
      font-family: $font-major;
      font-size: 9pt;
    }
  }
}
</style>
