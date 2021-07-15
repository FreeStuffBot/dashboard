import Vue from 'vue'
import { Line } from 'vue-chartjs'

Vue.component('LineChart', {
  extends: Line,
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  watch: {
    data(value) {
      // eslint-disable-next-line no-unused-expressions
      this._chart?.destroy()
      this.renderChart(value, this.options)
    }
  },
  mounted() {
    this.renderChart(this.data, this.options)
  }
})
