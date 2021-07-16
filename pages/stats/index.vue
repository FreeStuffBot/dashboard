<template>
  <div :class="{ container: true, 'loading-animation-queued': !loadingFinished }">
    <div v-if="!analysis" class="stats-cont">
      <h1>Stats <img v-tippy="{delay: [500, 0], arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}" src="~/assets/icons/reload.svg" alt="Reload" content="Refresh Stats" @click.prevent="$fetch()"></h1>
      <div v-if="stats" class="stats">
        <StatsPanel
          title="Overview"
          :dataset="stats"
          :timespan="timespan"
          :mode="mode"
          type="overview"
          ia-margin="0"
        />
        <StatsPanel
          title="Userbase"
          :dataset="[{ name: 'Guilds', data: stats.guilds }, { name: 'Member', data: stats.members }]"
          :timespan="timespan"
          :mode="mode"
          type="graph"
          ia-margin="1"
        />
        <StatsPanel
          title="Announcements Made"
          :dataset="[{ name: 'Count', data: stats.announcements }]"
          :timespan="timespan"
          :mode="mode"
          :defmode="1"
          type="graph"
          ia-margin="2"
        />
        <StatsPanel
          title="Total Shard Reconnects"
          :dataset="[{ name: 'Count', data: stats.reconnects }]"
          :timespan="timespan"
          :mode="mode"
          :defmode="1"
          type="graph"
          ia-margin="3"
        />
      </div>
      <span v-else minor>Loading...</span>
    </div>
    <div v-else class="analysis-cont">
      <h1>Analysis <img v-tippy="{delay: [500, 0], arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}" src="~/assets/icons/reload.svg" alt="Reload" content="Refresh Stats" @click.prevent="$fetch()"></h1>
      <div v-if="settings.raw.length" class="analysis">
        <StatsPanel
          :title="`All ${settings.raw.length} Guilds:`"
          :dataset="[
            { left: `Euro (${settings.currency})`, right: `Dollar (${settings.raw.length - settings.currency})`, value: settings.currency / settings.raw.length },
            { left: `Auto-Reaction Off (${settings.react})`, right: `Auto-Reaction On (${settings.raw.length - settings.react})`, value: settings.react / settings.raw.length },
            { left: `Trash Games Off (${settings.trash})`, right: `Trash Games On (${settings.raw.length - settings.trash})`, value: settings.trash / settings.raw.length },
            { left: `Free until 11/7/2024 (${settings.altDate})`, right: `Free until next Friday (${settings.raw.length - settings.altDate})`, value: settings.altDate / settings.raw.length }
          ]"
          type="barcharts"
        />
        <StatsPanel
          title="Top Themes"
          :dataset="settings.themes"
          type="ranking"
        />
        <StatsPanel
          title="Top Languages"
          :dataset="settings.langs"
          type="ranking"
        />
      </div>
    </div>
    <div class="hovercp">
      <div class="inner">
        <div class="controls">
          <div class="cscont" :disabled="analysis">
            <a b :selected="timespan == -1" href="" @click.prevent="timespan = -1">Alltime</a>
            <a b :selected="timespan == 30" href="" @click.prevent="timespan = 30">30 Days</a>
            <a b :selected="timespan == 14" href="" @click.prevent="timespan = 14">14 Days</a>
            <a b :selected="timespan == 7" href="" @click.prevent="timespan = 7">7 Days</a>
            <div class="divider" />
            <a g :selected="mode == 0" href="" @click.prevent="mode = 0">Total</a>
            <a g :selected="mode == 1" href="" @click.prevent="mode = 1">Delta</a>
            <a g :selected="mode == 2" href="" @click.prevent="mode = 2">Week</a>
            <div class="divider" />
          </div>
          <a r :selected="analysis" href="" @click.prevent="analysis = !analysis; $fetch()">Analysis</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import StatsPanel from '~/components/StatsPanel.vue'

