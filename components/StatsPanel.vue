<template>
  <div class="statspanel" :class="{ hidden: hidden }">
    <div class="header">
      <div class="title" v-text="title" />
      <a class="mintray" @click.prevent="hidden = !hidden" v-text="hidden ? 'Show' : 'Hide'" />
    </div>
    <div
      class="body"
      :style="`height: ${
        type == 'overview' ? 200 :
        type == 'graph' ? 400 :
        type == 'barcharts' ? (67 * dataset.length - 14) :
        type == 'ranking' ? (25 * dataset.length) :
        400}px`"
    >
      <div v-if="type == 'overview'" class="wrapper overview">
        <div
          v-for="hint of [
            { name: 'Servers', value: dataset.live.guilds },
            { name: 'Last 7 Days', value: addPlusSign(dataset.live.guilds - dataset.guilds[dataset.guilds.length - 7]) },
            { name: 'Today', value: addPlusSign(dataset.live.guilds - dataset.guilds[dataset.guilds.length - 1]) },
            { name: 'Global Rank', value: '#' + dataset.live.ranking },
            { name: 'Shards', value: dataset.live.shards },
            { name: 'Votes (Month)', value: dataset.live.votes },
            { name: 'Avg SpS', value: ~~(dataset.live.guilds / dataset.live.shards), info: 'Average Servers per Shard (SpS)' }
          ]"
          :key="hint.name"
          v-tippy="{arrow : true, arrowType : 'round', animation : 'vertical', duration: hint.info ? 500 : 50000, theme: 'black'}"
          :content="hint.info || ''"
        >
          <span v-text="hint.value" />
          <span v-text="hint.name" />
        </div>
      </div>
      <div v-else-if="type == 'graph'" class="wrapper graph">
        <LineChart :data="chartData" :options="chartOptions" />
      </div>
      <div v-else-if="type == 'barcharts'" class="wrapper barcharts">
        <div v-for="l in dataset" :key="l.left + l.right" class="module">
          <div class="labeling">
            <span v-text="l.left" />
            <span v-text="l.right" />
          </div>
          <div class="bar">
            <div v-tippy="{arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}" :content="`${l.left}: ${(l.value * 100).toPrecision(3)}%`" :style="`width: ${l.value * 100}%`" />
            <div v-tippy="{arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}" :content="`${l.right}: ${((1 - l.value) * 100).toPrecision(3)}%`" />
          </div>
        </div>
      </div>
      <div v-else-if="type == 'ranking'" class="wrapper ranking">
        <div v-for="(l,i) in datasetSorted" :key="i" class="entry">
          <span class="rank" v-text="'#'+(i+1)" />
          <span class="label" v-text="l.label" />
          <span class="value" v-text="`(${l.value})`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true
    },
    dataset: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    timespan: {
      type: Number,
      required: true
    },
    mode: {
      type: Number,
      required: true
    },
    defmode: {
      type: Number,
      default: 0
    }
  },
  data() {
    const yAxes = [ {
      id: 'A',
      type: 'linear',
      position: 'left'
    } ]
    if (this.dataset.length > 1) {
      yAxes.push({
        id: 'B',
        type: 'linear',
        position: 'right'
      })
    }
    return {
      chartOptions: {
        maintainAspectRatio: false,
        backgroundColor: '#ffffff',
        tooltips: {
          enabled: true,
          mode: 'index',
          axis: 'x',
          xPadding: 12,
          yPadding: 12,
          multiKeyBackground: '#000000',
          intersect: false
        },
        scales: {
          yAxes
        }
      },
      hidden: false,
      datasetSorted: [] as any[]
    }
  },
  computed: {
    chartData() {
      let labels: String[] = []
      const set = this.dataset.map((obj: any) => {
        const input: number[] = obj.data
        const data = []
        const localLabels: String[] = []
        if (this.mode === 2) { // weeks
          for (let i = 0; i < input.length; i += 7) {
            let num = 0
            for (let j = 0; j < 7; j++)
              num += input[i + j] - (i === 0 || this.defmode === 1 ? 0 : input[i + j - 1])
            data.push(num < 0 ? 0 : num)
            localLabels.push(`Week ${i / 7 + 1}`)
          }
        } else {
          for (let i = input.length - 1; (i >= input.length - this.timespan) || (this.timespan === -1 && i >= 0); i--) {
            if (this.mode === 0) data.push(input[i])
            else if (this.mode === 1) data.push(input[i] - (i === 0 ? 0 : input[i - 1]))
            localLabels.push(`${new Date(1577833200000 + (i + 1) * 24 * 60 * 60 * 1000).toDateString()}`)
          }
          data.reverse()
        }
        if (localLabels.length > labels.length) labels = localLabels
        return [ data, obj.name ]
      })
      if (this.mode !== 2)
        labels.reverse()
      return {
        labels,
        datasets: set.map((data: [ number[], string ], index: number) => {
          const color = 'F39807,28e7ed'.split(',')[index]
          return {
            label: data[1],
            data: data[0],
            backgroundColor: `#${color}33`,
            borderColor: `#${color}`,
            borderWidth: 1,
            yAxisID: 'AB'[index],
            pointRadius: this.timespan === -1 ? 0 : (this.timespan < 20 ? 4 : 1),
            pointHoverRadius: this.timespan === -1 ? 0 : (this.timespan < 20 ? 4 : 1),
            pointHoverBackgroundColor: '#F3980733'
          }
        })
      }
    }
  },
  watch: {
    dataset() {
      if (this.dataset.length) {
        this.datasetSorted = [ ...this.dataset ]
        this.datasetSorted.sort((a, b) => b.value - a.value)
      }
    }
  },
  mounted() {
    if (this.dataset.length) {
      this.datasetSorted = [ ...this.dataset ]
      this.datasetSorted.sort((a, b) => b.value - a.value)
    }
  },
  methods: {
    addPlusSign(number: number) {
      return `${number > 0 ? '+' : ''}${number}`
    }
  }
})
</script>

