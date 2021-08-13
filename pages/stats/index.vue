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
      <div v-if="settings.total" class="analysis">
        <StatsPanel
          :title="`All ${settings.total} Guilds:`"
          :dataset="[
            { left: `Channel Set (${settings.setup})`, right: `Not Set Up (${settings.total - settings.setup})`, value: settings.setup / settings.total },
            { left: `Role Ping On (${settings.ping})`, right: `Role Ping Off (${settings.total - settings.ping})`, value: settings.ping / settings.total },
            { left: `Auto Reaction On (${settings.react})`, right: `Auto Reaction Off (${settings.total - settings.react})`, value: settings.react / settings.total },
            { left: `Trash Games On (${settings.trash})`, right: `Trash Games Off (${settings.total - settings.trash})`, value: settings.trash / settings.total },
            { left: `Beta On (${settings.beta})`, right: `Beta Off (${settings.total - settings.beta})`, value: settings.beta / settings.total }
          ]"
          type="barcharts"
        />
        <StatsPanel
          title="Themes"
          :dataset="settings.themes.map((value, index) => ({ label: names.themes[index], value })).filter(i => !!i.value)"
          type="ranking"
        />
        <StatsPanel
          title="Currencies"
          :dataset="settings.currencies.map((value, index) => ({ label: names.currencies[index], value })).filter(i => !!i.value)"
          type="ranking"
        />
        <StatsPanel
          title="Languages"
          :dataset="settings.langs.map((value, index) => ({ label: names.languages[index], value })).filter(i => !!i.value)"
          type="ranking"
        />
        <StatsPanel
          title="Prices"
          :dataset="settings.prices.map((value, index) => ({ label: names.prices[index], value })).filter(i => !!i.value)"
          type="ranking"
        />
        <StatsPanel
          title="Stores Enabled"
          :dataset="settings.stores.map((value, index) => ({ label: names.stores[index], value })).filter(i => !!i.value)"
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
import API from '../../lib/api'
import StatsPanel from '~/components/StatsPanel.vue'

export default Vue.extend({
  components: {
    StatsPanel
  },
  transition: 'slide-down',
  async fetch() {
    const stats = await API.getStatsAll()
    this.stats = stats.data

    if (this.analysis) {
      const settings = await API.getStatsSettings()
      this.settings = settings.data
    }

    const { data: langs } = await API.getLanguageList()
    langs.forEach((e: any) => { this.names.languages[e._index] = e.lang_name_en })

    // eslint-disable-next-line nuxt/no-timing-in-fetch-data
    setTimeout(() => (this.loadingFinished = true), 100)
  },
  data() {
    return {
      stats: undefined,
      timespan: 7,
      mode: 0,
      analysis: false,
      settings: {},
      loadingFinished: false,
      names: {
        themes: [
          'Theme 1',
          'Theme 2',
          'Theme 3',
          'Theme 4',
          'Theme 5',
          'Theme 6',
          'Theme 7',
          'Theme 8',
          'Theme 9',
          'Theme 10',
          'Theme 11',
          'Theme 12',
          'Theme 13',
          'Theme 14',
          'Theme 15',
          'Theme 16'
        ],
        currencies: [
          'Euro €',
          'USD $'
        ],
        prices: [
          '0+',
          '1+',
          '3+',
          '10+'
        ],
        stores: [
          'Other',
          'Steam',
          'Epic',
          'Humble',
          'Gog',
          'Origin',
          'Uplay',
          'Itch'
        ],
        languages: [] as any[]
      }
    }
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