export default Vue.extend({
  components: {
    StatsPanel
  },
  transition: 'slide-down',
  data() {
    return {
      stats: undefined,
      timespan: 7,
      mode: 0,
      analysis: false,
      settings: {
        raw: [] as number[],
        currency: 0,
        react: 0,
        trash: 0,
        altDate: 0,
        themes: [] as number[],
        langs: [] as number[]
      },
      loadingFinished: false
    }
  },
  async fetch() {
    const stats = await axios.get('/stats/all')
    this.stats = stats.data

    if (this.analysis) {
      const settings = await axios.get('/stats/settings')
      this.settings.raw = settings.data as number[]
      let currency = 0
      let react = 0
      let trash = 0
      let altDate = 0
      const themes = new Array(16).fill(0)
      const langs = new Array(32).fill(0)
      for (const el of this.settings.raw) {
        if ((el & (1 << 4)) === 0) currency++
        if ((el & (1 << 5)) === 0) react++
        if ((el & (1 << 6)) === 0) trash++
        if ((el & (1 << 7)) === 0) altDate++
        themes[el & 0b1111]++
        langs[el >> 8 & 0b11111]++
      }
      this.settings.currency = currency
      this.settings.react = react
      this.settings.trash = trash
      this.settings.altDate = altDate

      const themesOut = []
      for (let i = 0; i < themes.length; i++) {
        if (!themes[i]) continue
        themesOut.push({
          value: themes[i],
          label: `Theme ${i + 1}`
        })
      }

      const langsOut = []
      for (let i = 0; i < langs.length; i++) {
        if (!langs[i]) continue
        langsOut.push({
          value: langs[i],
          label: this.$store.state.lang['lang_' + i] || 'Unknown'
        })
      }

      Vue.set(this.settings, 'themes', themesOut)
      Vue.set(this.settings, 'langs', langsOut)
    }

    // eslint-disable-next-line nuxt/no-timing-in-fetch-data
    setTimeout(() => (this.loadingFinished = true), 10)
  },
  fetchOnServer: false,
  head() {
    return {
      title: 'FreeStuff Stats'
    }
  }
})
</script>

<style scoped lang="scss">
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;

  &[minor] { color: #888888; }
}

h1 img {
  height: 11pt;
  opacity: .4;
  padding: 3px;
  margin: 0 0 0 3px;
  cursor: pointer;

  &:hover { opacity: .7; }
}

.hovercp {
  position: sticky;
  margin-top: $box-padding;
  bottom: -2vh;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: visible;
  transition: transform .3s $ease-out-circ;

  .inner {
    display: block;
    background-color: $bg-darker;
    border-radius: $box-border-radius;
    box-shadow:
      0 2.8px 2.2px rgba(0, 0, 0, 0.045),
      0 6.7px 5.3px rgba(0, 0, 0, 0.065),
      0 12.5px 10px rgba(0, 0, 0, 0.08),
      0 22.3px 17.9px rgba(0, 0, 0, 0.095),
      0 41.8px 33.4px rgba(0, 0, 0, 0.115),
      0 100px 80px rgba(0, 0, 0, 0.16);
    padding: $box-padding;

    .controls {
      font-family: $font-regular;
      margin: 0;
      font-size: 10pt;

      .cscont {
        display: inline;
        opacity: 1;
        pointer-events: unset;
        filter: none;
        transition: all .2s ease;

        &[disabled] {
          opacity: .3;
          pointer-events: none;
          filter: grayscale(.5);
        }
      }

      .divider {
        display: inline-block;
        width: 1px;
        height: 10px;
        opacity: .5;
        margin: 0px 10px;
        background-color: $color-minor;
      }

      a {
        display: inline-block;
        margin-left: 2px;
        padding: 4pt 10pt;
        border-radius: 20px;
        text-decoration: none;
        transition: all .2s ease;

        &[b] {
          color: transparentize($primary-blue, .5);
          background-color: transparentize($primary-blue, 1);

          &:hover { background-color: transparentize($primary-blue, .8); color: $primary-blue; }
          &[selected] { background-color: $primary-blue !important; color: black; }
        }
        &[g] {
          color: transparentize($info-major, .5);
          background-color: transparentize($info-major, 1);

          &:hover { background-color: transparentize($info-major, .8); color: $info-major; }
          &[selected] { background-color: $info-major !important; color: black; }
        }
        &[r] {
          color: transparentize($primary-orange, .5);
          background-color: transparentize($primary-orange, 1);

          &:hover { background-color: transparentize($primary-orange, .8); color: $primary-orange; }
          &[selected] { background-color: $primary-orange !important; color: black; }
        }
      }
    }
  }
}

</style>