<style scoped lang="scss">
.statspanel {
  background-color: $bg-bright;
  padding: $box-padding;
  border-radius: $box-border-radius;
  margin-top: $box-padding / 2;
  transition: padding .2s ease-out;

  &.hidden .header { margin-bottom: 0 !important; }
  &.hidden .title {
    font-size: 13pt !important;
    opacity: .5;
  }
  &.hidden .body {
    height: 0 !important;
    opacity: 0;
  }
  &.hidden {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .header {
    display: block;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: $box-padding;
    transition: margin-bottom .2s ease-out;

    .title {
      font-family: $font-header;
      color: $color-header;
      margin: 0;
      font-size: 16pt;
      transition: font-size .2s ease-out
                , opacity .2s ease-out;
    }

    .mintray {
      font-family: $font-minor;
      color: $color-minor;
      margin: 0;
      font-size: 13pt;
      cursor: pointer;
      user-select: none;
    }
  }

  .body {
    display: block;
    overflow: hidden;
    transition: height .2s ease-out
              , opacity .2s ease-out;

    .wrapper {

      &.overview {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        column-gap: $box-padding / 2;
        row-gap: $box-padding / 2;
        width: 100%;

        div {
          background-color: #00000234;
          padding: $box-padding;
          border-radius: 6pt;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          outline: none;

          span:first-child {
            font-family: $font-header;
            color: #ffffff;
            margin: 0 0 5px 0;
            font-size: 18pt;
          }

          span:last-child {
            font-family: $font-sub;
            color: #ffffffbb;
            margin: 0;
            font-size: 12pt;
            text-align: center;
          }
        }
      }

      &.barcharts {
        .module {
          margin-bottom: $box-padding;
          --c1: #{$info-major};
          --c2: #{$success-major};

          &:nth-child(2n) {
            --c1: #{$warning-major};
            --c2: #{$warning-minor};
          }

          .labeling {
            width: 100%;
            display: flex;
            justify-content: space-between;

            span {
              font-family: $font-major;
              color: $color-major;
              font-size: 12pt;

              &:first-child { color: var(--c1); }
              &:last-child { color: var(--c2); }
            }
          }

          .bar {
            margin-top: $box-padding / 2;
            width: 100%;
            display: flex;
            background: $backpage;
            height: 20px;
            border-radius: 99px;
            overflow: hidden;

            div {
              height: 100%;

              &:first-child { background-color: var(--c1) }
              &:last-child {
                background-color: var(--c2);
                flex-grow: 1;
              }
            }
          }
        }
      }

      &.ranking {
        .entry {
          display: block;
          height: 25px;

          .rank {
            display: inline-block;
            font-family: $font-regular;
            color: $color-sub;
            font-size: 13pt;
            width: 30px;
            text-align: right;
          }

          .label {
            font-family: $font-header;
            color: $color-header;
            font-size: 13pt;
            padding: 0 5px;
          }

          .value {
            font-family: $font-regular;
            color: $color-regular;
            font-size: 10pt;
          }
        }
      }
    }
  }
}

</style>
