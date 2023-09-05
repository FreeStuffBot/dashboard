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
    <Admonition v-if="error" type="error" :text="error" />
    <div class="platform-table">
      <div v-for="p of platforms" class="platform">
        <div class="name" @click="editPlatform(p)">
          <img :src="p.assets.icon || '/assets/img/defaulticon.png'" alt="Platform icon">
          <span v-text="p.name" />
        </div>
        <div
          v-for="interval of [ 'never', '3h', '6h', '12h', '24h' ]"
          :key="interval"
          class="slot"
          :data-selected="p.scoutInterval === interval"
          @click="setPlatformInterval(p, interval)"
        >
          <span v-text="interval" />
        </div>
        <div
          class="slot"
          :data-selected="p.autoPublish"
          @click="setPlatformAutopublish(p, !p.autoPublish)"
        >
          <span v-text="(p.autoPublish ? '✓' : 'X') + ' Auto Publish'" />
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'
import Pagelink from '~/components/entities/Pagelink.vue'
import Button from '../../components/entities/Button.vue'
import { openPopup, Popup, PopupType } from '../../lib/popups'
import API from '../../lib/api'


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
  data() {
    return {
      error: ''
    }
  },
  fetchOnServer: false,
  computed: {
    platforms(): any[] {
      return this.$store.state.content.platforms
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
    async setPlatformInterval(platform: any, scoutInterval: string) {
      const { data, status, statusText } = await API.patchPlatform(platform.id, { scoutInterval })
      if (status !== 200) {
        this.error = `Error. http ${status}: ${statusText}.\n${data?.error}: ${data?.message}`
        return
      }

      this.$store.dispatch('content/load', 'platforms')
    },
    async setPlatformAutopublish(platform: any, autoPublish: boolean) {
      const { data, status, statusText } = await API.patchPlatform(platform.id, { autoPublish })
      if (status !== 200) {
        this.error = `Error. http ${status}: ${statusText}.\n${data?.error}: ${data?.message}`
        return
      }

      this.$store.dispatch('content/load', 'platforms')
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
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .platform {
    $padding: 10pt;

    cursor: pointer;
    display: grid;
    grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr 2fr;
    transition: background-color .1s ease;

    &:hover {
      background-color: #ffffff04;
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid $bg-light;
    }

    & > * {
      transition: inherit;

      &:hover {
        background-color: $bg-lighter;
      }
    }

    .name {
      display: flex;
      align-items: center;
      gap: $padding;
      padding: $padding;
      border-right: $border;
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

    .slot {
      &:not(:nth-last-child(2)) {
        border-right: 1px solid $bg-light;
      }

      &:last-child {
        border-left: $border;
      }

      span {
        margin: 3pt;
        width: calc(100% - 6pt);
        height: calc(100% - 6pt);
        border-radius: 2pt;
        display: grid;
        place-items: center;
        color: $color-minor;
      }

      &[data-selected] span {
        color: $color-green;
        background-color: $color-green-20;
      }
    }
  }
}
</style>
